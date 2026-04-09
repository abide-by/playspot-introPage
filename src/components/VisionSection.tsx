import { motion, useInView, animate } from "framer-motion";
import { useRef, useEffect } from "react";
import playcubeTextLogo from "@/assets/playcube-text-logo.png";

const AnimatedNumber = ({ value }: { value: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { margin: "-100px" });

  useEffect(() => {
    if (isInView && ref.current) {
      const controls = animate(0, value, {
        duration: 2,
        ease: "easeOut",
        onUpdate: (v) => {
          if (ref.current) {
            ref.current.textContent = Math.round(v).toLocaleString();
          }
        },
      });
      return controls.stop;
    } else if (ref.current) {
      ref.current.textContent = "0";
    }
  }, [isInView, value]);

  return <span ref={ref}>0</span>;
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 80 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const VisionSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });

  return (
    <section
      id="vision"
      ref={ref}
      className="relative px-6 py-40 md:py-56 lg:py-72 xl:py-80 bg-[#F6F2F5] text-foreground"
    >
      <motion.div
        variants={stagger}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="max-w-4xl mx-auto text-center"
      >
        <motion.p variants={fadeUp} className="text-sm font-medium tracking-[0.3em] uppercase text-primary mb-8">
          Our Journey
        </motion.p>
        <motion.h2 variants={fadeUp} className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight" style={{ lineHeight: 1.2 }}>
          <AnimatedNumber value={974} />일,
          <br />
          <span className="text-gradient"><AnimatedNumber value={23376} />시간</span>의
          <br />
          집요함.
        </motion.h2>
        <motion.div variants={fadeUp} className="mt-12 text-lg md:text-xl text-muted-foreground w-full max-w-4xl mx-auto leading-relaxed break-keep">
          <p>
            기획부터 설계, 제조까지. 우리는 단 하나의 완벽한 머신을 위해 모든 시간을 쏟았습니다.
          </p>
          <p className="mt-2 flex items-center justify-center gap-1.5 flex-wrap">
            <span>그 결과가 바로</span>
            <img src={playcubeTextLogo} alt="PLAYCUBE" className="h-[1.1em] object-contain translate-y-px" />
            <span>입니다.</span>
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default VisionSection;
