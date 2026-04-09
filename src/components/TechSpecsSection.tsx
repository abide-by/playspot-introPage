import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Settings, Maximize, Wifi } from "lucide-react";

const specs = [
  {
    icon: Settings,
    title: "가변형 호퍼",
    value: "45–92mm",
    description: "하나의 머신으로 45mm부터 92mm까지 다양한 캡슐 호환 가능.",
  },
  {
    icon: Maximize,
    title: "컴팩트 사이즈",
    value: "330mm",
    description: "폭 330mm의 슬림한 설계로 좁은 공간에도 설치 가능.",
  },
  {
    icon: Wifi,
    title: "스마트 시스템",
    value: "Web-based",
    description: "단계별 캐릭터 애니메이션 인터페이스 및 웹 기반 원격 관리 지원.",
  },
];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 80 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const TechSpecsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });

  return (
    <section
      id="tech-specs"
      ref={ref}
      className="px-6 py-40 md:py-56 lg:py-72 xl:py-80 bg-foreground text-background"
    >
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 80 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <p className="text-sm font-medium tracking-[0.3em] uppercase text-primary mb-4">
            Tech Specs
          </p>
          <h2 className="text-4xl md:text-6xl font-semibold tracking-tight" style={{ lineHeight: 1.2 }}>
            디테일이 다릅니다.
          </h2>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-3 gap-8 md:gap-12"
        >
          {specs.map((spec) => (
            <motion.div
              key={spec.title}
              variants={fadeUp}
              className="text-center md:text-left"
            >
              <div className="w-14 h-14 rounded-2xl bg-background/10 flex items-center justify-center mb-6 mx-auto md:mx-0">
                <spec.icon className="w-7 h-7 text-primary" />
              </div>
              <p className="text-sm text-primary font-semibold tracking-wider uppercase mb-2">
                {spec.title}
              </p>
              <p className="text-4xl md:text-5xl font-black mb-4">{spec.value}</p>
              <p className="text-background/60 leading-relaxed">{spec.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TechSpecsSection;
