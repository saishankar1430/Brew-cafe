import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { galleryImages } from "@/lib/gallery-data";
import { Reveal } from "./Reveal";

export function Gallery({ compact = false }: { compact?: boolean }) {
  const [idx, setIdx] = useState<number | null>(null);
  const imgs = compact ? galleryImages.slice(0, 6) : galleryImages;

  const close = () => setIdx(null);
  const next = () => setIdx((i) => (i === null ? null : (i + 1) % imgs.length));
  const prev = () => setIdx((i) => (i === null ? null : (i - 1 + imgs.length) % imgs.length));

  return (
    <section id="gallery" className="py-24 md:py-32">
      <div className="container-luxe">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <Reveal>
              <span className="eyebrow">Gallery</span>
            </Reveal>
            <Reveal delay={0.1}>
              <h2
                className="heading-serif mt-4 text-4xl md:text-5xl lg:text-6xl max-w-xl"
                style={{ color: "var(--espresso)" }}
              >
                Moments, softly lit.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.2}>
            <p className="text-muted-foreground max-w-sm">
              Everything you see here happened on a real Tuesday.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
          {imgs.map((im, i) => (
            <Reveal key={im.src} delay={(i % 6) * 0.05}>
              <button
                suppressHydrationWarning={true}
                onClick={() => setIdx(i)}
                className="group block w-full overflow-hidden rounded-3xl break-inside-avoid focus:outline-none focus:ring-2 focus:ring-[color:var(--gold)]"
                aria-label={`Open ${im.alt}`}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={im.src}
                    alt={im.alt}
                    loading="lazy"
                    style={{ height: im.h * 0.4 }}
                    className="w-full object-cover transition-transform duration-[1200ms] group-hover:scale-110"
                  />
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background:
                        "linear-gradient(180deg, transparent 55%, color-mix(in oklab, var(--espresso) 80%, transparent))",
                    }}
                  />
                  <span
                    className="absolute bottom-4 left-4 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ color: "var(--cream)" }}
                  >
                    {im.alt}
                  </span>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {idx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-center justify-center p-4"
            style={{ background: "color-mix(in oklab, var(--espresso) 95%, transparent)" }}
            onClick={close}
          >
            <button
              suppressHydrationWarning={true}
              onClick={close}
              aria-label="Close"
              className="absolute top-6 right-6 h-11 w-11 rounded-full inline-flex items-center justify-center"
              style={{
                color: "var(--cream)",
                border: "1px solid color-mix(in oklab, var(--cream) 30%, transparent)",
              }}
            >
              <X className="h-5 w-5" />
            </button>
            <button
              suppressHydrationWarning={true}
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Previous"
              className="absolute left-4 md:left-8 h-12 w-12 rounded-full inline-flex items-center justify-center"
              style={{
                color: "var(--cream)",
                border: "1px solid color-mix(in oklab, var(--cream) 30%, transparent)",
              }}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              suppressHydrationWarning={true}
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Next"
              className="absolute right-4 md:right-8 h-12 w-12 rounded-full inline-flex items-center justify-center"
              style={{
                color: "var(--cream)",
                border: "1px solid color-mix(in oklab, var(--cream) 30%, transparent)",
              }}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <motion.img
              key={idx}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              src={imgs[idx].src}
              alt={imgs[idx].alt}
              className="max-h-[85vh] max-w-[92vw] rounded-2xl object-contain shadow-luxe"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
