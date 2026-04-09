import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import magnifierIcon from "@/assets/magnifier-icon3.png";
import { usePrefersHoverMagnifier } from "@/hooks/use-prefers-hover-magnifier";

type IpType = "특허" | "상표" | "디자인";

type IpItem = {
  type: IpType;
  imageSrc: string;
};

const ipItems: IpItem[] = [
  ...Array.from({ length: 7 }, (_, i) => ({
    type: "특허" as const,
    imageSrc: `/images/patent-${i + 1}.png`,
  })),
  ...Array.from({ length: 7 }, (_, i) => ({
    type: "상표" as const,
    imageSrc: `/images/trademark-${i + 1}.png`,
  })),
  ...Array.from({ length: 3 }, (_, i) => ({
    type: "디자인" as const,
    imageSrc: `/images/design-${i + 1}.png`,
  })),
];

const titleParts = {
  before: "기술로 증명하는 ",
  brand: "PLAY SPOT",
  after: "의 독보적 가치",
} as const;

const summaryStats = [
  { value: 7, label: "특허등록" },
  { value: 7, label: "상표등록" },
  { value: 3, label: "디자인등록" },
] as const;

const badgeThemeByType: Record<IpType, string> = {
  특허: "bg-indigo-50 text-indigo-600",
  상표: "bg-rose-50 text-rose-600",
  디자인: "bg-purple-50 text-purple-600",
};

const MagnifiableImage = ({ src, alt }: { src: string; alt: string }) => {
  const hoverMagnifier = usePrefersHoverMagnifier();
  const [[x, y], setXY] = useState([0, 0]);
  const [[imgWidth, imgHeight], setSize] = useState([0, 0]);
  const [showMagnifier, setShowMagnifier] = useState(false);

  // Match HeroSection's magnifier-icon3.png lens location/size.
  const ringSizePct = 45.5;
  const ringLeftPct = 17;
  const ringTopPct = 20;

  const magnifierHeight = 260;
  const magnifierWidth = 260;
  const zoomLevel = 2.6;

  if (!hoverMagnifier) {
    return (
      <div className="relative w-full flex items-center justify-center pb-16">
        <img
          src={src}
          alt={alt}
          className="max-h-full max-w-full object-contain"
          loading="lazy"
          decoding="async"
          draggable={false}
        />
      </div>
    );
  }

  return (
    <div
      className="relative cursor-none w-full flex items-center justify-center pb-16 select-none"
      onMouseEnter={(e) => {
        const elem = e.currentTarget;
        const { width, height } = elem.getBoundingClientRect();
        setSize([width, height]);
        setShowMagnifier(true);
      }}
      onMouseMove={(e) => {
        const elem = e.currentTarget;
        const { top, left } = elem.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;
        setXY([x, y]);
      }}
      onMouseLeave={() => setShowMagnifier(false)}
    >
      <img
        src={src}
        alt={alt}
        className="max-h-full max-w-full object-contain"
        loading="lazy"
        decoding="async"
        draggable={false}
      />

      {showMagnifier && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.12 }}
          className="absolute pointer-events-none z-50 flex items-center justify-center p-4 pl-0 pt-0"
          style={{
            height: `${magnifierHeight}px`,
            width: `${magnifierWidth}px`,
            top: `${y - (magnifierHeight * (ringTopPct + ringSizePct / 2)) / 100}px`,
            left: `${x - (magnifierWidth * (ringLeftPct + ringSizePct / 2)) / 100}px`,
          }}
        >
          <div
            className="absolute z-0 rounded-full"
            style={{
              width: `${ringSizePct}%`,
              height: `${ringSizePct}%`,
              top: `${ringTopPct}%`,
              left: `${ringLeftPct}%`,
              backgroundImage: `url('${src}')`,
              backgroundRepeat: "no-repeat",
              backgroundSize: `${imgWidth * zoomLevel}px ${imgHeight * zoomLevel}px`,
              backgroundPositionX: `${-x * zoomLevel + (magnifierWidth * ringSizePct) / 100 / 2}px`,
              backgroundPositionY: `${-y * zoomLevel + (magnifierHeight * ringSizePct) / 100 / 2}px`,
              backgroundColor: "white",
            }}
          />
          <img
            src={magnifierIcon}
            alt="Magnifier Frame"
            className="absolute inset-0 w-full h-full object-contain z-10 drop-shadow-2xl"
            draggable={false}
          />
        </motion.div>
      )}
    </div>
  );
};

const TOUCH_MARQUEE_MQ = "(max-width: 767px), (hover: none)";

const IntellectualPropertySection = () => {
  const trackItems = [...ipItems, ...ipItems];
  const [coarseOrNarrow, setCoarseOrNarrow] = useState(false);
  const [tapPaused, setTapPaused] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(TOUCH_MARQUEE_MQ);
    const sync = () => {
      const on = mq.matches;
      setCoarseOrNarrow(on);
      if (!on) setTapPaused(false);
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const fadeInRight = useMemo(
    () => ({
      hidden: { opacity: 0, x: 50 },
      visible: (i: number) => ({
        opacity: 1,
        x: 0,
        transition: { duration: 0.7, delay: i * 0.18, ease: "easeOut" },
      }),
    }),
    []
  );

  return (
    <section
      id="intellectual-property"
      className="relative overflow-hidden py-24 md:py-32 lg:py-44 xl:py-52"
      aria-labelledby="ip-section-title"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="text-center">
          <p className="text-sm font-medium tracking-[0.3em] uppercase text-primary mb-4">
            Intellectual Property
          </p>
          <h2
            id="ip-section-title"
            className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl break-keep"
            style={{ lineHeight: 1.2 }}
          >
            {titleParts.before}
            <span className="text-rose-600 font-extrabold">{titleParts.brand}</span>
            {titleParts.after}
          </h2>
        </div>

        <div className="mt-10 flex justify-center">
          <div className="w-full max-w-3xl">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8">
              {summaryStats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  custom={i}
                  variants={fadeInRight}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.3 }}
                  className="text-center px-2"
                >
                  <p className="text-7xl font-black text-slate-800">{stat.value}</p>
                  <p className="mt-2 text-sm font-medium text-gray-500">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div
          className="ip-marquee-root mt-14 w-full rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40 focus-visible:ring-offset-2"
          onClick={() => {
            if (coarseOrNarrow) setTapPaused((p) => !p);
          }}
          onKeyDown={(e) => {
            if (!coarseOrNarrow) return;
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setTapPaused((p) => !p);
            }
          }}
          tabIndex={coarseOrNarrow ? 0 : undefined}
          role={coarseOrNarrow ? "button" : undefined}
          aria-label={coarseOrNarrow ? "등록증 흐름 멈추기 또는 다시 재생" : undefined}
          aria-pressed={coarseOrNarrow ? tapPaused : undefined}
        >
          <div
            className="overflow-hidden"
            style={{
              WebkitMaskImage:
                "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
              maskImage:
                "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
            }}
          >
            <div
              className="ip-marquee-track flex w-max gap-5 px-4 md:px-6 pt-12 pb-16 animate-ip-marquee motion-reduce:animate-none transform-gpu"
              style={
                coarseOrNarrow
                  ? { animationPlayState: tapPaused ? "paused" : "running" }
                  : undefined
              }
              role="list"
              aria-label="지식재산권 등록증"
            >
              {trackItems.map((item, index) => (
                <div
                  key={`${item.imageSrc}-${index}`}
                  className="ip-marquee-card relative shrink-0 w-64 min-h-80 h-auto flex flex-col items-center text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/60"
                >
                  <span
                    className={`mb-3 rounded-full px-3 py-1 text-xs font-semibold ${badgeThemeByType[item.type]}`}
                  >
                    {item.type}
                  </span>
                  <MagnifiableImage src={item.imageSrc} alt={`${item.type} 등록증`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntellectualPropertySection;
