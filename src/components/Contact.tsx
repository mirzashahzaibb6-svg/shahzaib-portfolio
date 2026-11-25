"use client";
import { useRef, useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { FiMail, FiPhone, FiGithub, FiMessageCircle } from "react-icons/fi";
import { FaLinkedinIn } from "react-icons/fa";
import { site } from "@/data/site";
import { useReveal } from "./useReveal";

type Errors = Partial<Record<"name" | "email" | "subject" | "message", string>>;
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(v: { name: string; email: string; subject: string; message: string }): Errors {
  const e: Errors = {};
  if (v.name.trim().length < 2) e.name = "Please enter your name.";
  if (!emailRe.test(v.email.trim())) e.email = "Please enter a valid email address.";
  if (v.subject.trim().length < 3) e.subject = "Please add a subject.";
  if (v.message.trim().length < 10) e.message = "Message must be at least 10 characters.";
  return e;
}

export default function Contact() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<{ kind: "idle" | "sending" | "ok" | "err"; msg?: string }>({ kind: "idle" });

  async function onSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const form = ev.currentTarget;
    const fd = new FormData(form);
    const v = { name: String(fd.get("name") || ""), email: String(fd.get("email") || ""), subject: String(fd.get("subject") || ""), message: String(fd.get("message") || ""), website: String(fd.get("website") || "") };
    const errs = validate(v);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(v) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setStatus({ kind: "ok", msg: "Thanks! Your message has been sent. I'll get back to you soon." });
      form.reset();
    } catch (e) {
      setStatus({ kind: "err", msg: (e as Error).message || "Could not send your message. Please email me directly." });
    }
  }

  const field = "w-full rounded-lg border border-white/10 bg-white/[.04] px-4 py-3 text-sm outline-none transition placeholder:text-white/30 focus:border-ember focus:bg-white/[.07]";
  const links = [
    { Icon: FiMail, label: "Email", href: `mailto:${site.email}`, text: site.email },
    { Icon: FiPhone, label: "Phone", href: `tel:+${site.phoneIntl}`, text: site.phone },
    { Icon: FiMessageCircle, label: "WhatsApp", href: `https://wa.me/${site.phoneIntl}`, text: site.phone },
    { Icon: FiGithub, label: "GitHub", href: site.github, text: "mirzashahzaibb6-svg" },
    { Icon: FaLinkedinIn, label: "LinkedIn", href: site.linkedin, text: "shahzaib-mughal" },
  ];

  return (
    <section id="contact" ref={ref} className="section">
      <div className="grid gap-12 md:grid-cols-[1fr_1.1fr]">
        <div data-reveal>
          <p className="label mb-5 text-ember">● Available for work</p>
          <h2 className="font-display text-[clamp(2.4rem,7vw,5.5rem)] font-extrabold uppercase leading-[.95] tracking-tight">
            Let&apos;s build <span className="font-serif font-normal normal-case italic text-ember">great</span> products.
          </h2>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-white/60">Have a project in mind? Send a message, or reach me directly through any of the links below.</p>
          <ul className="mt-10 space-y-3">
            {links.map(({ Icon, label, href, text }) => (
              <li key={label}>
                <motion.a whileHover={{ x: 8 }} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
                  className="glass flex items-center gap-4 rounded-xl px-4 py-3 transition-colors hover:border-ember/60">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ember/15 text-ember"><Icon size={16} /></span>
                  <span><span className="label block">{label}</span><span className="text-sm">{text}</span></span>
                </motion.a>
              </li>
            ))}
          </ul>
        </div>

        <form data-reveal onSubmit={onSubmit} noValidate className="glass space-y-4 rounded-2xl p-5 md:p-8">
          <p className="label">/ Send a message</p>
          <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
          {(["name", "email", "subject"] as const).map((n) => (
            <div key={n}>
              <label htmlFor={n} className="label mb-2 block">{n}</label>
              <input id={n} name={n} type={n === "email" ? "email" : "text"} className={field} placeholder={n === "email" ? "you@example.com" : n === "name" ? "Your name" : "What is this about?"} aria-invalid={!!errors[n]} />
              {errors[n] && <p className="mt-1 text-xs text-accent">{errors[n]}</p>}
            </div>
          ))}
          <div>
            <label htmlFor="message" className="label mb-2 block">message</label>
            <textarea id="message" name="message" rows={5} className={field} placeholder="Tell me about your project…" aria-invalid={!!errors.message} />
            {errors.message && <p className="mt-1 text-xs text-accent">{errors.message}</p>}
          </div>
          <button disabled={status.kind === "sending"} className="w-full rounded-full bg-ember px-6 py-4 text-[.7rem] font-bold uppercase tracking-[.2em] text-black transition hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(242,107,58,.45)] disabled:opacity-60">
            {status.kind === "sending" ? "Sending…" : "Send message"}
          </button>
          <div aria-live="polite">
            {status.kind === "ok" && <p className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">{status.msg}</p>}
            {status.kind === "err" && <p className="rounded-lg border border-accent/50 bg-accent/10 px-4 py-3 text-sm text-red-300">{status.msg}</p>}
          </div>
        </form>
      </div>
      <footer className="mt-24 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6">
        <span className="label">© {new Date().getFullYear()} {site.name}</span>
        <a href="#home" className="label hover:text-accent">Back to top ↑</a>
      </footer>
    </section>
  );
}
