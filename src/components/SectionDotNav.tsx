import { useEffect, useState } from "react";

const sectionTargets = [
  { id: "home", label: "Home" },
  { id: "vision", label: "Vision" },
  { id: "core-technology", label: "Core Technology" },
  { id: "smart-management", label: "Smart Management" },
  { id: "customization", label: "Customization" },
  { id: "intellectual-property", label: "Intellectual Property" },
  { id: "tech-specs", label: "Tech Specs" },
  { id: "contact", label: "Contact" },
] as const;

const SectionDotNav = () => {
  const [activeId, setActiveId] = useState<string>("home");

  useEffect(() => {
    const updateActiveSection = () => {
      const availableSections = sectionTargets
        .map((section) => ({ ...section, element: document.getElementById(section.id) }))
        .filter((section) => !!section.element);

      if (!availableSections.length) return;

      const viewportCenter = window.innerHeight * 0.45;
      let closestId = availableSections[0].id;
      let closestDistance = Number.POSITIVE_INFINITY;

      for (const section of availableSections) {
        if (!section.element) continue;
        const rect = section.element.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height / 2;
        const distance = Math.abs(sectionCenter - viewportCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestId = section.id;
        }
      }

      setActiveId(closestId);
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);
    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const target = document.getElementById(id);
    if (!target) return;

    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav
      aria-label="Section navigation"
      className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-2.5 md:flex"
    >
      {sectionTargets.map((section) => {
        const isActive = section.id === activeId;

        return (
          <div key={section.id} className="group relative flex items-center">
            <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-md bg-black/75 px-2 py-1 text-[11px] font-medium text-white opacity-0 shadow-md transition-opacity duration-150 group-hover:opacity-100 dark:bg-white/85 dark:text-black">
              {section.label}
            </span>
            <button
              type="button"
              aria-label={section.label}
              aria-current={isActive ? "true" : undefined}
              onClick={() => scrollToSection(section.id)}
              className={`w-2.5 rounded-full transition-all duration-250 ${
                isActive
                  ? "h-10 bg-primary shadow-[0_6px_14px_rgba(0,0,0,0.16)]"
                  : "h-6 bg-zinc-200/90 hover:h-7 hover:bg-zinc-300/90 dark:bg-zinc-600/65 dark:hover:bg-zinc-500/70"
              }`}
            />
          </div>
        );
      })}
    </nav>
  );
};

export default SectionDotNav;
