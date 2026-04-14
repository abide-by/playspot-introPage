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

const digitsOnly = (s: string) => s.replace(/\D/g, "");

/** 한국식 번호: 010은 11자리, 02 지역은 9~10자리, 그 외 10~11자리 */
const isValidKoreanPhone = (value: string) => {
  const d = digitsOnly(value);
  if (!/^0\d+$/.test(d)) return false;
  if (d.length < 9 || d.length > 11) return false;
  if (d.startsWith("010")) return d.length === 11;
  if (d.startsWith("02")) return d.length >= 9 && d.length <= 10;
  return d.length >= 10 && d.length <= 11;
};

const normalizeNewlines = (s: string) => s.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

const escapeHtml = (s: string) =>
  normalizeNewlines(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/\n/g, "<br />");

/** 줄바꿈·띄어쓰기 유지(메일 본문용). HTML 이스케이프만 하고 &lt;br&gt; 대신 pre-wrap 사용 */
const escapeHtmlPreformatted = (s: string) =>
  normalizeNewlines(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** Brand: matches site primary ~ hsl(340, 82%, 52%) */
const BRAND = "#E42475";
const BRAND_DIM = "#F9A8D4";
const BG = "#0f0f12";
const CARD = "#1a1a1f";
const MUTED = "#9ca3af";
const BORDER = "rgba(255,255,255,0.08)";

const buildInquiryEmailHtml = (fields: {
  name: string;
  email: string;
  company: string;
  phone: string;
  message: string;
}) => {
  const { name, email, company, phone, message } = fields;
  const row = (label: string, value: string) => `
  <tr>
    <td style="padding:12px 16px 12px 0;vertical-align:top;font-size:13px;color:${MUTED};width:120px;font-family:'Noto Sans KR',-apple-system,BlinkMacSystemFont,sans-serif;">${label}</td>
    <td style="padding:12px 0;font-size:15px;color:#f4f4f5;font-family:'Noto Sans KR',-apple-system,BlinkMacSystemFont,sans-serif;line-height:1.5;">${value}</td>
  </tr>`;

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>창업 문의</title>
</head>
<body style="margin:0;padding:0;background:${BG};">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${BG};padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;border-radius:16px;overflow:hidden;border:1px solid ${BORDER};background:${CARD};">
          <tr>
            <td style="padding:28px 28px 20px 28px;background:linear-gradient(135deg,${BRAND} 0%,#b91c5c 100%);">
              <p style="margin:0;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.85);font-family:'Noto Sans KR',sans-serif;">PLAY SPOT</p>
              <h1 style="margin:8px 0 0 0;font-size:22px;font-weight:700;color:#ffffff;font-family:'Noto Sans KR',-apple-system,sans-serif;line-height:1.3;">새 창업 문의가 도착했습니다</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 28px 0 28px;">
              <p style="margin:20px 0 8px 0;font-size:14px;color:${MUTED};font-family:'Noto Sans KR',sans-serif;line-height:1.6;">
                문의 폼이 제출되었습니다. 이 메일에 <strong style="color:${BRAND_DIM};">답장</strong>하면 문의자 이메일로 바로 회신됩니다.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 28px 28px 28px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;margin-top:8px;border-radius:12px;background:rgba(255,255,255,0.03);border:1px solid ${BORDER};">
                ${row("이름", escapeHtml(name))}
                <tr><td colspan="2" style="border-top:1px solid ${BORDER};height:0;padding:0;"></td></tr>
                ${row("이메일", `<a href="mailto:${escapeHtml(email)}" style="color:${BRAND_DIM};text-decoration:none;">${escapeHtml(email)}</a>`)}
                <tr><td colspan="2" style="border-top:1px solid ${BORDER};"></td></tr>
                ${row("회사/브랜드", escapeHtml(company))}
                <tr><td colspan="2" style="border-top:1px solid ${BORDER};"></td></tr>
                ${row("연락처", escapeHtml(phone))}
                <tr><td colspan="2" style="border-top:1px solid ${BORDER};"></td></tr>
                <tr>
                  <td colspan="2" style="padding:16px 16px 20px 16px;">
                    <p style="margin:0 0 8px 0;font-size:13px;color:${MUTED};font-family:'Noto Sans KR',sans-serif;">문의 내용</p>
                    <div style="font-size:15px;color:#e5e7eb;font-family:'Noto Sans KR',sans-serif;line-height:1.65;border-radius:8px;background:rgba(0,0,0,0.25);padding:16px;border:1px solid ${BORDER};white-space:pre-wrap;word-break:break-word;overflow-wrap:anywhere;">${escapeHtmlPreformatted(message)}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:0 28px 24px 28px;">
              <p style="margin:0;font-size:12px;color:#6b7280;font-family:'Noto Sans KR',sans-serif;text-align:center;line-height:1.5;">
                PlaySpot 소개 페이지 · 자동 발송 메일입니다.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

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
    const message = normalizeNewlines((data.message ?? "").trim());
    const company = (data.company ?? "").trim();
    const phone = (data.phone ?? "").trim();

    if (!name || !email || !message || !phone) {
      return json(400, { ok: false, error: "Missing required fields" });
    }

    if (!isValidKoreanPhone(phone)) {
      return json(400, { ok: false, error: "Invalid phone" });
    }

    if (!isValidEmail(email)) {
      return json(400, { ok: false, error: "Invalid email" });
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
    const companyLine = company || "-";
    const phoneLine = phone || "-";
    const text = [
      `이름: ${name}`,
      `이메일: ${email}`,
      `회사/브랜드: ${companyLine}`,
      `연락처: ${phoneLine}`,
      "",
      "문의 내용:",
      message,
    ].join("\n");

    const html = buildInquiryEmailHtml({
      name,
      email,
      company: companyLine,
      phone: phoneLine,
      message,
    });

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
        html,
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
