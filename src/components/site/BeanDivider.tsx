export function BeanDivider({ tone = "light" }: { tone?: "light" | "dark" }) {
  const color = tone === "dark" ? "var(--gold)" : "var(--coffee)";
  return (
    <div className="w-full flex items-center justify-center gap-3 py-8" aria-hidden>
      <span
        className="h-px flex-1 max-w-[120px]"
        style={{ background: `color-mix(in oklab, ${color} 30%, transparent)` }}
      />
      {[0, 1, 2].map((i) => (
        <svg key={i} width="18" height="22" viewBox="0 0 18 22" fill="none" className="opacity-70">
          <ellipse cx="9" cy="11" rx="7" ry="10" fill={color} />
          <path
            d="M9 2 C 6 6, 6 16, 9 20"
            stroke="var(--cream)"
            strokeOpacity="0.8"
            strokeWidth="0.8"
            fill="none"
          />
        </svg>
      ))}
      <span
        className="h-px flex-1 max-w-[120px]"
        style={{ background: `color-mix(in oklab, ${color} 30%, transparent)` }}
      />
    </div>
  );
}
