import { useEffect, useState } from "react";

export function ScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight);
      setP(Math.max(0, Math.min(1, scrolled)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div
      aria-hidden
      className="fixed top-0 left-0 z-[60] h-[2px] origin-left"
      style={{
        width: "100%",
        transform: `scaleX(${p})`,
        background: "linear-gradient(90deg, var(--gold), var(--coffee))",
        transition: "transform 0.1s linear",
      }}
    />
  );
}
