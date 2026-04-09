import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import logoImg from "@/assets/playspot-logo.png";
import playcubeTextLogo from "@/assets/playcube-text-logo.png";
import { useReducedVisualEffects } from "@/hooks/use-reduced-visual-effects";

/** Same order as sections in Index.tsx */
const navLinks = [
  { name: "Home", href: "#home" },
  { name: "Journey", href: "#vision" },
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
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 min-h-14 py-2 px-4 sm:px-6">
          <a href="#home" className="flex-shrink-0" onClick={() => setIsOpen(false)}>
            <img src={logoImg} alt="PLAY SPOT" className="h-6" />
          </a>
          <div className="hidden md:flex flex-1 items-center justify-center min-w-0 px-1 sm:px-2">
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 sm:gap-x-5 md:gap-x-6 lg:gap-x-7">
              {navLinks.map((link) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  whileHover={reducedEffects ? undefined : { scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
                >
                  {link.name}
                </motion.a>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4 flex-shrink-0">
            <motion.a
              href="#contact"
              whileHover={reducedEffects ? undefined : { scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden md:inline-flex text-xs sm:text-sm font-medium text-primary hover:opacity-80 transition-opacity whitespace-nowrap"
            >
              Contact
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
            transition={{ duration: 0.18 }}
            className="fixed inset-0 top-[56px] z-40 md:hidden"
            role="dialog"
            aria-modal="true"
          >
            {/* Left: gradient dim (keeps background partially visible) */}
            <button
              type="button"
              aria-label="Close menu"
              className="absolute inset-0 bg-gradient-to-l from-black/60 via-black/20 to-transparent"
              onClick={() => setIsOpen(false)}
            />

            {/* Right: half drawer */}
            <motion.aside
              initial={{ x: 24, opacity: 0.98 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 24, opacity: 0.98 }}
              transition={{ duration: 0.18 }}
              className="absolute right-0 top-0 h-full w-[min(50vw,18rem)] min-w-[14rem] max-w-[20rem] border-l border-white/15 bg-white/10 backdrop-blur-2xl shadow-[0_24px_80px_rgba(0,0,0,0.35)]"
            >
              <div className="relative h-full overflow-y-auto px-6 py-6">
                {/* glass highlight */}
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
                    Contact us
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
          <motion.a
            variants={fadeUp}
            href="mailto:contact@playspot.co.kr"
            whileHover={reducedEffects ? undefined : { scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-sm font-semibold text-primary-foreground transition-shadow hover:shadow-lg hover:shadow-primary/25"
          >
            창업 문의하기
          </motion.a>
        </motion.div>
      </section>
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
