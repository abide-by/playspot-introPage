import { useEffect, useState } from "react";

const QUERY = "(hover: hover) and (pointer: fine)";

/** 마우스 호버 기반 돋보기가 자연스러운 환경에서만 true (대부분의 터치·코스 포인터는 false) */
export function usePrefersHoverMagnifier() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const sync = () => setEnabled(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return enabled;
}
