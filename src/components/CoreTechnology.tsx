import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Cog, MonitorSmartphone, Pointer, Wifi } from "lucide-react";
import { cn } from "@/lib/utils";
import { useReducedVisualEffects } from "@/hooks/use-reduced-visual-effects";
import coreTechVisual from "@/assets/playcube-hero-v2.png";
import coreTechVisualHover from "@/assets/playcube-hero-v2-1.png";
import wmHopper from "@/assets/wmHopper.png";
import wmUI from "@/assets/wmUI.png";
import wmRemote from "@/assets/wmRemote.png";

/** 세 카드 공통: 우하단 워터마크 크기·오프셋 (호퍼 기준, 살짝 키운 값) */
const watermarkLayoutClass =
  "right-[-6%] bottom-[-14%] w-48 h-56 sm:w-52 sm:h-64 md:w-56 md:h-[17rem]";

/** 워터마크 배치 미세 보정 */
const watermarkEdgeTrimClass =
  "origin-bottom-right scale-[1.02] translate-x-0.5";

/** 워터마크가 너무 흐려 보이지 않도록 약간의 선명도 보정 */
const watermarkEnhanceClass = "contrast-[1.18] brightness-[1.08] saturate-[1.05]";

/**
 * 워터마크 가장자리 경계가 보이지 않도록 페더(마스크) 처리.
 * 여러 마스크 합성은 브라우저별 동작이 달라서, 라디얼 마스크 1개로만 페더 처리한다.
 * (우하단 기준으로 바깥쪽으로 갈수록 자연스럽게 투명)
 */
const watermarkFeatherMask =
  "radial-gradient(farthest-side at 92% 120%, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 68%, rgba(0,0,0,0) 100%)";

const cards = [
  {
    icon: Cog,
    title: "가변형 호퍼 시스템",
    description:
      "45mm부터 92mm 대형 캡슐까지, 별도의 개조 없이 단 하나의 머신으로 호환 가능합니다.",
    watermarkSrc: wmHopper,
    watermarkLayoutClass,
    /** 원본이 밝은 편이라 UI·원격보다만 살짝 높임 */
    watermarkOpacityClass: "opacity-50",
  },
  {
    icon: MonitorSmartphone,
    title: "인터랙티브 UI & BGM",
    description:
      "결제부터 토출까지 작동 단계에 맞춰 반응하는 캐릭터 애니메이션과 맞춤형 BGM을 지원합니다.",
    watermarkSrc: wmUI,
    watermarkLayoutClass,
    watermarkOpacityClass: "opacity-25",
  },
  {
    icon: Wifi,
    title: "스마트 무인 관리",
    description:
      "웹과 모바일을 통해 언제 어디서든 실시간 재고 파악 및 기기 상태 원격 모니터링이 가능합니다.",
    watermarkSrc: wmRemote,
    watermarkLayoutClass,
    watermarkOpacityClass: "opacity-25",
  },
] as const;

const TechGlassCard = ({
  card,
  index,
  isInView,
  reducedEffects,
}: {
  card: (typeof cards)[number];
  index: number;
  isInView: boolean;
  reducedEffects: boolean;
}) => {
  const Icon = card.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: reducedEffects ? 0.45 : 0.7, delay: reducedEffects ? index * 0.08 : index * 0.15, ease: "easeOut" }}
      className="h-full"
    >
      <motion.div
        whileHover={
          reducedEffects
            ? undefined
            : { scale: 1.02, y: -6, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" }
        }
        transition={{ duration: 0.3 }}
        className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.08),0_1px_3px_rgba(0,0,0,0.06)] backdrop-blur-md md:backdrop-blur-2xl p-6 md:p-8 h-full flex flex-col group"
      >
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 via-transparent to-white/5 pointer-events-none" />
        <img
          src={card.watermarkSrc}
          alt=""
          aria-hidden="true"
          className={`absolute pointer-events-none select-none z-0 object-contain object-right-bottom border-0 ${watermarkEdgeTrimClass} ${watermarkEnhanceClass} ${card.watermarkOpacityClass} ${card.watermarkLayoutClass}`}
          style={{
            WebkitMaskImage: watermarkFeatherMask,
            maskImage: watermarkFeatherMask,
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskSize: "100% 100%",
            maskSize: "100% 100%",
          }}
          loading="lazy"
          decoding="async"
        />

        <div className="relative z-10">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          <h3
            className="text-xl md:text-2xl font-semibold mt-2 text-foreground break-keep"
            style={{ lineHeight: 1.2 }}
          >
            {card.title}
          </h3>
          <p className="text-muted-foreground mt-3 text-sm leading-relaxed break-keep">
            {card.description}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

const MOBILE_MACHINE_MQ = "(max-width: 767px)";
const MACHINE_HINT_ID = "machine-hover-hint";
const MACHINE_HINT_TEXT = "마우스를 올리면 커스텀 스킨 포스터가 펼쳐져요";
const MACHINE_HINT_DURATION = "1s";
const MACHINE_BASE_IMAGE_CLASS =
  "col-start-1 row-start-1 max-h-[min(22rem,50vh)] w-full max-w-full object-contain pointer-events-none select-none";
const MACHINE_OVERLAY_IMAGE_CLASS =
  "col-start-1 row-start-1 max-h-[min(22rem,50vh)] w-full max-w-full object-contain transition-opacity duration-300 ease-out motion-reduce:transition-none pointer-events-none select-none";

const CoreTechnology = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  const reducedEffects = useReducedVisualEffects();
  const prefersReducedMotion = useReducedMotion();
  const [isNarrowViewport, setIsNarrowViewport] = useState(false);
  const [mobileMachineAlt, setMobileMachineAlt] = useState(false);
  const canToggleMachineVisual = isNarrowViewport;
  const showMachineHint = !prefersReducedMotion;

  /** 왜: 첫 hover/tap 전환 시 이미지 디코딩 지연으로 인한 깜빡임을 줄이기 위해 미리 로드한다. */
  useEffect(() => {
    for (const src of [coreTechVisual, coreTechVisualHover]) {
      const img = new Image();
      img.src = src;
      void img.decode?.().catch(() => {});
    }
  }, []);

  const toggleMachineVisual = () => {
    if (!canToggleMachineVisual) return;
    setMobileMachineAlt((v) => !v);
  };

  const handleMachineKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!canToggleMachineVisual) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleMachineVisual();
    }
  };

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MACHINE_MQ);
    const sync = () => {
      const narrow = mq.matches;
      setIsNarrowViewport(narrow);
      if (!narrow) setMobileMachineAlt(false);
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <section id="core-technology" ref={ref} className="relative py-28 md:py-40 lg:py-52 xl:py-60 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[#F4F5F7]" />
        {reducedEffects ? (
          <>
            <div className="absolute top-1/4 -left-16 h-[min(55vw,280px)] w-[min(55vw,280px)] rounded-full bg-primary/5 blur-3xl md:h-[400px] md:w-[400px]" />
            <div className="absolute bottom-1/4 -right-16 h-[min(60vw,300px)] w-[min(60vw,300px)] rounded-full bg-primary/4 blur-3xl md:h-[500px] md:w-[500px]" />
            <div className="absolute top-1/2 left-1/2 h-[min(45vw,220px)] w-[min(45vw,220px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-muted-foreground/3 blur-3xl md:h-[300px] md:w-[300px]" />
          </>
        ) : (
          <>
            <motion.div
              animate={{ x: [0, 30, -20, 0], y: [0, -40, 20, 0], scale: [1, 1.1, 0.95, 1] }}
              transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/4 -left-20 h-[400px] w-[400px] rounded-full bg-primary/5 blur-[120px]"
            />
            <motion.div
              animate={{ x: [0, -25, 15, 0], y: [0, 30, -25, 0], scale: [1, 0.9, 1.1, 1] }}
              transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-1/4 -right-20 h-[500px] w-[500px] rounded-full bg-primary/4 blur-[140px]"
            />
            <div className="absolute top-1/2 left-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-muted-foreground/3 blur-[100px]" />
          </>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.8fr] gap-12 lg:gap-16 items-stretch">
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 80 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:sticky lg:top-32"
          >
            <p className="text-sm font-medium tracking-[0.3em] uppercase text-primary mb-4">
              Core Technology
            </p>
            <h2
              className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight break-keep"
              style={{ lineHeight: 1.2 }}
            >
              기계가 아닌,
              <br />
              <span className="text-gradient">진화하는 스마트 플랫폼</span>
            </h2>
            <p className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed max-w-md break-keep">
              호퍼·인터페이스·원격 관리가 한 플랫폼으로 묶여, 현장과 운영을 동시에 다룹니다.
            </p>

            {/* 왜: 입력 방식이 달라 데스크톱은 hover, 모바일은 tap 토글로 동일 경험을 맞춘다. */}
            <div className="relative z-10 mt-8 rounded-xl bg-white/5 border border-white/10 min-h-[14rem] overflow-visible p-2 group/machine-visual">
              <div
                className={cn(
                  "relative grid min-h-[12rem] grid-cols-1 grid-rows-1 place-items-center rounded-lg outline-none touch-manipulation md:cursor-pointer",
                  canToggleMachineVisual && "cursor-pointer"
                )}
                role={canToggleMachineVisual ? "button" : undefined}
                tabIndex={canToggleMachineVisual ? 0 : undefined}
                aria-pressed={canToggleMachineVisual ? mobileMachineAlt : undefined}
                aria-label={canToggleMachineVisual ? "머신 이미지 다른 각도 보기" : undefined}
                aria-describedby={!canToggleMachineVisual ? MACHINE_HINT_ID : undefined}
                onClick={toggleMachineVisual}
                onKeyDown={handleMachineKeyDown}
              >
                {/* 왜: OS 모션 축소 설정 사용자는 힌트 애니메이션을 숨겨 시각 피로를 줄인다. */}
                {showMachineHint ? (
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 z-[3] flex items-center justify-center transition-opacity duration-300 md:group-hover/machine-visual:opacity-0"
                  >
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-full animate-machine-beacon motion-reduce:animate-none"
                      style={{ animationDuration: MACHINE_HINT_DURATION }}
                    >
                      <Pointer className="h-7 w-7 text-white drop-shadow-[0_4px_10px_rgba(15,23,42,0.45)] animate-machine-icon-blink motion-reduce:animate-none" />
                    </div>
                  </div>
                ) : null}
                {/* 동일 해상도: 아래는 고정, 위만 페이드 — md+ 호버 / 모바일 탭 토글 */}
                <img
                  src={coreTechVisual}
                  alt="PLAYCUBE 캡슐 머신"
                  loading="eager"
                  width={800}
                  height={960}
                  decoding="async"
                  className={MACHINE_BASE_IMAGE_CLASS}
                />
                <img
                  src={coreTechVisualHover}
                  alt=""
                  aria-hidden="true"
                  loading="eager"
                  fetchPriority="low"
                  width={800}
                  height={960}
                  decoding="async"
                  className={cn(
                    MACHINE_OVERLAY_IMAGE_CLASS,
                    "md:opacity-0 md:group-hover/machine-visual:opacity-100",
                    mobileMachineAlt ? "max-md:opacity-100" : "max-md:opacity-0"
                  )}
                />
              </div>
              <p
                id={MACHINE_HINT_ID}
                className="mt-2 hidden text-center text-[11px] leading-snug text-muted-foreground/75 md:block"
              >
                {MACHINE_HINT_TEXT}
              </p>
            </div>
          </motion.div>

          <div className="flex flex-col justify-between h-full gap-3">
            {cards.map((card, i) => (
              <TechGlassCard
                key={card.title}
                card={card}
                index={i}
                isInView={isInView}
                reducedEffects={reducedEffects}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoreTechnology;
