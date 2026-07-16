import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronDown } from "lucide-react";
import heroImg from "@/assets/hero.jpg";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <section ref={ref} className="relative h-dvh min-h-[700px] overflow-hidden">
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <img
          src={heroImg}
          alt="Cinematic café interior at golden hour"
          className="h-full w-full object-cover"
          width={1920}
          height={1280}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, color-mix(in oklab, #2D1E16 45%, transparent) 0%, color-mix(in oklab, #2D1E16 30%, transparent) 40%, color-mix(in oklab, #2D1E16 85%, transparent) 100%)",
          }}
        />
      </motion.div>

      {/* Steam particles */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-24 flex justify-center pointer-events-none"
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="animate-steam block h-24 w-6 mx-2 rounded-full blur-md"
            style={{
              background: "linear-gradient(180deg, rgba(247,242,235,0.6), transparent)",
              animationDelay: `${i * 0.7}s`,
            }}
          />
        ))}
      </div>

      <motion.div
        style={{ opacity }}
        className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6"
      >
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-xs md:text-sm tracking-[0.4em] uppercase"
          style={{ color: "var(--gold)" }}
        >
          Est. 2011 · A slow café
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="heading-serif mt-6 text-5xl md:text-7xl lg:text-8xl text-balance max-w-5xl"
          style={{ color: "var(--cream)" }}
        >
          Crafted with Passion.
          <br />
          <span className="italic" style={{ color: "var(--gold)" }}>
            Served
          </span>{" "}
          with Love.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 1 }}
          className="mt-8 max-w-xl text-base md:text-lg leading-relaxed"
          style={{ color: "color-mix(in oklab, var(--cream) 88%, transparent)" }}
        >
          Single-origin coffee, hand-rolled pastries, and quiet rooms lit like old films. A place to
          sit longer than you meant to.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="mt-10 flex flex-col sm:flex-row gap-4"
        >
          <Link to="/reservations" className="btn-gold">
            Reserve a Table
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/menu" className="btn-ghost-luxe">
            Explore Menu
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ color: "color-mix(in oklab, var(--cream) 75%, transparent)" }}
      >
        <span className="text-[10px] tracking-[0.4em] uppercase">Scroll</span>
        <motion.span animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <ChevronDown className="h-5 w-5" />
        </motion.span>
      </motion.div>
    </section>
  );
}
