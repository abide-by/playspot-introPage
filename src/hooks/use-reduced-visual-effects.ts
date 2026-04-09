import { useEffect, useState } from "react";

/** 모바일·터치·절전 모션: 무한 애니·강한 블러·3D 틸트·호버 스케일 완화에 사용 */
export function useReducedVisualEffects() {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === "undefined") return false;
    return (
      window.matchMedia("(max-width: 767px)").matches ||
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  });

  useEffect(() => {
    const queries = [
      "(max-width: 767px)",
      "(pointer: coarse)",
      "(prefers-reduced-motion: reduce)",
    ].map((q) => window.matchMedia(q));

    const sync = () => setReduced(queries.some((m) => m.matches));
    queries.forEach((m) => m.addEventListener("change", sync));
    sync();
    return () => queries.forEach((m) => m.removeEventListener("change", sync));
  }, []);

  return reduced;
}
