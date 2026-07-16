import { Instagram } from "lucide-react";
import { Reveal } from "./Reveal";

const u = (q: string) => `https://images.unsplash.com/${q}?auto=format&fit=crop&w=600&q=70`;
const posts = [
  "photo-1509042239860-f550ce710b93",
  "photo-1497935586351-b67a49e012bf",
  "photo-1445116572660-236099ec97a0",
  "photo-1442512595331-e89e73853f31",
  "photo-1509785307050-d4066910ec1e",
  "photo-1554118811-1e0d58224f24",
];

export function InstagramFeed() {
  return (
    <section
      className="py-24 md:py-32"
      style={{ background: "color-mix(in oklab, var(--coffee) 8%, var(--cream))" }}
    >
      <div className="container-luxe">
        <div className="text-center">
          <Reveal>
            <span className="eyebrow justify-center inline-flex">@maison.noir</span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2
              className="heading-serif mt-4 text-4xl md:text-5xl lg:text-6xl"
              style={{ color: "var(--espresso)" }}
            >
              Follow the daily pour.
            </h2>
          </Reveal>
        </div>
        <div className="mt-14 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {posts.map((p, i) => (
            <Reveal key={p} delay={i * 0.04}>
              <a
                href="#"
                aria-label="Instagram post"
                className="group block relative aspect-square overflow-hidden rounded-2xl"
              >
                <img
                  src={u(p)}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: "color-mix(in oklab, var(--espresso) 55%, transparent)",
                    color: "var(--cream)",
                  }}
                >
                  <Instagram className="h-6 w-6" />
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
