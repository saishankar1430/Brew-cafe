import { Reveal } from "./Reveal";
import { Calendar, Music, Coffee } from "lucide-react";

const events = [
  {
    icon: Music,
    day: "FRI 12",
    title: "Live: Alma Trio",
    desc: "Nordic jazz, three musicians, a candlelit room.",
    time: "8:00 pm",
    tag: "Live Music",
    img: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&w=1000&q=70",
  },
  {
    icon: Coffee,
    day: "SAT 13",
    title: "Pour-Over Workshop",
    desc: "Two hours with our head roaster. Beans and gear included.",
    time: "10:00 am",
    tag: "Workshop",
    img: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1000&q=70",
  },
  {
    icon: Calendar,
    day: "SUN 14",
    title: "Weekend Brunch Club",
    desc: "Long-table brunch with rotating chefs and bottomless espresso.",
    time: "11:00 am",
    tag: "Brunch",
    img: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=1000&q=70",
  },
];

export function Events() {
  return (
    <section className="py-24 md:py-32">
      <div className="container-luxe">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <Reveal>
              <span className="eyebrow">What's On</span>
            </Reveal>
            <Reveal delay={0.1}>
              <h2
                className="heading-serif mt-4 text-4xl md:text-5xl lg:text-6xl"
                style={{ color: "var(--espresso)" }}
              >
                Upcoming <em className="italic">evenings.</em>
              </h2>
            </Reveal>
          </div>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {events.map((e, i) => (
            <Reveal key={e.title} delay={i * 0.08}>
              <article
                className="group rounded-3xl overflow-hidden bg-card border transition-all hover:-translate-y-1.5 hover:shadow-luxe"
                style={{ borderColor: "color-mix(in oklab, var(--coffee) 15%, transparent)" }}
              >
                <div className="relative aspect-[5/4] overflow-hidden">
                  <img
                    src={e.img}
                    alt={e.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, transparent 50%, color-mix(in oklab, var(--espresso) 70%, transparent))",
                    }}
                  />
                  <div
                    className="absolute top-4 left-4 rounded-xl px-3 py-2 text-center"
                    style={{ background: "var(--cream)" }}
                  >
                    <div className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
                      {e.day.split(" ")[0]}
                    </div>
                    <div className="heading-serif text-xl" style={{ color: "var(--espresso)" }}>
                      {e.day.split(" ")[1]}
                    </div>
                  </div>
                  <span
                    className="absolute top-4 right-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] tracking-widest uppercase"
                    style={{ background: "var(--gold)", color: "var(--espresso)" }}
                  >
                    <e.icon className="h-3 w-3" /> {e.tag}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="heading-serif text-2xl" style={{ color: "var(--espresso)" }}>
                    {e.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{e.desc}</p>
                  <div
                    className="mt-4 text-xs tracking-[0.2em] uppercase"
                    style={{ color: "var(--coffee)" }}
                  >
                    Starts {e.time}
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
