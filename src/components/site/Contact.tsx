import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Twitter } from "lucide-react";
import { Reveal } from "./Reveal";

export function Contact() {
  return (
    <section id="contact" className="py-24 md:py-32">
      <div className="container-luxe grid gap-10 lg:grid-cols-2">
        <div>
          <Reveal>
            <span className="eyebrow">Come Say Hello</span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2
              className="heading-serif mt-4 text-4xl md:text-5xl lg:text-6xl"
              style={{ color: "var(--espresso)" }}
            >
              Find us on <em className="italic">Ashwood Lane.</em>
            </h2>
          </Reveal>

          <div className="mt-10 grid sm:grid-cols-2 gap-5">
            {[
              { icon: MapPin, title: "Address", value: "24 Ashwood Lane, Old Town Quarter, SF" },
              { icon: Phone, title: "Phone", value: "+1 (415) 555-0117" },
              { icon: Mail, title: "Email", value: "hello@maisonnoir.cafe" },
              { icon: Clock, title: "Hours", value: "Mon–Sun · 7am – 10pm" },
            ].map((c, i) => (
              <Reveal key={c.title} delay={i * 0.06}>
                <div
                  className="rounded-2xl p-5 bg-card border h-full"
                  style={{ borderColor: "color-mix(in oklab, var(--gold) 25%, transparent)" }}
                >
                  <div
                    className="h-10 w-10 rounded-xl flex items-center justify-center"
                    style={{
                      background: "color-mix(in oklab, var(--gold) 25%, transparent)",
                      color: "var(--espresso)",
                    }}
                  >
                    <c.icon className="h-5 w-5" />
                  </div>
                  <div className="mt-4 text-xs tracking-[0.25em] uppercase text-muted-foreground">
                    {c.title}
                  </div>
                  <div className="mt-1 heading-serif text-lg" style={{ color: "var(--espresso)" }}>
                    {c.value}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.3}>
            <div className="mt-8 flex gap-3">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social"
                  className="h-11 w-11 inline-flex items-center justify-center rounded-full transition hover:-translate-y-0.5"
                  style={{ background: "var(--espresso)", color: "var(--gold)" }}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal>
          <div
            className="relative rounded-[2rem] overflow-hidden shadow-luxe h-[500px] lg:h-full min-h-[420px]"
            style={{ border: "1px solid color-mix(in oklab, var(--gold) 25%, transparent)" }}
          >
            <iframe
              title="Map"
              className="absolute inset-0 h-full w-full grayscale-[30%] contrast-95"
              src="https://www.openstreetmap.org/export/embed.html?bbox=-122.418%2C37.774%2C-122.408%2C37.780&layer=mapnik"
              loading="lazy"
            />
            <div className="absolute bottom-6 left-6 right-6 glass rounded-2xl p-4 shadow-soft">
              <p className="text-xs tracking-[0.3em] uppercase" style={{ color: "var(--coffee)" }}>
                The Café
              </p>
              <p className="heading-serif text-xl" style={{ color: "var(--espresso)" }}>
                24 Ashwood Lane · Old Town
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
