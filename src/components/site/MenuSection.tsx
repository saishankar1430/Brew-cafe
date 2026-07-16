import { useMemo, useState, useEffect } from "react";
import { Search, Flame, Leaf, Drumstick } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  menu as fallbackMenu,
  categories,
  type MenuCategory,
  type MenuItem,
} from "@/lib/menu-data";
import { Reveal } from "./Reveal";
import { getMenuItems } from "@/lib/db-service";

export function MenuSection({ compact = false }: { compact?: boolean }) {
  const [menuList, setMenuList] = useState<MenuItem[]>(fallbackMenu);
  const [cat, setCat] = useState<MenuCategory | "All">("All");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMenu() {
      try {
        const dbItems = await getMenuItems();
        setMenuList(dbItems);
      } catch (error) {
        console.error("Error fetching menu from Firestore:", error);
      } finally {
        setLoading(false);
      }
    }
    loadMenu();
  }, []);

  const filtered = useMemo(() => {
    let arr = cat === "All" ? menuList : menuList.filter((m) => m.category === cat);
    if (q.trim()) {
      const s = q.trim().toLowerCase();
      arr = arr.filter(
        (m) => m.name.toLowerCase().includes(s) || m.description.toLowerCase().includes(s),
      );
    }
    return compact ? arr.slice(0, 8) : arr;
  }, [cat, q, compact, menuList]);

  return (
    <section id="menu" className="py-24 md:py-32">
      <div className="container-luxe">
        <div className="text-center max-w-2xl mx-auto">
          <Reveal>
            <span className="eyebrow justify-center inline-flex">The Menu</span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2
              className="heading-serif mt-4 text-4xl md:text-5xl lg:text-6xl"
              style={{ color: "var(--espresso)" }}
            >
              A short, careful list.
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-5 text-muted-foreground">
              Everything is made from scratch, in-house, most of it before you arrive.
            </p>
          </Reveal>
        </div>

        <div className="mt-12 flex flex-col md:flex-row md:items-center gap-4 md:justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                suppressHydrationWarning={true}
                onClick={() => setCat(c)}
                className="text-xs md:text-sm px-4 py-2 rounded-full transition-all"
                style={{
                  background: cat === c ? "var(--espresso)" : "transparent",
                  color: cat === c ? "var(--cream)" : "var(--coffee)",
                  border: `1px solid ${cat === c ? "var(--espresso)" : "color-mix(in oklab, var(--coffee) 25%, transparent)"}`,
                }}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              aria-label="Search menu"
              placeholder="Search the menu…"
              suppressHydrationWarning={true}
              className="w-full rounded-full pl-11 pr-4 py-3 text-sm bg-card border outline-none focus:ring-2 focus:ring-[color:var(--gold)] transition"
            />
          </div>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, i) => (
              <motion.article
                key={item.id}
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.5, delay: (i % 8) * 0.04 }}
                className="group relative rounded-3xl overflow-hidden bg-card border transition-all duration-500 hover:-translate-y-2 hover:shadow-luxe"
                style={{ borderColor: "color-mix(in oklab, var(--coffee) 15%, transparent)" }}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                    {item.popular && (
                      <span
                        className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] tracking-wider uppercase font-medium"
                        style={{ background: "var(--gold)", color: "var(--espresso)" }}
                      >
                        <Flame className="h-3 w-3" /> Popular
                      </span>
                    )}
                    <span
                      className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] tracking-wider uppercase font-medium"
                      style={{
                        background: "rgba(255,255,255,0.9)",
                        color: item.veg ? "#3e7a3a" : "#8a3a2a",
                      }}
                    >
                      {item.veg ? <Leaf className="h-3 w-3" /> : <Drumstick className="h-3 w-3" />}
                      {item.veg ? "Veg" : "Non-veg"}
                    </span>
                  </div>
                  {item.available && (
                    <span
                      className="absolute top-3 right-3 h-2.5 w-2.5 rounded-full ring-2 ring-white"
                      style={{ background: "#5cbd7a" }}
                      aria-label="Available now"
                    />
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3
                      className="heading-serif text-xl leading-tight"
                      style={{ color: "var(--espresso)" }}
                    >
                      {item.name}
                    </h3>
                    <span
                      className="text-lg font-medium tabular-nums shrink-0"
                      style={{ color: "var(--coffee)" }}
                    >
                      ${item.price.toFixed(2)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between text-[11px] tracking-wider uppercase text-muted-foreground">
                    <span>{item.category}</span>
                    <span>{item.calories} kcal</span>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground mt-12">
            Nothing matches. Try another word.
          </p>
        )}
      </div>
    </section>
  );
}
