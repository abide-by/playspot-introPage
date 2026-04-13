interface Env {
  RESEND_API_KEY?: string;
  RESEND_KEY?: string;
  CONTACT_TO_EMAIL?: string;
  MAIL_TO?: string;
  CONTACT_FROM_EMAIL?: string;
  MAIL_FROM?: string;
}

type ContactPayload = {
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  message?: string;
  website?: string; // honeypot
};

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const parseRecipients = (raw: string) =>
  raw
    .split(/[,;]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .filter((s) => isValidEmail(s));

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const data = (await request.json()) as ContactPayload;

    // Basic bot trap: hidden field must stay empty.
    if ((data.website ?? "").trim() !== "") {
      return json(200, { ok: true });
    }

    const name = (data.name ?? "").trim();
    const email = (data.email ?? "").trim();
    const message = (data.message ?? "").trim();
    const company = (data.company ?? "").trim();
    const phone = (data.phone ?? "").trim();

    if (!name || !email || !message) {
      return json(400, { ok: false, error: "Missing required fields" });
    }

    const resendApiKey = env.RESEND_API_KEY || env.RESEND_KEY || "";
    const toRaw = env.MAIL_TO || env.CONTACT_TO_EMAIL || "";
    const recipients = parseRecipients(toRaw);
    const from = env.MAIL_FROM || env.CONTACT_FROM_EMAIL || "PlaySpot Contact <onboarding@resend.dev>";

    if (!resendApiKey || recipients.length === 0) {
      return json(500, {
        ok: false,
        error: "Missing server environment variables",
        hint: "Set RESEND_API_KEY (or RESEND_KEY) and MAIL_TO (or CONTACT_TO_EMAIL).",
      });
    }

    const subject = `[PLAY SPOT] 창업 문의 - ${name}`;
    const text = [
      `이름: ${name}`,
      `이메일: ${email}`,
      `회사/브랜드: ${company || "-"}`,
      `연락처: ${phone || "-"}`,
      "",
      "문의 내용:",
      message,
    ].join("\n");

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: recipients,
        reply_to: email,
        subject,
        text,
      }),
    });

    if (!resendRes.ok) {
      const detail = await resendRes.text();
      return json(502, { ok: false, error: "Email provider error", detail });
    }

    return json(200, { ok: true });
  } catch {
    return json(500, { ok: false, error: "Internal server error" });
  }
};
