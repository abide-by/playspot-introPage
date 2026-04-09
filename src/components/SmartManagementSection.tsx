import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import dashboardImg from "@/assets/dashboard-mockup.png";
import { useReducedVisualEffects } from "@/hooks/use-reduced-visual-effects";

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 80 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay, ease: "easeOut" } },
});

const dashboardImgClass =
  "w-[380px] md:w-[480px] lg:w-[540px] drop-shadow-2xl";

function DashboardMockupTilt() {
  const imgRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-200, 200], [10, -10]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-200, 200], [-10, 10]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={imgRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY }}
      className="will-change-transform"
    >
      <img
        src={dashboardImg}
        alt="PLAYSPOT 원격 관리 대시보드"
        loading="lazy"
        decoding="async"
        sizes="(max-width: 768px) 90vw, 540px"
        width={800}
        height={1024}
        className={dashboardImgClass}
      />
    </motion.div>
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
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
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
            style={reducedEffects ? undefined : { perspective: 1000 }}
          >
            {reducedEffects ? (
              <img
                src={dashboardImg}
                alt="PLAYSPOT 원격 관리 대시보드"
                loading="lazy"
                decoding="async"
                sizes="(max-width: 768px) 90vw, 540px"
                width={800}
                height={1024}
                className={dashboardImgClass}
              />
            ) : (
              <DashboardMockupTilt />
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SmartManagementSection;
