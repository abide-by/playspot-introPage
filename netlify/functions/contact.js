import nodemailer from "nodemailer";

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
    body: JSON.stringify(body),
  };
}

const MAX_MESSAGE_LENGTH = 4000;

function requiredEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

function envFirst(...names) {
  for (const name of names) {
    const v = process.env[name];
    if (v) return v;
  }
  throw new Error(`Missing env var: ${names.join(" or ")}`);
}

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { allow: "POST" },
      body: "Method Not Allowed",
    };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return json(400, { ok: false, error: "INVALID_JSON" });
  }

  // honeypot (bots usually fill hidden fields)
  if (payload.website) return json(200, { ok: true });

  const name = String(payload.name || "").trim();
  const company = String(payload.company || "").trim();
  const email = String(payload.email || "").trim();
  const phone = String(payload.phone || "").trim();
  const message = String(payload.message || "").trim().slice(0, MAX_MESSAGE_LENGTH);

  if (!name || !email || !message) {
    return json(400, { ok: false, error: "MISSING_FIELDS" });
  }

  // very lightweight email check
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json(400, { ok: false, error: "INVALID_EMAIL" });
  }

  try {
    const to = requiredEnv("MAIL_TO");
    const from = requiredEnv("MAIL_FROM");
    // Support both MAIL_* (DaouOffice docs) and SMTP_* (generic naming).
    const host = envFirst("MAIL_HOST", "SMTP_HOST");
    const port = Number(envFirst("MAIL_PORT", "SMTP_PORT"));
    const user = envFirst("MAIL_USER", "SMTP_USER");
    const pass = envFirst("MAIL_PASSWORD", "SMTP_PASS");

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    const subject = `[PLAY SPOT] 창업 문의 - ${name}${company ? ` (${company})` : ""}`;

    const text = [
      `이름: ${name}`,
      company ? `회사/브랜드: ${company}` : null,
      `이메일: ${email}`,
      phone ? `연락처: ${phone}` : null,
      "",
      "문의 내용:",
      message,
      "",
      `Sent at: ${new Date().toISOString()}`,
    ]
      .filter(Boolean)
      .join("\n");

    await transporter.sendMail({
      from,
      to,
      subject,
      text,
      replyTo: email,
    });

    return json(200, { ok: true });
  } catch (err) {
    const code = err?.code || err?.name;
    const message = err?.message;
    // Avoid leaking secrets, but keep enough to debug SMTP failures.
    console.error("contact function failed", {
      code,
      message,
      response: err?.response,
      responseCode: err?.responseCode,
      command: err?.command,
    });
    return json(500, { ok: false, error: "SEND_FAILED", code });
  }
}

