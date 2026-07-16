import { useState, useEffect } from "react";
import { Reveal } from "./Reveal";
import { menu as fallbackMenu, type MenuItem } from "@/lib/menu-data";
import { Sparkles } from "lucide-react";
import { getMenuItems } from "@/lib/db-service";

export function SpecialMenu() {
  const [menuList, setMenuList] = useState<MenuItem[]>(fallbackMenu);

  useEffect(() => {
    async function loadMenu() {
      try {
        const dbItems = await getMenuItems();
        setMenuList(dbItems);
      } catch (error) {
        console.error("Error loading specials:", error);
      }
    }
    loadMenu();
  }, []);

  const specials = menuList.filter((m) => m.category === "Specials" || m.popular).slice(0, 3);
  return (
    <section
      className="py-24 md:py-32 relative overflow-hidden"
      style={{ background: "var(--espresso)", color: "var(--cream)" }}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, color-mix(in oklab, var(--gold) 30%, transparent), transparent 50%), radial-gradient(circle at 80% 80%, color-mix(in oklab, var(--coffee) 60%, transparent), transparent 50%)",
        }}
      />
      <div className="container-luxe relative">
        <div className="max-w-2xl">
          <Reveal>
            <span className="eyebrow" style={{ color: "var(--gold)" }}>
              Chef's Recommendations
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="heading-serif mt-4 text-4xl md:text-5xl lg:text-6xl">
              Seasonal{" "}
              <em className="italic" style={{ color: "var(--gold)" }}>
                specials.
              </em>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-4 opacity-80">
              A rotating handful of things we can't stop thinking about.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 space-y-6">
          {specials.map((s, i) => (
            <Reveal key={s.id} delay={i * 0.08}>
              <article
                className="group grid md:grid-cols-[280px_1fr_auto] gap-6 md:gap-10 items-center rounded-3xl p-4 md:p-6 transition-all hover:bg-white/5"
                style={{ border: "1px solid color-mix(in oklab, var(--gold) 20%, transparent)" }}
              >
                <div className="relative aspect-[4/3] md:aspect-square overflow-hidden rounded-2xl">
                  <img
                    src={s.image}
                    alt={s.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <span
                    className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] tracking-wider uppercase font-medium"
                    style={{ background: "var(--gold)", color: "var(--espresso)" }}
                  >
                    <Sparkles className="h-3 w-3" /> Limited
                  </span>
                </div>
                <div>
                  <h3 className="heading-serif text-3xl md:text-4xl">{s.name}</h3>
                  <p className="mt-3 opacity-80 max-w-xl leading-relaxed">{s.description}</p>
                  <div className="mt-4 flex gap-4 text-xs tracking-[0.25em] uppercase opacity-70">
                    <span>{s.category}</span>
                    <span>·</span>
                    <span>{s.calories} kcal</span>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className="heading-serif text-4xl md:text-5xl"
                    style={{ color: "var(--gold)" }}
                  >
                    ${s.price.toFixed(2)}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
