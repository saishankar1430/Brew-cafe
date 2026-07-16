import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Twitter, MapPin, Phone, Mail } from "lucide-react";
import { BeanDivider } from "./BeanDivider";

export function Footer() {
  return (
    <footer
      className="relative pt-24 pb-10"
      style={{
        background: "var(--espresso)",
        color: "color-mix(in oklab, var(--cream) 85%, transparent)",
      }}
    >
      <BeanDivider tone="dark" />
      <div className="container-luxe grid gap-14 md:grid-cols-4">
        <div>
          <Link to="/" className="heading-serif text-3xl" style={{ color: "var(--cream)" }}>
            Maison<span style={{ color: "var(--gold)" }}>.</span>Noir
          </Link>
          <p className="mt-4 text-sm leading-relaxed opacity-80 max-w-xs">
            A slow café for people who love their coffee brewed with intention and served with quiet
            care.
          </p>
          <div className="mt-6 flex gap-3">
            {[Instagram, Facebook, Twitter].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="social"
                className="h-10 w-10 rounded-full inline-flex items-center justify-center transition-all hover:-translate-y-0.5"
                style={{
                  border: "1px solid color-mix(in oklab, var(--gold) 40%, transparent)",
                  color: "var(--gold)",
                }}
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4
            className="text-sm tracking-[0.3em] uppercase font-sans font-medium"
            style={{ color: "var(--gold)" }}
          >
            Explore
          </h4>
          <ul className="mt-5 space-y-3 text-sm">
            {[
              ["/menu", "Menu"],
              ["/about", "Our Story"],
              ["/gallery", "Gallery"],
              ["/reservations", "Reservations"],
              ["/order", "Order Online"],
              ["/contact", "Contact"],
              ["/admin", "Staff Portal"],
            ].map(([to, label]) => (
              <li key={to as string}>
                <Link
                  to={to as string}
                  className="hover:text-[color:var(--gold)] transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4
            className="text-sm tracking-[0.3em] uppercase font-sans font-medium"
            style={{ color: "var(--gold)" }}
          >
            Hours
          </h4>
          <ul className="mt-5 space-y-2 text-sm">
            <li className="flex justify-between gap-6">
              <span>Mon – Thu</span>
              <span className="opacity-70">7:00 – 21:00</span>
            </li>
            <li className="flex justify-between gap-6">
              <span>Friday</span>
              <span className="opacity-70">7:00 – 23:00</span>
            </li>
            <li className="flex justify-between gap-6">
              <span>Saturday</span>
              <span className="opacity-70">8:00 – 23:00</span>
            </li>
            <li className="flex justify-between gap-6">
              <span>Sunday</span>
              <span className="opacity-70">8:00 – 20:00</span>
            </li>
          </ul>
        </div>

        <div>
          <h4
            className="text-sm tracking-[0.3em] uppercase font-sans font-medium"
            style={{ color: "var(--gold)" }}
          >
            Visit
          </h4>
          <ul className="mt-5 space-y-3 text-sm">
            <li className="flex gap-3">
              <MapPin className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "var(--gold)" }} /> 24
              Ashwood Lane, Old Town Quarter
            </li>
            <li className="flex gap-3">
              <Phone className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "var(--gold)" }} /> +1
              (415) 555–0117
            </li>
            <li className="flex gap-3">
              <Mail className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "var(--gold)" }} />{" "}
              hello@maisonnoir.cafe
            </li>
          </ul>
        </div>
      </div>

      <div
        className="container-luxe mt-16 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs opacity-70"
        style={{ borderTop: "1px solid color-mix(in oklab, var(--cream) 15%, transparent)" }}
      >
        <p>© {new Date().getFullYear()} Maison Noir Café. Brewed with care.</p>
        <p>Handcrafted with warmth · Privacy · Terms</p>
      </div>
    </footer>
  );
}
