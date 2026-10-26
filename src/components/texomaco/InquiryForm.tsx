"use client";

import { FormEvent, useState } from "react";
import styles from "./TexomaCollective.module.css";

export function InquiryForm({ defaultType = "general" }: { defaultType?: "partner" | "group_event" | "general" }) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

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
        body: JSON.stringify({ ...data, brand: "texomaco", sourcePath: location.pathname }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "We could not send your inquiry.");
      form.reset();
      setState("sent");
      setMessage("Thank you. Your note is with the Texoma Collective team.");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "We could not send your inquiry.");
    }
  }

  return (
    <form className={styles.form} onSubmit={submit}>
      <div className={styles.honeypot} aria-hidden="true">
        <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <label className={styles.full}>What kind of conversation?<select name="inquiryType" defaultValue={defaultType} required><option value="general">General</option><option value="partner">Business partnership</option><option value="group_event">Group or event</option></select></label>
      <label>Name<input name="name" required maxLength={100} autoComplete="name" /></label>
      <label>Business or organization<input name="organization" maxLength={140} autoComplete="organization" /></label>
      <label>Email<input name="email" type="email" required maxLength={160} autoComplete="email" /></label>
      <label>Phone<input name="phone" type="tel" maxLength={30} autoComplete="tel" /></label>
      <label>Town<input name="town" maxLength={100} autoComplete="address-level2" /></label>
      <label>State<select name="region" defaultValue=""><option value="">Choose</option><option value="TX">Texas</option><option value="OK">Oklahoma</option></select></label>
      <label className={styles.full}>What are you trying to make happen?<textarea name="message" rows={6} required minLength={12} maxLength={3000} /></label>
      <label className={`${styles.full} ${styles.consent}`}><input name="consent" type="checkbox" value="yes" required /><span>I agree that Texoma Collective may contact me about this inquiry.</span></label>
      <div className={`${styles.full} ${styles.formFooter}`}><button type="submit" disabled={state === "sending"}>{state === "sending" ? "Sending..." : "Start the conversation"}<span>↗</span></button><p role="status" className={state === "error" ? styles.formError : ""}>{message}</p></div>
    </form>
  );
}
