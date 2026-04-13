import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import logoImg from "@/assets/playspot-logo.png";
import playcubeTextLogo from "@/assets/playcube-text-logo.png";
import { useReducedVisualEffects } from "@/hooks/use-reduced-visual-effects";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const reducedEffects = useReducedVisualEffects();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/90 backdrop-blur-md md:bg-background/80 md:backdrop-blur-xl">
      <div className="max-w-7xl mx-auto grid min-h-14 grid-cols-[1fr_auto_1fr] items-center gap-3 py-2 px-4 sm:px-6">
        <div />
        <a href="#home" className="mx-auto flex-shrink-0">
          <img src={logoImg} alt="PLAY SPOT" className="h-6" />
        </a>
        <div className="flex justify-end">
          <motion.a
            href="#contact"
            whileHover={reducedEffects ? undefined : { scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex text-xs sm:text-sm font-medium text-primary hover:opacity-80 transition-opacity whitespace-nowrap"
          >
            창업 문의
          </motion.a>
        </div>
      </div>
    </nav>
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
  const [contactOpen, setContactOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitDone, setSubmitDone] = useState<"idle" | "success" | "error">("idle");
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    message: "",
    website: "",
  });

  const canSubmit = form.name.trim() && form.email.trim() && form.message.trim();

  async function submitContact(e: React.FormEvent) {
    e.preventDefault();
    if (submitting || !canSubmit) return;
    setSubmitting(true);
    setSubmitDone("idle");
    try {
      const res = await fetch("/.netlify/functions/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Request failed");
      const data = await res.json().catch(() => ({}));
      if (!data?.ok) throw new Error("Send failed");
      setSubmitDone("success");
      setForm({ name: "", company: "", email: "", phone: "", message: "", website: "" });
    } catch {
      setSubmitDone("error");
    } finally {
      setSubmitting(false);
    }
  }

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
              href="https://playspot-guide.pages.dev/"
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
        onOpenChange={(open) => {
          setContactOpen(open);
          if (open) setSubmitDone("idle");
        }}
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
              onChange={(e) => setForm((p) => ({ ...p, website: e.target.value }))}
              aria-hidden="true"
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="grid gap-1.5 text-left">
                <label className="text-sm font-medium">이름 *</label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="홍길동"
                  required
                />
              </div>
              <div className="grid gap-1.5 text-left">
                <label className="text-sm font-medium">회사/브랜드</label>
                <Input
                  value={form.company}
                  onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))}
                  placeholder="(선택)"
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="grid gap-1.5 text-left">
                <label className="text-sm font-medium">이메일 *</label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  placeholder="name@example.com"
                  required
                />
              </div>
              <div className="grid gap-1.5 text-left">
                <label className="text-sm font-medium">연락처</label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                  placeholder="010-1234-5678 (선택)"
                />
              </div>
            </div>

            <div className="grid gap-1.5 text-left">
              <label className="text-sm font-medium">문의 내용 *</label>
              <Textarea
                value={form.message}
                onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
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
