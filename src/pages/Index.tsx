import { lazy, Suspense, useLayoutEffect, useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import FooterSection, { Navbar } from "@/components/FooterSection";

const VisionSection = lazy(() => import("@/components/VisionSection"));
const CoreTechnology = lazy(() => import("@/components/CoreTechnology"));
const SmartManagementSection = lazy(() => import("@/components/SmartManagementSection"));
const CustomizationSection = lazy(() => import("@/components/CustomizationSection"));
const IntellectualPropertySection = lazy(() => import("@/components/IntellectualPropertySection"));
const TechSpecsSection = lazy(() => import("@/components/TechSpecsSection"));

const Index = () => {
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <Suspense fallback={null}>
        <VisionSection />
        <CoreTechnology />
        <SmartManagementSection />
        <CustomizationSection />
        <IntellectualPropertySection />
        <TechSpecsSection />
      </Suspense>
      <FooterSection />
    </div>
  );
};

export default Index;
