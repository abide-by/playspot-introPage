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

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatIsoLocal(iso) {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });
  } catch {
    return iso;
  }
}

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
    const portRaw = envFirst("MAIL_PORT", "SMTP_PORT");
    const user = envFirst("MAIL_USER", "SMTP_USER");
    const pass = envFirst("MAIL_PASSWORD", "SMTP_PASS");

    const port = Number(portRaw);
    if (!Number.isFinite(port)) {
      return json(500, { ok: false, error: "INVALID_SMTP_PORT", details: { portRaw } });
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    const subject = `[PLAY SPOT] 창업 문의 - ${name}${company ? ` (${company})` : ""}`;
    const sentAt = new Date().toISOString();

    const text = [
      `이름: ${name}`,
      company ? `회사/브랜드: ${company}` : null,
      `이메일: ${email}`,
      phone ? `연락처: ${phone}` : null,
      "",
      "문의 내용:",
      message,
      "",
      `Sent at: ${sentAt}`,
    ]
      .filter(Boolean)
      .join("\n");

    const html = `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f6f7fb;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#111827;">
    <div style="max-width:720px;margin:0 auto;padding:24px;">
      <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:16px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.05);">
        <div style="padding:18px 20px;background:linear-gradient(135deg,#111827,#334155);color:#ffffff;">
          <div style="font-size:12px;letter-spacing:0.18em;text-transform:uppercase;opacity:0.85;">PLAY SPOT</div>
          <div style="margin-top:6px;font-size:18px;font-weight:700;">창업 문의가 도착했습니다</div>
        </div>

        <div style="padding:20px;">
          <table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:separate;border-spacing:0 10px;">
            <tr>
              <td style="width:120px;color:#6b7280;font-size:13px;">이름</td>
              <td style="font-size:14px;font-weight:600;">${escapeHtml(name)}</td>
            </tr>
            ${
              company
                ? `<tr>
              <td style="width:120px;color:#6b7280;font-size:13px;">회사/브랜드</td>
              <td style="font-size:14px;font-weight:600;">${escapeHtml(company)}</td>
            </tr>`
                : ""
            }
            <tr>
              <td style="width:120px;color:#6b7280;font-size:13px;">이메일</td>
              <td style="font-size:14px;"><a href="mailto:${escapeHtml(email)}" style="color:#2563eb;text-decoration:none;">${escapeHtml(
                email,
              )}</a></td>
            </tr>
            ${
              phone
                ? `<tr>
              <td style="width:120px;color:#6b7280;font-size:13px;">연락처</td>
              <td style="font-size:14px;">${escapeHtml(phone)}</td>
            </tr>`
                : ""
            }
            <tr>
              <td style="width:120px;color:#6b7280;font-size:13px;vertical-align:top;padding-top:6px;">문의 내용</td>
              <td style="font-size:14px;line-height:1.6;background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:12px 14px;white-space:pre-wrap;">${escapeHtml(
                message,
              )}</td>
            </tr>
          </table>
        </div>

        <div style="padding:14px 20px;border-top:1px solid #e5e7eb;color:#6b7280;font-size:12px;">
          Sent at: ${escapeHtml(formatIsoLocal(sentAt))} (KST)
        </div>
      </div>
    </div>
  </body>
</html>`;

    await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
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
    const details = {
      // Helpful for debugging in-browser when platform logs aren't visible.
      code,
      responseCode: err?.responseCode,
      command: err?.command,
      message: typeof message === "string" ? message.slice(0, 300) : undefined,
    };
    return json(500, { ok: false, error: "SEND_FAILED", ...details });
  }
}

