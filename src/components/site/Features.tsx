import { Leaf, Sprout, Wifi, PawPrint, Sun, Music, Zap } from "lucide-react";
import { Reveal } from "./Reveal";

const features = [
  {
    icon: Leaf,
    title: "Fresh Ingredients",
    desc: "Sourced weekly from local growers within 40 miles.",
  },
  { icon: Sprout, title: "Organic Beans", desc: "Certified single-origin. Traceable to the farm." },
  { icon: Wifi, title: "Free Wi-Fi", desc: "Quiet, fibre-fast, and generous outlets." },
  {
    icon: PawPrint,
    title: "Pet Friendly",
    desc: "Water bowls on the patio. Treats at the counter.",
  },
  { icon: Sun, title: "Outdoor Seating", desc: "A sun-warmed courtyard under fig trees." },
  { icon: Music, title: "Live Music", desc: "Vinyl on weekdays, live sets every Friday." },
  { icon: Zap, title: "Fast Service", desc: "Under six minutes from bar to table. Usually." },
];

export function Features() {
  return (
    <section
      className="py-24 md:py-32"
      style={{ background: "color-mix(in oklab, var(--gold) 6%, var(--cream))" }}
    >
      <div className="container-luxe">
        <div className="text-center max-w-2xl mx-auto">
          <Reveal>
            <span className="eyebrow justify-center inline-flex">Why Maison Noir</span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2
              className="heading-serif mt-4 text-4xl md:text-5xl lg:text-6xl"
              style={{ color: "var(--espresso)" }}
            >
              Small things, <em className="italic">done properly.</em>
            </h2>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.06}>
              <div
                className="group h-full rounded-3xl p-8 bg-card border transition-all duration-500 hover:-translate-y-1.5 hover:shadow-luxe"
                style={{ borderColor: "color-mix(in oklab, var(--gold) 25%, transparent)" }}
              >
                <div
                  className="h-14 w-14 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:rotate-6"
                  style={{
                    background: "color-mix(in oklab, var(--gold) 25%, transparent)",
                    color: "var(--espresso)",
                  }}
                >
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="heading-serif text-2xl mt-6" style={{ color: "var(--espresso)" }}>
                  {f.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
