interface Env {
  RESEND_API_KEY?: string;
  RESEND_KEY?: string;
  CONTACT_TO_EMAIL?: string;
  MAIL_TO?: string;
  CONTACT_FROM_EMAIL?: string;
  MAIL_FROM?: string;
  /** 예: https://intro.pages.dev — 설정 시 메일 헤더에 /playspot-logo.png 로고 표시 */
  SITE_URL?: string;
  PUBLIC_SITE_URL?: string;
  /** 로고 전체 URL(선택). 있으면 SITE_URL 기본 경로보다 우선 */
  MAIL_LOGO_URL?: string;
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

const escapeAttr = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");

/** 메일 본문 강조색·아이콘 (Lucide Mail 스타일 SVG에 동일 적용) */
const ACCENT = "#FF1C5C";
const BG_PAGE = "#f2eef1";
const CARD = "#ffffff";
const BORDER = "#e8e0e4";
const MUTED = "#64748b";
const TEXT = "#0f172a";
const BOX_BG = "#ffffff";

/** 인라인 SVG를 data URI로 넣어 &lt;img&gt;로 표시 (본문 인라인 SVG는 많은 클라이언트에서 제거됨) */
const MAIL_ICON_DATA_URI =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><rect width="20" height="16" x="2" y="4" rx="2" stroke="#FF1C5C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" stroke="#FF1C5C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  );

const buildInquiryEmailHtml = (
  fields: {
    name: string;
    email: string;
    company: string;
    phone: string;
    message: string;
  },
  logoUrl: string | null,
  mailIconSrc: string,
) => {
  const { name, email, company, phone, message } = fields;
  const row = (label: string, value: string) => `
  <tr>
    <td style="padding:12px 14px 12px 24px;vertical-align:top;font-size:13px;color:${MUTED};width:120px;font-family:'Noto Sans KR',-apple-system,BlinkMacSystemFont,sans-serif;">${label}</td>
    <td style="padding:12px 20px 12px 8px;font-size:15px;color:${TEXT};font-family:'Noto Sans KR',-apple-system,BlinkMacSystemFont,sans-serif;line-height:1.5;">${value}</td>
  </tr>`;

  const headerBrand =
    logoUrl && /^https?:\/\//i.test(logoUrl)
      ? `<img src="${escapeAttr(logoUrl)}" alt="PLAY SPOT" width="120" style="display:block;border:0;outline:none;text-decoration:none;width:120px;max-width:120px;height:auto;" />`
      : `<p style="margin:0;font-size:13px;letter-spacing:0.18em;text-transform:uppercase;color:${ACCENT};font-family:'Noto Sans KR',sans-serif;font-weight:700;">PLAY SPOT</p>`;

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>창업 문의</title>
</head>
<body style="margin:0;padding:0;background:${BG_PAGE};">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${BG_PAGE};padding:28px 16px 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;border-radius:16px;overflow:hidden;border:1px solid ${BORDER};border-top:3px solid ${ACCENT};background:${CARD};box-shadow:0 12px 40px rgba(15,23,42,0.1),0 4px 14px rgba(15,23,42,0.06),0 0 1px rgba(15,23,42,0.08);">
          <tr>
            <td style="padding:22px 28px 22px 28px;background:${CARD};border-bottom:1px solid ${BORDER};">
              ${headerBrand}
              <h1 style="margin:14px 0 0 0;font-size:22px;font-weight:700;font-family:'Noto Sans KR',-apple-system,sans-serif;line-height:1.35;">
                <span style="color:${TEXT};">새 </span><span style="color:${ACCENT};">창업 문의</span><span style="color:${TEXT};">가 도착했습니다</span><img src="${escapeAttr(mailIconSrc)}" alt="" width="26" height="22" style="display:inline-block;vertical-align:-4px;margin-left:10px;border:0;outline:none;" />
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 28px 0 28px;background:${CARD};">
              <p style="margin:20px 0 8px 0;font-size:14px;color:${MUTED};font-family:'Noto Sans KR',sans-serif;line-height:1.6;">
                문의 폼이 제출되었습니다. 이 메일에 <strong style="color:${ACCENT};">답장</strong>하면 문의자 이메일로 바로 회신됩니다.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 28px 28px 28px;background:${CARD};">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;margin-top:8px;border-radius:12px;background:${BOX_BG};border:1px solid ${BORDER};">
                ${row("이름", escapeHtml(name))}
                <tr><td colspan="2" style="border-top:1px solid ${BORDER};height:0;padding:0;"></td></tr>
                ${row("이메일", `<a href="mailto:${escapeHtml(email)}" style="color:${ACCENT};text-decoration:none;font-weight:600;">${escapeHtml(email)}</a>`)}
                <tr><td colspan="2" style="border-top:1px solid ${BORDER};"></td></tr>
                ${row("회사/브랜드", escapeHtml(company))}
                <tr><td colspan="2" style="border-top:1px solid ${BORDER};"></td></tr>
                ${row("연락처", escapeHtml(phone))}
                <tr><td colspan="2" style="border-top:1px solid ${BORDER};"></td></tr>
                <tr>
                  <td colspan="2" style="padding:16px 20px 20px 20px;">
                    <p style="margin:0 0 8px 0;font-size:13px;color:${MUTED};font-family:'Noto Sans KR',sans-serif;padding-left:4px;">문의 내용</p>
                    <div style="font-size:15px;color:${TEXT};font-family:'Noto Sans KR',sans-serif;line-height:1.65;border-radius:8px;background:${CARD};padding:16px 18px;border:1px solid ${BORDER};white-space:pre-wrap;word-break:break-word;overflow-wrap:anywhere;">${escapeHtmlPreformatted(message)}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:0 28px 24px 28px;background:${CARD};">
              <p style="margin:0;font-size:12px;color:${MUTED};font-family:'Noto Sans KR',sans-serif;text-align:center;line-height:1.5;">
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

/** 로고·편지 아이콘 등 정적 파일의 origin (SITE_URL 또는 MAIL_LOGO_URL에서 유도) */
function resolveSiteBase(env: Env): string | null {
  const baseRaw = (env.SITE_URL || env.PUBLIC_SITE_URL || "").trim().replace(/\/$/, "");
  if (baseRaw && /^https?:\/\//i.test(baseRaw)) return baseRaw;
  const custom = (env.MAIL_LOGO_URL ?? "").trim();
  if (custom && /^https?:\/\//i.test(custom)) {
    try {
      return new URL(custom).origin;
    } catch {
      return null;
    }
  }
  return null;
}

/** public/playspot-logo.png */
function resolveMailLogoUrl(env: Env): string | null {
  const custom = (env.MAIL_LOGO_URL ?? "").trim();
  if (custom && /^https?:\/\//i.test(custom)) return custom;
  const base = resolveSiteBase(env);
  if (base) return `${base}/playspot-logo.png`;
  return null;
}

/** public/email-envelope.svg — 없으면 data URI 아이콘 */
function resolveMailIconSrc(env: Env): string {
  const base = resolveSiteBase(env);
  if (base) return `${base}/email-envelope.svg`;
  return MAIL_ICON_DATA_URI;
}

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

    const mailLogoUrl = resolveMailLogoUrl(env);
    const mailIconSrc = resolveMailIconSrc(env);
    const html = buildInquiryEmailHtml(
      {
        name,
        email,
        company: companyLine,
        phone: phoneLine,
        message,
      },
      mailLogoUrl,
      mailIconSrc,
    );

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
