import { Reveal } from "./Reveal";
import { BeanDivider } from "./BeanDivider";
import baristaImg from "@/assets/barista.jpg";
import beansImg from "@/assets/beans.jpg";
import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const dur = 1800;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.floor(eased * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);
  return (
    <span ref={ref}>
      {n.toLocaleString()}
      {suffix}
    </span>
  );
}

export function About() {
  return (
    <section id="about" className="relative py-24 md:py-36">
      <div className="container-luxe grid gap-14 lg:grid-cols-2 items-center">
        <Reveal>
          <div className="relative">
            <div className="relative overflow-hidden rounded-[2rem] shadow-luxe">
              <img
                src={baristaImg}
                alt="Barista pouring milk into espresso"
                loading="lazy"
                width={1200}
                height={1400}
                className="w-full h-[560px] object-cover transition-transform duration-1000 hover:scale-105"
              />
            </div>
            <div className="hidden md:block absolute -bottom-10 -right-6 w-52 h-52 rounded-[1.5rem] overflow-hidden shadow-luxe border-4 border-[color:var(--cream)]">
              <img
                src={beansImg}
                alt="Roasted coffee beans"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            <div
              aria-hidden
              className="absolute -top-8 -left-8 h-40 w-40 rounded-full blur-3xl opacity-60 -z-10"
              style={{ background: "var(--gold)" }}
            />
          </div>
        </Reveal>

        <div>
          <Reveal>
            <span className="eyebrow">Our Story</span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2
              className="heading-serif mt-4 text-4xl md:text-5xl lg:text-6xl text-balance"
              style={{ color: "var(--espresso)" }}
            >
              A quiet obsession with the{" "}
              <em className="italic" style={{ color: "var(--coffee)" }}>
                perfect pour.
              </em>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-6 text-base md:text-lg leading-relaxed text-muted-foreground max-w-xl">
              Maison Noir began in the winter of 2011, in a converted printworks with two
              second-hand La Marzocco machines and a shared belief: that a great cup deserves great
              silence. Thirteen years later, we still roast every bean in-house, on a Wednesday,
              before dawn.
            </p>
          </Reveal>

          <div className="mt-10 grid grid-cols-2 gap-6">
            {[
              { n: 12000, s: "+", label: "Happy Regulars" },
              { n: 20, s: "", label: "Signature Coffees" },
              { n: 7, s: "", label: "Origins Sourced" },
              { n: 100, s: "%", label: "Roasted Daily" },
            ].map((s, i) => (
              <Reveal key={i} delay={0.1 * i}>
                <div
                  className="rounded-2xl p-5"
                  style={{
                    background: "color-mix(in oklab, var(--gold) 10%, transparent)",
                    border: "1px solid color-mix(in oklab, var(--gold) 25%, transparent)",
                  }}
                >
                  <div
                    className="heading-serif text-3xl md:text-4xl"
                    style={{ color: "var(--espresso)" }}
                  >
                    <Counter to={s.n} suffix={s.s} />
                  </div>
                  <div className="text-xs tracking-[0.2em] uppercase mt-1 text-muted-foreground">
                    {s.label}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.3}>
            <ol className="mt-12 space-y-6 border-l border-[color:var(--gold)]/40 pl-6">
              {[
                {
                  y: "2011",
                  t: "The first pour",
                  d: "Two machines, one obsession, in an old printworks.",
                },
                {
                  y: "2016",
                  t: "The roastery",
                  d: "We started roasting our own beans on Wednesday mornings.",
                },
                { y: "2020", t: "A second home", d: "The reading room opened above the café." },
                { y: "2024", t: "You, here", d: "Still slow. Still hand-poured. Still ours." },
              ].map((e) => (
                <li key={e.y} className="relative">
                  <span
                    className="absolute -left-[31px] top-1.5 h-2.5 w-2.5 rounded-full"
                    style={{ background: "var(--gold)" }}
                  />
                  <div
                    className="text-xs tracking-[0.3em] uppercase"
                    style={{ color: "var(--coffee)" }}
                  >
                    {e.y}
                  </div>
                  <div className="heading-serif text-xl mt-1" style={{ color: "var(--espresso)" }}>
                    {e.t}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{e.d}</p>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </div>
      <BeanDivider />
    </section>
  );
}
