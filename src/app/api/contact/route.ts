import { NextResponse } from "next/server";

export const runtime = "nodejs";
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }

  if (body.website) return NextResponse.json({ ok: true }); // honeypot: silently drop bots

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const subject = String(body.subject ?? "").trim();
  const message = String(body.message ?? "").trim();

  if (name.length < 2 || name.length > 100) return NextResponse.json({ error: "Please enter a valid name." }, { status: 400 });
  if (!emailRe.test(email) || email.length > 200) return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  if (subject.length < 3 || subject.length > 150) return NextResponse.json({ error: "Please enter a valid subject." }, { status: 400 });
  if (message.length < 10 || message.length > 5000) return NextResponse.json({ error: "Message must be 10–5000 characters." }, { status: 400 });

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!key || !to || !from) {
    console.error("Contact form: missing RESEND_API_KEY / CONTACT_TO_EMAIL / CONTACT_FROM_EMAIL");
    return NextResponse.json({ error: "Email service is not configured yet. Please email me directly." }, { status: 503 });
  }

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from, to: [to], reply_to: email,
        subject: `[Portfolio] ${subject}`,
        html: `<h2>New portfolio message</h2><p><b>Name:</b> ${esc(name)}</p><p><b>Email:</b> ${esc(email)}</p><p><b>Subject:</b> ${esc(subject)}</p><hr/><p style="white-space:pre-wrap">${esc(message)}</p>`,
      }),
    });
    if (!r.ok) { console.error("Resend error", r.status, await r.text()); return NextResponse.json({ error: "Could not send your message. Please try again later." }, { status: 502 }); }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Could not send your message. Please try again later." }, { status: 502 });
  }
}
