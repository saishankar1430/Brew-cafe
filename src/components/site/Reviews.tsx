import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, Quote, MessageSquare, ChevronDown, Check } from "lucide-react";
import { Reveal } from "./Reveal";
import { getReviews, addReview, DbReview } from "@/lib/db-service";
import { toast } from "sonner";

export function Reviews() {
  const [reviewsList, setReviewsList] = useState<DbReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [i, setI] = useState(0);

  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newReview, setNewReview] = useState({
    name: "",
    role: "Regular Guest",
    rating: 5,
    text: "",
  });

  const loadReviews = async () => {
    try {
      const data = await getReviews(false);
      setReviewsList(data);
    } catch (error) {
      console.error("Error loading reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  useEffect(() => {
    if (reviewsList.length === 0) return;
    const t = setInterval(() => setI((n) => (n + 1) % reviewsList.length), 6000);
    return () => clearInterval(t);
  }, [reviewsList]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name || !newReview.text) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      // Pick a random avatar from Pravatar
      const randomId = Math.floor(Math.random() * 70);
      const avatarUrl = `https://i.pravatar.cc/120?img=${randomId}`;

      await addReview({
        name: newReview.name,
        role: newReview.role || "Regular Guest",
        rating: newReview.rating,
        text: newReview.text,
        avatar: avatarUrl,
      });

      toast.success("Thank you for your kind words!", {
        description: "Your review has been submitted for approval.",
      });

      // Reset form
      setNewReview({
        name: "",
        role: "Regular Guest",
        rating: 5,
        text: "",
      });
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Could not save review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const r = reviewsList[i];

  return (
    <section
      id="reviews"
      className="py-24 md:py-32"
      style={{ background: "color-mix(in oklab, var(--gold) 6%, var(--cream))" }}
    >
      <div className="container-luxe">
        <div className="text-center max-w-2xl mx-auto">
          <Reveal>
            <span className="eyebrow justify-center inline-flex">Kind Words</span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2
              className="heading-serif mt-4 text-4xl md:text-5xl lg:text-6xl"
              style={{ color: "var(--espresso)" }}
            >
              4.9 <span style={{ color: "var(--gold)" }}>★</span> from 2,300+ guests.
            </h2>
          </Reveal>
          <Reveal delay={0.2} className="mt-6">
            <button
              onClick={() => setIsFormOpen(!isFormOpen)}
              className="btn-gold !py-2.5 !px-5 text-sm gap-2 mt-4"
            >
              <MessageSquare className="h-4 w-4" />
              {isFormOpen ? "Cancel Review" : "Write a Review"}
            </button>
          </Reveal>
        </div>

        {/* Collapsible Form */}
        <AnimatePresence>
          {isFormOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="max-w-xl mx-auto mt-8 overflow-hidden"
            >
              <form
                onSubmit={handleSubmitReview}
                className="bg-card p-6 md:p-8 rounded-3xl border space-y-4"
                style={{ borderColor: "color-mix(in oklab, var(--gold) 30%, transparent)" }}
              >
                <h3 className="heading-serif text-xl" style={{ color: "var(--espresso)" }}>
                  Share your experience
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">
                      Your Name *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Jane Doe"
                      value={newReview.name}
                      onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                      className="w-full rounded-xl bg-background border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[color:var(--gold)]"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">
                      Who are you? (Role)
                    </label>
                    <input
                      type="text"
                      placeholder="regular since 2021, Espresso lover..."
                      value={newReview.role}
                      onChange={(e) => setNewReview({ ...newReview, role: e.target.value })}
                      className="w-full rounded-xl bg-background border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[color:var(--gold)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-2">
                    Your Rating ({newReview.rating} Stars)
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                        className="p-1 hover:scale-110 transition"
                      >
                        <Star
                          className={`h-7 w-7 ${
                            star <= newReview.rating
                              ? "fill-[color:var(--gold)] stroke-[color:var(--gold)]"
                              : "stroke-muted-foreground opacity-40"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">
                    Your Words *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell us what you liked (the saffron latte, the cozy seats, etc.)..."
                    value={newReview.text}
                    onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                    className="w-full rounded-xl bg-background border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[color:var(--gold)] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-gold w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Display Active Review */}
        <div className="mt-16 max-w-3xl mx-auto relative min-h-[220px]">
          <Quote
            className="absolute -top-6 -left-2 h-16 w-16 opacity-15"
            style={{ color: "var(--coffee)" }}
          />

          {loading ? (
            <div className="text-center py-12">
              <div
                className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto"
                style={{ borderColor: "var(--coffee)" }}
              />
              <p className="mt-3 text-xs text-muted-foreground uppercase tracking-wider">
                Brewing words...
              </p>
            </div>
          ) : reviewsList.length > 0 && r ? (
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={r.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
                className="text-center px-4"
              >
                <div className="flex justify-center gap-1 mb-6">
                  {Array.from({ length: r.rating }).map((_, k) => (
                    <Star
                      key={k}
                      className="h-5 w-5 fill-[color:var(--gold)] stroke-[color:var(--gold)]"
                    />
                  ))}
                </div>
                <p
                  className="heading-serif text-2xl md:text-3xl lg:text-4xl leading-snug text-balance"
                  style={{ color: "var(--espresso)" }}
                >
                  "{r.text}"
                </p>
                <div className="mt-8 inline-flex items-center gap-3">
                  <img
                    src={r.avatar}
                    alt={r.name}
                    className="h-12 w-12 rounded-full object-cover"
                    style={{ border: "2px solid var(--gold)" }}
                  />
                  <div className="text-left">
                    <div className="font-medium" style={{ color: "var(--espresso)" }}>
                      {r.name}
                    </div>
                    <div className="text-xs tracking-wider uppercase text-muted-foreground">
                      {r.role}
                    </div>
                  </div>
                </div>
              </motion.blockquote>
            </AnimatePresence>
          ) : (
            <p className="text-center text-muted-foreground py-12">No reviews approved yet.</p>
          )}

          {reviewsList.length > 1 && (
            <div className="mt-10 flex justify-center gap-2">
              {reviewsList.map((_, k) => (
                <button
                  key={k}
                  onClick={() => setI(k)}
                  aria-label={`Review ${k + 1}`}
                  className="h-1.5 rounded-full transition-all"
                  style={{
                    width: k === i ? 32 : 8,
                    background:
                      k === i
                        ? "var(--coffee)"
                        : "color-mix(in oklab, var(--coffee) 25%, transparent)",
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
