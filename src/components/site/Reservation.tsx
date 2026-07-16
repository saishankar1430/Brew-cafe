import { useState } from "react";
import { Calendar, Clock, Users, Sparkles, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { Reveal } from "./Reveal";
import latteImg from "@/assets/latte.jpg";
import { addReservation } from "@/lib/db-service";

export function Reservation() {
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    name: "",
    email: "",
    date: "",
    time: "19:00",
    guests: "2",
    occasion: "None",
    notes: "",
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const reservationId = await addReservation({
        name: state.name,
        email: state.email,
        date: state.date,
        time: state.time,
        guests: Number(state.guests),
        occasion: state.occasion,
        notes: state.notes,
      });

      // Securely trigger email confirmation via server-side API
      if (reservationId) {
        try {
          await fetch("/api/trigger-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reservationId }),
          });
        } catch (apiErr) {
          console.error("Failed to trigger email confirmation API:", apiErr);
        }
      }

      toast.success("Table request received", {
        description: `We'll confirm ${state.name || "your"} booking for ${state.guests} within 30 min.`,
      });

      setState({
        name: "",
        email: "",
        date: "",
        time: "19:00",
        guests: "2",
        occasion: "None",
        notes: "",
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to place reservation request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const field =
    "w-full rounded-2xl bg-card px-4 py-3.5 text-sm border outline-none focus:ring-2 focus:ring-[color:var(--gold)] transition";

  return (
    <section id="reservations" className="py-24 md:py-32">
      <div className="container-luxe grid gap-12 lg:grid-cols-2 items-center">
        <Reveal>
          <div className="relative">
            <div className="overflow-hidden rounded-[2rem] shadow-luxe">
              <img
                src={latteImg}
                alt="Latte on a wooden table"
                loading="lazy"
                className="w-full h-[520px] object-cover"
              />
            </div>
            <div className="absolute bottom-6 left-6 right-6 glass rounded-2xl p-5 shadow-soft">
              <p className="text-xs tracking-[0.3em] uppercase" style={{ color: "var(--coffee)" }}>
                Tonight
              </p>
              <p className="heading-serif text-2xl mt-1" style={{ color: "var(--espresso)" }}>
                Vinyl & pour-over, from 7pm
              </p>
            </div>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <span className="eyebrow">Reservations</span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2
              className="heading-serif mt-4 text-4xl md:text-5xl lg:text-6xl"
              style={{ color: "var(--espresso)" }}
            >
              Save a corner <em className="italic">for you.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-4 text-muted-foreground max-w-lg">
              Booking takes under a minute. We confirm every request personally.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <form
              onSubmit={submit}
              className="mt-10 rounded-3xl p-6 md:p-8 bg-card shadow-soft"
              style={{ border: "1px solid color-mix(in oklab, var(--gold) 25%, transparent)" }}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
                    Name
                  </span>
                  <input
                    required
                    value={state.name}
                    onChange={(e) => setState({ ...state, name: e.target.value })}
                    className={`${field} mt-2`}
                    placeholder="Your name"
                    suppressHydrationWarning={true}
                  />
                </label>
                <label className="block">
                  <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
                    Email
                  </span>
                  <input
                    required
                    type="email"
                    value={state.email}
                    onChange={(e) => setState({ ...state, email: e.target.value })}
                    className={`${field} mt-2`}
                    placeholder="you@email.com"
                    suppressHydrationWarning={true}
                  />
                </label>
                <label className="block">
                  <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" /> Date
                  </span>
                  <input
                    required
                    type="date"
                    value={state.date}
                    onChange={(e) => setState({ ...state, date: e.target.value })}
                    className={`${field} mt-2`}
                    suppressHydrationWarning={true}
                  />
                </label>
                <label className="block">
                  <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" /> Time
                  </span>
                  <select
                    value={state.time}
                    onChange={(e) => setState({ ...state, time: e.target.value })}
                    className={`${field} mt-2`}
                    suppressHydrationWarning={true}
                  >
                    {["08:00", "10:00", "12:00", "14:00", "17:00", "19:00", "20:30"].map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" /> Guests
                  </span>
                  <select
                    value={state.guests}
                    onChange={(e) => setState({ ...state, guests: e.target.value })}
                    className={`${field} mt-2`}
                    suppressHydrationWarning={true}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((g) => (
                      <option key={g}>{g}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" /> Occasion
                  </span>
                  <select
                    value={state.occasion}
                    onChange={(e) => setState({ ...state, occasion: e.target.value })}
                    className={`${field} mt-2`}
                    suppressHydrationWarning={true}
                  >
                    {["None", "Birthday", "Anniversary", "Date", "Business", "Celebration"].map(
                      (o) => (
                        <option key={o}>{o}</option>
                      ),
                    )}
                  </select>
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground flex items-center gap-1.5">
                    <MessageSquare className="h-3.5 w-3.5" /> Special request
                  </span>
                  <textarea
                    value={state.notes}
                    onChange={(e) => setState({ ...state, notes: e.target.value })}
                    rows={3}
                    className={`${field} mt-2 resize-none`}
                    placeholder="Window seat, dietary notes, etc."
                    suppressHydrationWarning={true}
                  />
                </label>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-gold w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                suppressHydrationWarning={true}
              >
                {loading ? "Requesting..." : "Reserve My Table"}
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
