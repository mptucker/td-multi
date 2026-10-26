"use client";

import { FormEvent, useEffect, useState } from "react";
import styles from "./TexomaCollective.module.css";

type InquiryType = "partner" | "group_event" | "general";
const TYPES: [InquiryType, string][] = [["partner", "Business partnership"], ["group_event", "Group or event"], ["general", "Something else"]];

export function InquiryForm({ defaultType = "general" }: { defaultType?: InquiryType }) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<InquiryType>(defaultType);
  const [tier, setTier] = useState("");

  // Links like /contact?type=partner&tier=Grow preselect the conversation.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("type");
    if (t === "partner" || t === "group_event" || t === "general") setType(t);
    setTier(params.get("tier")?.slice(0, 40) ?? "");
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    setMessage("");
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...data, brand: "texomaco", sourcePath: location.pathname + location.search }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "We could not send your inquiry.");
      form.reset();
      setState("sent");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "We could not send your inquiry.");
    }
  }

  if (state === "sent") {
    return (
      <div className={styles.form} role="status">
        <div className={styles.formSent}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/texomaco/pin.png" alt="" width={70} height={94} />
          <h3>Thank you.</h3>
          <p>Your note is with the Texoma Collective team. We will be in touch soon.</p>
        </div>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={submit}>
      <div className={styles.honeypot} aria-hidden="true">
        <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <fieldset className={styles.typePicker}>
        <legend>What kind of conversation?</legend>
        {TYPES.map(([value, label]) => (
          <label key={value}>
            <input type="radio" name="inquiryType" value={value} checked={type === value} onChange={() => setType(value)} required />
            <span>{label}</span>
          </label>
        ))}
      </fieldset>
      <label>Name<input name="name" required maxLength={100} autoComplete="name" /></label>
      <label>Business or organization<input name="organization" maxLength={140} autoComplete="organization" /></label>
      <label>Email<input name="email" type="email" required maxLength={160} autoComplete="email" /></label>
      <label>Phone<input name="phone" type="tel" maxLength={30} autoComplete="tel" /></label>
      <label>Town<input name="town" maxLength={100} autoComplete="address-level2" /></label>
      <label>State<select name="region" defaultValue=""><option value="">Choose</option><option value="TX">Texas</option><option value="OK">Oklahoma</option></select></label>
      <label className={styles.full}>
        What are you trying to make happen?
        <textarea key={tier} name="message" rows={5} required minLength={12} maxLength={3000} defaultValue={tier ? `I'd like to learn more about the ${tier} level.` : ""} />
      </label>
      <label className={`${styles.full} ${styles.consent}`}><input name="consent" type="checkbox" value="yes" required /><span>I agree that Texoma Collective may contact me about this inquiry.</span></label>
      <div className={`${styles.full} ${styles.formFooter}`}>
        <button className={styles.btn} type="submit" disabled={state === "sending"}>{state === "sending" ? "Sending..." : "Start the conversation"}</button>
        <p role="status" className={state === "error" ? styles.formError : ""}>{message}</p>
      </div>
    </form>
  );
}
