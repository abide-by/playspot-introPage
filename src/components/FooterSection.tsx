import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import logoImg from "@/assets/playspot-logo.png";
import playcubeTextLogo from "@/assets/playcube-text-logo.png";
import { useReducedVisualEffects } from "@/hooks/use-reduced-visual-effects";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useContactForm } from "@/hooks/use-contact-form";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "Vision", href: "#vision" },
  { name: "Core Technology", href: "#core-technology" },
  { name: "Smart Management", href: "#smart-management" },
  { name: "Customization", href: "#customization" },
  { name: "Intellectual Property", href: "#intellectual-property" },
  { name: "Tech Specs", href: "#tech-specs" },
] as const;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const reducedEffects = useReducedVisualEffects();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/90 backdrop-blur-md md:bg-background/80 md:backdrop-blur-xl">
        <div className="max-w-7xl mx-auto grid min-h-14 grid-cols-[1fr_auto_1fr] items-center gap-3 py-2 px-4 sm:px-6">
          <div />

          <a href="#home" className="mx-auto flex-shrink-0" onClick={() => setIsOpen(false)}>
            <img src={logoImg} alt="PLAY SPOT" className="h-6" />
          </a>

          <div className="flex items-center justify-end gap-4">
            <motion.a
              href="#contact"
              whileHover={reducedEffects ? undefined : { scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden md:inline-flex text-xs sm:text-sm font-medium text-primary hover:opacity-80 transition-opacity whitespace-nowrap"
            >
              창업 문의
            </motion.a>
            <button
              className="md:hidden -mr-2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-foreground backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.18)] hover:bg-white/15"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 top-[56px] z-40 md:hidden"
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              aria-label="메뉴 닫기"
              className="absolute inset-0 bg-gradient-to-l from-black/60 via-black/20 to-transparent"
              onClick={() => setIsOpen(false)}
            />
            <motion.aside
              initial={{ x: 24, opacity: 0.98 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 24, opacity: 0.98 }}
              transition={{ duration: 0.18 }}
              className="absolute right-0 top-0 h-full w-[min(50vw,18rem)] min-w-[14rem] max-w-[20rem] border-l border-white/15 bg-white/10 backdrop-blur-2xl shadow-[0_24px_80px_rgba(0,0,0,0.35)]"
            >
              <div className="relative h-full overflow-y-auto px-6 py-6">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/12 via-white/6 to-transparent" />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold tracking-wide text-white/80">MENU</span>
                </div>

                <div className="relative mt-6 flex flex-col gap-3">
                  {navLinks.map((link, i) => (
                    <motion.a
                      key={link.name}
                      href={link.href}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8 }}
                      transition={{ delay: i * 0.04 }}
                      onClick={() => setIsOpen(false)}
                      className="rounded-lg px-3 py-2 text-base font-semibold tracking-tight text-white/90 hover:text-white hover:bg-white/12"
                    >
                      {link.name}
                    </motion.a>
                  ))}
                  <motion.a
                    href="#contact"
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    transition={{ delay: navLinks.length * 0.04 + 0.04 }}
                    onClick={() => setIsOpen(false)}
                    className="mt-3 inline-flex items-center justify-center rounded-full border border-white/15 bg-white/12 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(0,0,0,0.22)] hover:bg-white/16"
                  >
                    창업 문의
                  </motion.a>
                </div>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 80 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const FooterSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  const reducedEffects = useReducedVisualEffects();
  const {
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
  } = useContactForm();

  return (
    <>
      <section id="contact" ref={ref} className="px-6 py-40 md:py-56 lg:py-72 xl:py-80 text-center">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-2xl mx-auto"
        >
          <motion.h2 variants={fadeUp} className="text-4xl md:text-6xl font-semibold tracking-tight mb-6 break-keep" style={{ lineHeight: 1.2 }}>
            지금 시작하세요.
          </motion.h2>
          <motion.div variants={fadeUp} className="text-lg text-muted-foreground mb-10 break-keep flex flex-wrap items-center justify-center gap-1.5">
            <img src={playcubeTextLogo} alt="PLAYCUBE" className="h-[1.1em] object-contain translate-y-px" />
            <span>창업에 대해 궁금하신 점이 있다면 언제든 문의해 주세요.</span>
          </motion.div>
          <motion.div
            variants={fadeUp}
            className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center"
          >
            <motion.button
              type="button"
              whileHover={reducedEffects ? undefined : { scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-sm font-semibold text-primary-foreground transition-shadow hover:shadow-lg hover:shadow-primary/25"
              onClick={() => setContactOpen(true)}
            >
              창업 문의하기
            </motion.button>
            <motion.a
              href="https://partner.playspot.co.kr/"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={reducedEffects ? undefined : { scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex h-12 items-center justify-center rounded-full border border-primary/35 bg-background px-8 text-sm font-semibold text-primary transition-shadow hover:border-primary/50 hover:bg-primary/5 hover:shadow-lg"
            >
              창업 가이드 바로가기
            </motion.a>
          </motion.div>
        </motion.div>
      </section>

      <Dialog
        open={contactOpen}
        onOpenChange={setContactOpen}
      >
        <DialogContent className="w-[min(92vw,40rem)] max-w-none">
          <DialogHeader>
            <DialogTitle>창업 문의</DialogTitle>
            <DialogDescription>담당자가 확인 후 빠르게 연락드릴게요.</DialogDescription>
          </DialogHeader>

          <form className="grid gap-4" onSubmit={submitContact}>
            {/* honeypot */}
            <input
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              value={form.website}
              onChange={(e) => updateForm("website", e.target.value)}
              aria-hidden="true"
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="grid gap-1.5 text-left">
                <label className="text-sm font-medium">이름 *</label>
                <Input
                  value={form.name}
                  onChange={(e) => updateForm("name", e.target.value)}
                  placeholder="홍길동"
                  required
                />
              </div>
              <div className="grid gap-1.5 text-left">
                <label className="text-sm font-medium">회사/브랜드 (선택)</label>
                <Input
                  value={form.company}
                  onChange={(e) => updateForm("company", e.target.value)}
                  placeholder="브랜드명"
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="relative grid gap-1.5 text-left">
                <label className="text-sm font-medium" htmlFor="contact-email">
                  이메일 *
                </label>
                <Input
                  id="contact-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => {
                    updateForm("email", e.target.value);
                    setEmailSuggestIndex(0);
                  }}
                  onKeyDown={handleEmailKeyDown}
                  onFocus={() => setEmailFieldFocused(true)}
                  onBlur={() => {
                    window.setTimeout(() => setEmailFieldFocused(false), 180);
                  }}
                  placeholder="name@example.com"
                  autoComplete="email"
                  required
                  aria-autocomplete="list"
                  aria-expanded={showEmailDropdown}
                  aria-controls={showEmailDropdown ? "contact-email-suggestions" : undefined}
                  aria-activedescendant={
                    showEmailDropdown ? `contact-email-option-${emailSuggestIndex}` : undefined
                  }
                />
                {showEmailDropdown && (
                  <ul
                    id="contact-email-suggestions"
                    role="listbox"
                    className="absolute left-0 right-0 top-full z-[100] mt-1 max-h-52 overflow-auto rounded-md border border-border bg-popover text-popover-foreground shadow-md"
                  >
                    {emailSuggestions.map((full, i) => (
                      <li
                        key={full}
                        id={`contact-email-option-${i}`}
                        role="option"
                        aria-selected={i === emailSuggestIndex}
                        className="border-b border-border/60 last:border-b-0"
                      >
                        <button
                          type="button"
                          className={cn(
                            "w-full px-3 py-2.5 text-left text-sm hover:bg-muted/80 focus:bg-muted/80 focus:outline-none",
                            i === emailSuggestIndex && "bg-muted/80",
                          )}
                          onMouseEnter={() => setEmailSuggestIndex(i)}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            applyEmailSuggestion(full, false);
                          }}
                        >
                          {full}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="grid gap-1.5 text-left">
                <label className="text-sm font-medium">연락처 *</label>
                <Input
                  ref={phoneInputRef}
                  id="contact-phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(e) =>
                    updateForm("phone", formatKoreanPhoneInput(e.target.value))
                  }
                  placeholder="010-1234-5678"
                  required
                />
              </div>
            </div>

            <div className="grid gap-1.5 text-left">
              <label className="text-sm font-medium">문의 내용 *</label>
              <Textarea
                value={form.message}
                onChange={(e) => updateForm("message", e.target.value)}
                placeholder="희망 설치 지역 / 예상 수량 / 문의 사항 등을 적어주세요."
                required
              />
              <p className="text-xs text-muted-foreground">{form.message.length}/4000</p>
            </div>

            {submitDone === "success" && (
              <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                접수 완료되었습니다. 곧 연락드리겠습니다.
              </div>
            )}
            {submitDone === "error" && (
              <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                전송에 실패했습니다. 잠시 후 다시 시도해 주세요.
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" onClick={() => setContactOpen(false)} disabled={submitting}>
                닫기
              </Button>
              <Button type="submit" disabled={!canSubmit || submitting}>
                {submitting ? "전송 중..." : "보내기"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© 2026 PLAY SPOT. All rights reserved.</p>
          <p>Designed with precision.</p>
        </div>
      </footer>
    </>
  );
};

export { Navbar };
export default FooterSection;
