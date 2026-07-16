import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const links = [
  { to: "/", label: "Home" },
  { to: "/menu", label: "Menu" },
  { to: "/about", label: "About" },
  { to: "/gallery", label: "Gallery" },
  { to: "/reservations", label: "Reservations" },
  { to: "/reviews", label: "Reviews" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        suppressHydrationWarning={true}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled ? "py-3" : "py-5"
        }`}
      >
        <div
          className={`transition-all duration-500 ${
            scrolled
              ? "mx-auto max-w-6xl glass rounded-full shadow-soft"
              : "mx-auto max-w-7xl bg-transparent"
          }`}
        >
          <div className="flex items-center justify-between px-5 md:px-8 py-3">
            <Link to="/" className="flex items-center gap-2 group">
              <span
                aria-hidden
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ background: "var(--gold)" }}
              />
              <span
                className="heading-serif text-xl md:text-2xl tracking-tight"
                style={{ color: scrolled ? "var(--espresso)" : "var(--cream)" }}
              >
                Maison<span style={{ color: "var(--gold)" }}>.</span>Noir
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-8">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="text-sm font-medium tracking-wide transition-colors relative group"
                  style={{
                    color: scrolled
                      ? "var(--coffee)"
                      : "color-mix(in oklab, var(--cream) 90%, transparent)",
                  }}
                  activeProps={{ style: { color: "var(--gold)" } }}
                >
                  {l.label}
                  <span
                    aria-hidden
                    className="absolute -bottom-1 left-0 h-px w-0 group-hover:w-full transition-all duration-300"
                    style={{ background: "var(--gold)" }}
                  />
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <Link
                to="/order"
                suppressHydrationWarning={true}
                className="hidden sm:inline-flex btn-gold !py-2.5 !px-5 text-sm"
              >
                <ShoppingBag className="h-4 w-4" />
                Order Online
              </Link>
              <button
                suppressHydrationWarning={true}
                aria-label="Open menu"
                onClick={() => setOpen(true)}
                className="lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-full"
                style={{
                  color: scrolled ? "var(--espresso)" : "var(--cream)",
                  background: scrolled
                    ? "color-mix(in oklab, var(--gold) 20%, transparent)"
                    : "transparent",
                  border: `1px solid ${scrolled ? "var(--border)" : "color-mix(in oklab, var(--cream) 40%, transparent)"}`,
                }}
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[80] lg:hidden"
            style={{ background: "color-mix(in oklab, var(--espresso) 96%, transparent)" }}
          >
            <div className="flex items-center justify-between p-5">
              <span className="heading-serif text-2xl" style={{ color: "var(--cream)" }}>
                Maison<span style={{ color: "var(--gold)" }}>.</span>Noir
              </span>
              <button
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="h-11 w-11 inline-flex items-center justify-center rounded-full"
                style={{
                  color: "var(--cream)",
                  border: "1px solid color-mix(in oklab, var(--cream) 30%, transparent)",
                }}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="mt-6 flex flex-col items-center gap-6 px-6">
              {links.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <Link
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="heading-serif text-4xl"
                    style={{ color: "var(--cream)" }}
                    activeProps={{ style: { color: "var(--gold)" } }}
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              <Link to="/order" onClick={() => setOpen(false)} className="btn-gold mt-6">
                <ShoppingBag className="h-4 w-4" /> Order Online
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
