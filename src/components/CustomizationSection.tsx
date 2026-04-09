import { useMemo, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useReducedVisualEffects } from "@/hooks/use-reduced-visual-effects";
import machine1 from "@/assets/machine1.png";
import machine2 from "@/assets/machine2.png";
import machine3 from "@/assets/machine3.png";
import machine4 from "@/assets/machine4.png";
import machine5 from "@/assets/machine5.png";
import machine6 from "@/assets/machine6.png";
import machine7 from "@/assets/machine7.png";
import machine8 from "@/assets/machine8.png";

/** 필터 탭 (All 제외 값은 아이템의 category와 동일) */
export type CustomizationFilter = "All" | "Museum & Art" | "Beauty & Fashion" | "Entertainment" | "Etc";

export type CustomizationCategory = Exclude<CustomizationFilter, "All">;

export interface CustomizationMachineItem {
  id: number;
  imageSrc: string;
  category: CustomizationCategory;
  caption: string;
}

const FILTER_TABS: CustomizationFilter[] = [
  "All",
  "Museum & Art",
  "Beauty & Fashion",
  "Entertainment",
  "Etc",
];

const customizationMachines: CustomizationMachineItem[] = [
  // machine1 is a sushi-related image; keep it separate from K-POP/character editions.
  { id: 1, imageSrc: machine1, category: "Etc", caption: "푸드 피규어" },
  { id: 2, imageSrc: machine2, category: "Beauty & Fashion", caption: "코스메틱 브랜드 콜라보" },
  { id: 3, imageSrc: machine3, category: "Beauty & Fashion", caption: "코스메틱 브랜드 콜라보" },
  { id: 4, imageSrc: machine4, category: "Entertainment", caption: "K-POP & 캐릭터 에디션" },
  { id: 5, imageSrc: machine5, category: "Entertainment", caption: "K-POP & 캐릭터 에디션" },
  { id: 6, imageSrc: machine6, category: "Entertainment", caption: "K-POP & 캐릭터 에디션" },
  { id: 7, imageSrc: machine7, category: "Museum & Art", caption: "국립중앙박물관 에디션" },
  { id: 8, imageSrc: machine8, category: "Museum & Art", caption: "국립중앙박물관 에디션" },
];

const CustomizationSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.15 });
  const reducedEffects = useReducedVisualEffects();
  const [activeFilter, setActiveFilter] = useState<CustomizationFilter>("All");

  const filtered = useMemo(() => {
    if (activeFilter === "All") return customizationMachines;
    return customizationMachines.filter((m) => m.category === activeFilter);
  }, [activeFilter]);

  return (
    <section
      id="customization"
      ref={ref}
      className="relative overflow-hidden bg-[#EEF2F7] py-28 md:py-40 lg:py-52 xl:py-60 text-foreground"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto mb-10 md:mb-14"
        >
          <p className="text-sm font-medium tracking-[0.3em] uppercase text-primary mb-4">Customization</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground break-keep" style={{ lineHeight: 1.2 }}>
            무한한 커스터마이징
          </h2>
          <p className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed break-keep">
            브랜드·IP·공간에 맞춘 외장과 그래픽으로, 같은 플랫폼을 완전히 다른 경험으로 만듭니다.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10 md:mb-12"
          role="tablist"
          aria-label="커스터마이징 카테고리"
        >
          {FILTER_TABS.map((tab) => {
            const isActive = activeFilter === tab;
            return (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveFilter(tab)}
                className={`rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-300 sm:px-5 ${
                  isActive
                    ? "bg-foreground text-background shadow-md"
                    : "bg-white text-muted-foreground shadow-sm border border-border/60 hover:border-primary/30 hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </motion.div>

        {/* activeFilter를 key로 두어 필터 전환 시 그리드 전체 리마운트 → All 복귀 시 8장 모두 정상 표시 (popLayout+layout 재진입 버그 회피) */}
        <motion.div
          key={activeFilter}
          layout={!reducedEffects}
          className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6"
          initial={{ opacity: 0.98 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {filtered.map((item, index) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{
                duration: 0.4,
                ease: "easeOut",
                delay: isInView ? index * 0.1 : 0,
              }}
              className="group flex flex-col"
            >
              <div className="relative overflow-hidden rounded-2xl bg-white shadow-md border border-border/40">
                <div className="aspect-square flex items-center justify-center p-4 md:p-5">
                  <motion.img
                    src={item.imageSrc}
                    alt={item.caption}
                    loading="lazy"
                    decoding="async"
                    className="max-h-full max-w-full object-contain"
                    whileHover={reducedEffects ? undefined : { scale: 1.05 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                  />
                </div>
              </div>
              <p className="mt-3 text-center text-sm text-muted-foreground font-medium transition-all duration-300 group-hover:text-primary group-hover:font-semibold px-1">
                {item.caption}
              </p>
              <p className="mt-1 text-center text-xs text-muted-foreground/80 uppercase tracking-wider">
                {item.category}
              </p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CustomizationSection;
