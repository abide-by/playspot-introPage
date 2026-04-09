import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Shield, Baby, HardHat, Pill } from "lucide-react";
import img1 from "@/assets/usecase-1.png";
import img2 from "@/assets/usecase-2.png";
import img3 from "@/assets/usecase-3.png";
import img4 from "@/assets/usecase-4.png";

const useCases = [
  {
    id: 1,
    icon: Shield,
    tag: "여성 안심",
    title: "공중화장실\n위생용품 보급",
    description: "위생용품 및 범죄 예방 키트를 24시간 무인으로 보급합니다.",
    image: img1,
  },
  {
    id: 2,
    icon: Baby,
    tag: "육아 SOS",
    title: "갑작스러운\n돌발 상황 해결",
    description: "외출 중 기저귀, 우비 등 갑작스러운 상황에 대응합니다.",
    image: img2,
  },
  {
    id: 3,
    icon: HardHat,
    tag: "세이프티 히어로",
    title: "24시간 현장 맞춤형\n무인 안전용품",
    description: "건설 현장, 산업 시설에서 안전용품을 즉시 지급합니다.",
    image: img3,
  },
  {
    id: 4,
    icon: Pill,
    tag: "스마트 의약품",
    title: "심야·사각지대\n24시간 무인 의료",
    description: "약국이 문을 닫은 심야에도 24시간 의약품을 제공합니다.",
    image: img4,
  },
];

const GlassCard = ({ item, index, isInView }: { item: typeof useCases[0]; index: number; isInView: boolean }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.7, delay: index * 0.15, ease: "easeOut" }}
      className="h-full"
    >
      <motion.div
        whileHover={{ scale: 1.02, y: -6, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" }}
        transition={{ duration: 0.3 }}
        className="relative rounded-2xl backdrop-blur-2xl bg-white/10 border border-white/20 shadow-[0_8px_40px_rgba(0,0,0,0.08),0_1px_3px_rgba(0,0,0,0.06)] p-6 md:p-8 h-full flex flex-col group"
      >
        {/* Subtle inner glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 via-transparent to-white/5 pointer-events-none" />

        <div className="relative z-10">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
            <item.icon className="w-6 h-6 text-primary" />
          </div>
          <span className="text-xs font-semibold tracking-wider uppercase text-primary">
            {item.tag}
          </span>
          <h3 className="text-xl md:text-2xl font-semibold mt-2 whitespace-pre-line text-foreground" style={{ lineHeight: 1.2 }}>
            {item.title}
          </h3>
          <p className="text-muted-foreground mt-3 text-sm leading-relaxed break-keep">
            {item.description}
          </p>
        </div>

        {/* Image Display */}
        <div className="relative z-10 mt-8 rounded-xl bg-white/5 border border-white/10 h-56 flex items-center justify-center overflow-hidden p-2">
          <img src={item.image} alt={item.tag} className="max-w-full max-h-full object-contain hover:scale-105 transition-transform duration-500" />
        </div>
      </motion.div>
    </motion.div>
  );
};

const HorizontalScrollSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 });

  return (
    <section id="use-cases" ref={sectionRef} className="relative py-28 md:py-40 lg:py-52 xl:py-60 overflow-hidden">
      {/* Mesh gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[#F4F5F7]" />
        <motion.div
          animate={{ x: [0, 30, -20, 0], y: [0, -40, 20, 0], scale: [1, 1.1, 0.95, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 -left-20 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, -25, 15, 0], y: [0, 30, -25, 0], scale: [1, 0.9, 1.1, 1] }}
          transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] rounded-full bg-primary/4 blur-[140px]"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-muted-foreground/3 blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.8fr] gap-12 lg:gap-16 items-start">
          {/* Left: Title area */}
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 80 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:sticky lg:top-32"
          >
            <p className="text-sm font-medium tracking-[0.3em] uppercase text-primary mb-4">
              Use Cases
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight break-keep" style={{ lineHeight: 1.2 }}>
              검증된<br />시장 경쟁력
            </h2>
            <p className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed max-w-md break-keep">
              PLAYCUBE가 만드는 새로운 무인 서비스의 가능성. 어디서든, 누구에게든 필요한 순간에 함께합니다.
            </p>
          </motion.div>

          {/* Right: 2x2 Glass card grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {useCases.map((item, i) => (
              <GlassCard key={item.id} item={item} index={i} isInView={isInView} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HorizontalScrollSection;
