export function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section
      className="relative pt-40 pb-16 md:pt-52 md:pb-20 text-center overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, color-mix(in oklab, var(--gold) 15%, var(--cream)) 0%, var(--cream) 100%)",
      }}
    >
      <div
        aria-hidden
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-3xl opacity-30"
        style={{ background: "var(--gold)" }}
      />
      <div className="container-luxe relative">
        <span className="eyebrow justify-center inline-flex">{eyebrow}</span>
        <h1
          className="heading-serif mt-4 text-5xl md:text-6xl lg:text-7xl text-balance"
          style={{ color: "var(--espresso)" }}
        >
          {title}
        </h1>
        {subtitle && <p className="mt-5 max-w-xl mx-auto text-muted-foreground">{subtitle}</p>}
      </div>
    </section>
  );
}
