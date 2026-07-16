import { useEffect, useState } from "react";

export function CursorGlow() {
  const [pos, setPos] = useState({ x: -300, y: -300 });
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!canHover || reduce) return;
    setEnabled(true);
    const onMove = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  if (!enabled) return null;
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed z-[70] h-[380px] w-[380px] rounded-full mix-blend-multiply opacity-60"
      style={{
        left: pos.x - 190,
        top: pos.y - 190,
        background:
          "radial-gradient(circle, color-mix(in oklab, var(--gold) 35%, transparent) 0%, transparent 70%)",
        transition: "transform 0.12s ease-out",
      }}
    />
  );
}
