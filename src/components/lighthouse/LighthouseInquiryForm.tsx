"use client";

import { FormEvent, useState } from "react";

type Props = { variant: "group" | "lodge" };

const ACTIVITY_OPTIONS = ["Fishing", "Cruises", "A gathering space", "Lodging", "Help exploring options"];

export function LighthouseInquiryForm({ variant }: Props) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [status, setStatus] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    setStatus("");
    const form = event.currentTarget;
    const data = new FormData(form);
    const activities = data.getAll("activities").map(String).join(", ") || "Not specified";
    const occasion = String(data.get("occasion") || "").trim();
    const message = [
      `Inquiry: ${variant === "lodge" ? "Lighthouse Lodge" : "Lighthouse group getaway"}`,
      `Occasion or group type: ${occasion || "Not specified"}`,
      `Estimated guest count: ${String(data.get("guestCount") || "Not specified")}`,
      `Preferred dates: ${String(data.get("dates") || "Not specified")}`,
      `Lodging needs: ${String(data.get("lodging") || "Not specified")}`,
      `Activities of interest: ${activities}`,
      "",
      String(data.get("notes") || ""),
    ].join("\n");

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          brand: "lighthouse",
          inquiryType: "group_event",
          name: data.get("name"),
          email: data.get("email"),
          phone: data.get("phone"),
          organization: occasion,
          message,
          consent: data.get("consent"),
          website: data.get("website"),
          sourcePath: location.pathname + location.search,
        }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "We could not send your inquiry.");
      form.reset();
      setState("sent");
    } catch (error) {
      setState("error");
      setStatus(error instanceof Error ? error.message : "We could not send your inquiry.");
    }
  }

  if (state === "sent") {
    return <div className="lh-inquiry-success" role="status"><span aria-hidden>✓</span><h3>We have your note.</h3><p>The Lighthouse events team will be in touch to talk through your gathering and date.</p></div>;
  }

  return (
    <form className="lh-inquiry-form" onSubmit={submit}>
      <div className="lh-honeypot" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <label>Name<input name="name" required maxLength={100} autoComplete="name" /></label>
      <label>Email<input name="email" type="email" required maxLength={160} autoComplete="email" /></label>
      <label>Phone<input name="phone" type="tel" required maxLength={30} autoComplete="tel" /></label>
      <label>Occasion or group type<input name="occasion" required maxLength={140} placeholder="Company retreat, reunion, wedding..." /></label>
      <label>Estimated guest count<input name="guestCount" type="number" min="1" max="250" inputMode="numeric" /></label>
      <label>Preferred dates or date range<input name="dates" maxLength={120} placeholder="A date, month, or a few options" /></label>
      <label className="lh-form-wide">Lodging needs<select name="lodging" defaultValue=""><option value="">Choose one</option><option>No lodging needed</option><option>Cabins</option><option>RV sites</option><option>Cabins and RV sites</option><option>Not sure yet</option></select></label>
      <fieldset className="lh-form-wide lh-activity-picker"><legend>Activities of interest</legend>{ACTIVITY_OPTIONS.map((activity) => <label key={activity}><input type="checkbox" name="activities" value={activity} /><span>{activity}</span></label>)}</fieldset>
      <label className="lh-form-wide">What should we know?<textarea name="notes" rows={5} required minLength={12} maxLength={2200} placeholder={variant === "lodge" ? "Tell us how you picture the day, the room setup, and any questions you have." : "Tell us what would make this gathering feel like a great trip for your group."} /></label>
      <label className="lh-form-wide lh-form-consent"><input name="consent" type="checkbox" value="yes" required /><span>I agree that Lighthouse Resort & Marina may contact me about this inquiry.</span></label>
      <div className="lh-form-wide lh-form-submit"><button className="lh-button lh-button-red" type="submit" disabled={state === "sending"}>{state === "sending" ? "Sending..." : variant === "lodge" ? "Ask about your date" : "Plan your group getaway"}<span aria-hidden>↗</span></button><p role="status" className={state === "error" ? "is-error" : ""}>{status}</p></div>
    </form>
  );
}
