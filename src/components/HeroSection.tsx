import { motion, useInView } from "framer-motion";
import { useState, useRef } from "react";
import playcubImg from "@/assets/playcube-hero-v3.png";
import magnifierIcon from "@/assets/magnifier-icon3.png";
import { usePrefersHoverMagnifier } from "@/hooks/use-prefers-hover-magnifier";
import { useReducedVisualEffects } from "@/hooks/use-reduced-visual-effects";

const ImageMagnifier = ({
  src,
  width,
  height,
  className,
  alt,
  magnifierHeight = 300,
  magnifierWidth = 300,
  zoomLevel = 2,
  fetchPriority,
}: {
  src: string;
  width: number;
  height: number;
  className?: string;
  alt: string;
  magnifierHeight?: number;
  magnifierWidth?: number;
  zoomLevel?: number;
  fetchPriority?: "high" | "low" | "auto";
}) => {
  const hoverMagnifier = usePrefersHoverMagnifier();
  const [[x, y], setXY] = useState([0, 0]);
  const [[imgWidth, imgHeight], setSize] = useState([0, 0]);
  const [showMagnifier, setShowMagnifier] = useState(false);

  if (!hoverMagnifier) {
    return (
      <img
        src={src}
        className={className}
        alt={alt}
        width={width}
        height={height}
        decoding="async"
        fetchPriority={fetchPriority}
        sizes="(max-width: 768px) 380px, (max-width: 1024px) 500px, 700px"
      />
    );
  }

  // The center of the actual transparent lens inside the magnifier-icon.png
  // These percentages determine where the zoomed circle should be positioned.
  // 145x146 image - handle goes down-right. The ring is usually top-left.
  // Let's assume the ring is roughly 65% of the image size, positioned at top-left.
  // We can easily adjust these based on the actual icon structure.
  // Default assuming a more centered or different lens
  // If the user's magnifying glass image is centered, we can adjust these.
  // For now we keep the proportions unless it looks wrong.
  const ringSizePct = 45.5;
  const ringLeftPct = 17;
  const ringTopPct = 20;

  return (
    <div
      className="relative cursor-none"
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
        className={className}
        alt={alt}
        width={width}
        height={height}
        decoding="async"
        fetchPriority={fetchPriority}
        sizes="(max-width: 768px) 380px, (max-width: 1024px) 500px, 700px"
      />
      {showMagnifier && (
        <div
          className="absolute pointer-events-none z-50 flex items-center justify-center p-4 pl-0 pt-0" // Add padding to offset the handle if necessary
          style={{
            height: `${magnifierHeight}px`,
            width: `${magnifierWidth}px`,
            top: `${y - magnifierHeight * (ringTopPct + ringSizePct / 2) / 100}px`,
            left: `${x - magnifierWidth * (ringLeftPct + ringSizePct / 2) / 100}px`,
          }}
        >
          {/* Zoomed Image Background (The Lens) */}
          <div
            className="absolute z-0 rounded-full"
            style={{
              width: `${ringSizePct}%`,
              height: `${ringSizePct}%`,
              top: `${ringTopPct}%`,
              left: `${ringLeftPct}%`,
              backgroundImage: `url('${src}')`,
              backgroundRepeat: "no-repeat",
              // Scale the background size so that hover coordinates map cleanly to zoom coordinates
              backgroundSize: `${imgWidth * zoomLevel}px ${imgHeight * zoomLevel}px`,
              backgroundPositionX: `${-x * zoomLevel + (magnifierWidth * ringSizePct / 100) / 2}px`,
              backgroundPositionY: `${-y * zoomLevel + (magnifierHeight * ringSizePct / 100) / 2}px`,
              backgroundColor: "white",
            }}
          />
          {/* Custom Magnifier Icon Frame Overlay */}
          <img
            src={magnifierIcon}
            alt="Magnifier Frame"
            className="absolute inset-0 w-full h-full object-contain z-10 drop-shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};

const HeroSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 });
  const reducedEffects = useReducedVisualEffects();

  return (
    <section id="home" ref={sectionRef} className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-28 pb-32">
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 80 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center z-10"
      >
        <motion.p
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-sm font-medium tracking-[0.3em] uppercase text-muted-foreground mb-4"
        >
          3rd Generation
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 80 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 80 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="text-5xl md:text-7xl lg:text-[5.5rem] font-semibold tracking-tight mb-4"
          style={{ lineHeight: 1.2 }}
        >
          Spin Your Life,
          <br />
          <span className="text-gradient">PLAY SPOT</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mt-6 break-keep"
        >
          무인 운영의 새로운 기준, PLAYCUBE
        </motion.p>
      </motion.div>

      <motion.div
        initial={reducedEffects ? { opacity: 0, y: 48 } : { opacity: 0, scale: 0.85, y: 60 }}
        animate={
          isInView
            ? reducedEffects
              ? { opacity: 1, y: 0 }
              : { opacity: 1, scale: 1, y: 0 }
            : reducedEffects
              ? { opacity: 0, y: 48 }
              : { opacity: 0, scale: 0.85, y: 60 }
        }
        transition={
          reducedEffects
            ? { duration: 0.55, delay: 0.2, ease: "easeOut" }
            : { duration: 1, delay: 0.5, ease: "easeOut" }
        }
        className="mt-12 md:mt-16"
      >
        <ImageMagnifier
          src={playcubImg}
          alt="PLAYCUBE 3세대 캡슐 자판기"
          width={500}
          height={500}
          className="w-[380px] md:w-[500px] lg:w-[650px] xl:w-[700px] -translate-x-4 md:-translate-x-6 lg:-translate-x-8"
          fetchPriority="high"
        />
      </motion.div>
    </section>
  );
};

export default HeroSection;
