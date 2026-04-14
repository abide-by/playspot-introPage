import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef, useState, useCallback } from "react";
import mokup0 from "@/assets/mokup_0.png";
import mokup1 from "@/assets/mokup_1.png";
import mokup2 from "@/assets/mokup_2.png";
import mokup3 from "@/assets/mokup_3.png";
import mokup4 from "@/assets/mokup_4.png";
import { useReducedVisualEffects } from "@/hooks/use-reduced-visual-effects";
import { cn } from "@/lib/utils";

const SLIDES = [
  { src: mokup1, alt: "PLAYCUBE 관리 앱 — 로그인 화면" },
  { src: mokup2, alt: "PLAYCUBE 관리 앱 — 기기 관리 목록" },
  { src: mokup3, alt: "PLAYCUBE 관리 앱 — 대시보드" },
  { src: mokup4, alt: "PLAYCUBE 관리 앱 — 원격 제어" },
] as const;
const MOCKUP_IMAGE_SIZE = { width: 1392, height: 2880 } as const;
const CAROUSEL_ARIA_LABEL =
  "PLAYCUBE 관리 앱 화면 예시. 현재: %s. 이미지 클릭 시 화면이 전환됩니다.";
const OVERLAY_IMAGE_CLASS =
  "absolute left-0 top-0 h-auto w-full max-h-[min(78vh,720px)] object-contain object-top";

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 80 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay, ease: "easeOut" } },
});

/**
 * mokup_0 베이스 + mokup_1~4 전체 겹침·opacity 전환(클립 없음, 파일과 동일).
 * drop-shadow는 베이스 img만(filter로 다중 투명 PNG 겹치면 검게 깨질 수 있음).
 */
const shellClass =
  "relative mx-auto w-[min(92vw,380px)] md:w-[min(88vw,480px)] lg:w-[540px] max-h-[min(78vh,720px)] cursor-pointer touch-manipulation select-none";

function ManagementMockupCarousel() {
  const [index, setIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  const goNext = useCallback(() => {
    setIndex((i) => (i + 1) % SLIDES.length);
  }, []);

  const fadeClass = prefersReducedMotion
    ? "transition-none"
    : "transition-opacity duration-300 ease-out motion-reduce:transition-none";
  const currentSlideAlt = SLIDES[index].alt;

  const selectSlide = useCallback((nextIndex: number) => {
    setIndex(nextIndex);
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        role="region"
        aria-roledescription="carousel"
        aria-label={CAROUSEL_ARIA_LABEL.replace("%s", currentSlideAlt)}
        aria-live="polite"
        className={shellClass}
        onClick={goNext}
      >
        {/* 왜: 베이스 목업을 고정해두고 화면 레이어만 바꿔 전환 시 이질감을 줄인다. */}
        <img
          src={mokup0}
          alt=""
          aria-hidden
          loading="eager"
          decoding="async"
          width={MOCKUP_IMAGE_SIZE.width}
          height={MOCKUP_IMAGE_SIZE.height}
          className="pointer-events-none block h-auto max-h-[min(78vh,720px)] w-full object-contain object-top drop-shadow-2xl"
        />

        <div className="pointer-events-none absolute inset-0" aria-hidden>
          {SLIDES.map((slide, slideIdx) => (
            <img
              key={slideIdx}
              src={slide.src}
              alt=""
              loading="eager"
              decoding="async"
              width={MOCKUP_IMAGE_SIZE.width}
              height={MOCKUP_IMAGE_SIZE.height}
              className={cn(
                OVERLAY_IMAGE_CLASS,
                fadeClass,
                index === slideIdx ? "z-[2] opacity-100" : "z-[1] opacity-0",
              )}
            />
          ))}
        </div>
      </motion.div>

      {/* 왜: 점 인디케이터 클릭이 부모의 next 클릭으로 전파되지 않도록 분리한다. */}
      <div
        className="flex items-center justify-center gap-2"
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
      >
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`${i + 1}번 화면으로 이동`}
            aria-current={i === index ? "true" : undefined}
            className={`h-2 rounded-full transition-all ${
              i === index ? "w-7 bg-primary" : "w-2 bg-muted-foreground/35 hover:bg-muted-foreground/55"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              selectSlide(i);
            }}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground text-center max-w-sm break-keep">
        이미지 클릭 시 화면이 전환됩니다.
      </p>
    </div>
  );
}

const SmartManagementSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  const reducedEffects = useReducedVisualEffects();

  return (
    <section id="smart-management" ref={ref} className="py-32 md:py-48 lg:py-56 xl:py-64 px-6 bg-secondary/50">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div initial="hidden" animate={isInView ? "visible" : "hidden"}>
            <motion.span variants={fadeUp(0)} className="inline-block px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold tracking-wider uppercase mb-6">
              New
            </motion.span>
            <motion.h2 variants={fadeUp(0.1)} className="text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-6 break-keep" style={{ lineHeight: 1.2 }}>
              언제 어디서나,
              <br />
              <span className="text-gradient">손끝에서 시작되는</span>
              <br />
              무인 운영의 혁신
            </motion.h2>
            <motion.p variants={fadeUp(0.2)} className="text-lg text-muted-foreground leading-relaxed max-w-lg break-keep">
              인터넷 연결만으로 머신의 재고와 작동 상태를 실시간으로 원격 확인하세요.
              매장 방문을 최소화하고, 빠른 장애 대응이 가능한
              웹 기반 통합 관리 솔루션입니다.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: reducedEffects ? 40 : 80 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: reducedEffects ? 40 : 80 }}
            transition={{ duration: reducedEffects ? 0.5 : 0.8, delay: reducedEffects ? 0.15 : 0.3, ease: "easeOut" }}
            className="flex justify-center"
          >
            <ManagementMockupCarousel />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SmartManagementSection;
