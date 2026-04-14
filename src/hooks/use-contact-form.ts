import { useEffect, useMemo, useRef, useState } from "react";

type SubmitState = "idle" | "success" | "error";

type ContactFormState = {
  name: string;
  company: string;
  email: string;
  phone: string;
  message: string;
  website: string;
};

const COMMON_EMAIL_DOMAINS = [
  "naver.com",
  "daum.net",
  "hanmail.net",
  "kakao.com",
  "gmail.com",
  "outlook.com",
  "hotmail.com",
  "yahoo.com",
  "icloud.com",
  "playspot.co.kr",
] as const;

const EMPTY_FORM: ContactFormState = {
  name: "",
  company: "",
  email: "",
  phone: "",
  message: "",
  website: "",
};

function formatKoreanPhoneInput(raw: string): string {
  const d = raw.replace(/\D/g, "");
  if (d.startsWith("02")) {
    const n = d.slice(0, 10);
    if (n.length <= 2) return n;
    if (n.length <= 5) return `${n.slice(0, 2)}-${n.slice(2)}`;
    if (n.length <= 9) return `${n.slice(0, 2)}-${n.slice(2, 5)}-${n.slice(5)}`;
    return `${n.slice(0, 2)}-${n.slice(2, 6)}-${n.slice(6, 10)}`;
  }
  const n = d.slice(0, 11);
  if (n.length <= 3) return n;
  if (n.length <= 7) return `${n.slice(0, 3)}-${n.slice(3)}`;
  return `${n.slice(0, 3)}-${n.slice(3, 7)}-${n.slice(7)}`;
}

function isValidKoreanPhone(s: string): boolean {
  const d = s.replace(/\D/g, "");
  if (!/^0\d+$/.test(d)) return false;
  if (d.length < 9 || d.length > 11) return false;
  if (d.startsWith("010")) return d.length === 11;
  if (d.startsWith("02")) return d.length >= 9 && d.length <= 10;
  return d.length >= 10 && d.length <= 11;
}

function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
}

export function useContactForm() {
  const [contactOpen, setContactOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitDone, setSubmitDone] = useState<SubmitState>("idle");
  const [form, setForm] = useState<ContactFormState>(EMPTY_FORM);
  const [emailFieldFocused, setEmailFieldFocused] = useState(false);
  const [emailSuggestIndex, setEmailSuggestIndex] = useState(0);
  const phoneInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!contactOpen) return;
    setSubmitDone("idle");
    setEmailFieldFocused(false);
    setEmailSuggestIndex(0);
  }, [contactOpen]);

  /** 왜: 입력 오타를 줄이고 빠른 작성 경험을 위해 도메인 자동완성 후보를 계산한다. */
  const emailSuggestions = useMemo(() => {
    const at = form.email.indexOf("@");
    if (at <= 0) return [];
    const localPart = form.email.slice(0, at).trim();
    if (!localPart) return [];

    const domainInput = form.email.slice(at + 1).toLowerCase();
    const exactDomain = COMMON_EMAIL_DOMAINS.find((d) => d === domainInput);
    if (exactDomain && isValidEmail(form.email)) return [];

    const matched = (
      domainInput ? COMMON_EMAIL_DOMAINS.filter((d) => d.startsWith(domainInput)) : [...COMMON_EMAIL_DOMAINS]
    ).slice(0, 8);

    return matched.map((domain) => `${form.email.slice(0, at)}@${domain}`);
  }, [form.email]);

  useEffect(() => {
    setEmailSuggestIndex((i) => {
      if (emailSuggestions.length === 0) return 0;
      return Math.min(i, emailSuggestions.length - 1);
    });
  }, [emailSuggestions]);

  const showEmailDropdown = emailFieldFocused && emailSuggestions.length > 0;
  const canSubmit =
    form.name.trim().length > 0 &&
    isValidEmail(form.email) &&
    isValidKoreanPhone(form.phone) &&
    form.message.trim().length > 0;

  /** 왜: 필드별 setState 중복을 줄이고 변경 지점을 한 곳으로 모은다. */
  const updateForm = <K extends keyof ContactFormState>(key: K, value: ContactFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const applyEmailSuggestion = (full: string, moveToPhone: boolean) => {
    updateForm("email", full);
    setEmailFieldFocused(false);
    setEmailSuggestIndex(0);
    if (moveToPhone) {
      window.setTimeout(() => phoneInputRef.current?.focus(), 0);
    }
  };

  /** 왜: 키보드만으로도 자동완성 선택이 가능하도록 접근성을 보장한다. */
  const handleEmailKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showEmailDropdown) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setEmailSuggestIndex((i) => Math.min(i + 1, emailSuggestions.length - 1));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setEmailSuggestIndex((i) => Math.max(i - 1, 0));
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      applyEmailSuggestion(emailSuggestions[emailSuggestIndex] ?? emailSuggestions[0], false);
      return;
    }
    if (e.key === "Tab" && !e.shiftKey) {
      e.preventDefault();
      applyEmailSuggestion(emailSuggestions[emailSuggestIndex] ?? emailSuggestions[0], true);
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      setEmailFieldFocused(false);
    }
  };

  /** 왜: UI 상태를 서버 응답과 동기화해 성공/실패 피드백을 일관되게 제공한다. */
  const submitContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || !canSubmit) return;

    setSubmitting(true);
    setSubmitDone("idle");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Request failed");
      const data = await res.json().catch(() => ({}));
      if (!data?.ok) throw new Error("Send failed");
      setSubmitDone("success");
      setForm(EMPTY_FORM);
    } catch {
      setSubmitDone("error");
    } finally {
      setSubmitting(false);
    }
  };

  return {
    contactOpen,
    setContactOpen,
    submitting,
    submitDone,
    form,
    updateForm,
    emailFieldFocused,
    setEmailFieldFocused,
    emailSuggestIndex,
    setEmailSuggestIndex,
    emailSuggestions,
    showEmailDropdown,
    canSubmit,
    phoneInputRef,
    applyEmailSuggestion,
    handleEmailKeyDown,
    submitContact,
    formatKoreanPhoneInput,
  };
}
