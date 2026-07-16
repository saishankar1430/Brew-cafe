import { useState } from "react";
import { toast } from "sonner";
import { Reveal } from "./Reveal";
import { Mail } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success("Welcome to the letter", {
      description: "One quiet email a month. That's a promise.",
    });
    setEmail("");
  };
  return (
    <section className="py-24">
      <div className="container-luxe">
        <Reveal>
          <div
            className="relative overflow-hidden rounded-[2.5rem] p-10 md:p-16 text-center"
            style={{ background: "var(--espresso)", color: "var(--cream)" }}
          >
            <div
              aria-hidden
              className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-40"
              style={{ background: "var(--gold)" }}
            />
            <div
              aria-hidden
              className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full blur-3xl opacity-30"
              style={{ background: "var(--coffee)" }}
            />
            <div className="relative max-w-2xl mx-auto">
              <span className="eyebrow justify-center inline-flex" style={{ color: "var(--gold)" }}>
                The Letter
              </span>
              <h2 className="heading-serif mt-4 text-4xl md:text-5xl lg:text-6xl">
                Slow news,{" "}
                <em className="italic" style={{ color: "var(--gold)" }}>
                  once a month.
                </em>
              </h2>
              <p className="mt-4 opacity-80">
                New seasonal drinks, upcoming events, and quiet essays from our roaster's desk.
              </p>
              <form
                onSubmit={submit}
                className="mt-8 flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
              >
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60" />
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    className="w-full rounded-full pl-11 pr-4 py-3.5 text-sm outline-none"
                    suppressHydrationWarning={true}
                    style={{
                      background: "color-mix(in oklab, var(--cream) 10%, transparent)",
                      color: "var(--cream)",
                      border: "1px solid color-mix(in oklab, var(--cream) 20%, transparent)",
                    }}
                  />
                </div>
                <button className="btn-gold" suppressHydrationWarning={true}>
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
