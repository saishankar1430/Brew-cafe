import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { ShoppingBag, Plus, Minus, X, Tag, ArrowRight, User, Mail, Clock } from "lucide-react";
import { menu as fallbackMenu, type MenuItem } from "@/lib/menu-data";
import { PageHeader } from "@/components/site/PageHeader";
import { getMenuItems, addOrder } from "@/lib/db-service";

export const Route = createFileRoute("/order")({
  head: () => ({
    meta: [
      { title: "Order Online — Maison Noir Café" },
      {
        name: "description",
        content:
          "Order your favorites for pickup or delivery. Coffee, pastries, and light meals, ready when you are.",
      },
      { property: "og:title", content: "Order Online — Maison Noir" },
      { property: "og:description", content: "Ready when you are." },
    ],
  }),
  component: OrderPage,
});

type Cart = Record<string, number>;

function OrderPage() {
  const [menuList, setMenuList] = useState<MenuItem[]>(fallbackMenu);
  const [cart, setCart] = useState<Cart>({});
  const [open, setOpen] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [applied, setApplied] = useState(0);
  const [loading, setLoading] = useState(true);

  // Customer info states
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [pickupTime, setPickupTime] = useState("15 minutes");
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  useEffect(() => {
    async function loadMenu() {
      try {
        const items = await getMenuItems();
        setMenuList(items);
      } catch (error) {
        console.error("Error loading menu:", error);
      } finally {
        setLoading(false);
      }
    }
    loadMenu();
  }, []);

  const add = (id: string) => {
    setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
    toast.success("Added to cart");
  };
  const remove = (id: string) =>
    setCart((c) => {
      const n = { ...c };
      if (!n[id]) return n;
      n[id] -= 1;
      if (n[id] <= 0) delete n[id];
      return n;
    });
  const del = (id: string) =>
    setCart((c) => {
      const n = { ...c };
      delete n[id];
      return n;
    });

  const items = useMemo(
    () =>
      Object.entries(cart)
        .map(([id, qty]) => ({ item: menuList.find((m) => m.id === id)!, qty }))
        .filter((x) => x.item),
    [cart, menuList],
  );

  const subtotal = items.reduce((s, { item, qty }) => s + item.price * qty, 0);
  const discount = subtotal * applied;
  const total = subtotal - discount;
  const count = items.reduce((s, x) => s + x.qty, 0);

  const applyCoupon = () => {
    if (coupon.trim().toUpperCase() === "MAISON10") {
      setApplied(0.1);
      toast.success("10% off applied");
    } else {
      toast.error("Invalid code");
      setApplied(0);
    }
  };

  const handleCheckout = async () => {
    if (!customerName.trim() || !customerEmail.trim()) {
      toast.error("Please provide your name and email for the order.");
      return;
    }
    setIsSubmittingOrder(true);
    try {
      await addOrder({
        items: items.map((x) => ({
          id: x.item.id,
          name: x.item.name,
          price: x.item.price,
          qty: x.qty,
        })),
        subtotal,
        discount,
        total,
        customerName,
        customerEmail,
        pickupTime,
      });

      toast.success("Order placed", { description: `Estimated pickup: ${pickupTime}.` });
      setCart({});
      setCustomerName("");
      setCustomerEmail("");
      setOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Could not place order. Please try again.");
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Order Online"
        title="Ready when you are."
        subtitle="Choose pickup or delivery at checkout. Most orders are boxed in under twelve minutes."
      />

      <section className="py-16 md:py-20">
        <div className="container-luxe">
          <div className="flex items-center justify-between mb-10">
            <h2 className="heading-serif text-3xl" style={{ color: "var(--espresso)" }}>
              Available now
            </h2>
            <button onClick={() => setOpen(true)} className="btn-gold !py-2.5 !px-5 relative">
              <ShoppingBag className="h-4 w-4" /> Cart
              {count > 0 && (
                <span
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: "var(--espresso)", color: "var(--cream)" }}
                >
                  {count}
                </span>
              )}
            </button>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div
                className="animate-spin rounded-full h-10 w-10 border-b-2 mx-auto"
                style={{ borderColor: "var(--coffee)" }}
              />
              <p className="mt-4 text-sm text-muted-foreground uppercase tracking-widest">
                Loading Menu...
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {menuList.map((m) => (
                <article
                  key={m.id}
                  className="group rounded-3xl overflow-hidden bg-card border transition-all hover:-translate-y-1 hover:shadow-luxe"
                  style={{ borderColor: "color-mix(in oklab, var(--coffee) 15%, transparent)" }}
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={m.image}
                      alt={m.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3
                        className="heading-serif text-lg leading-tight"
                        style={{ color: "var(--espresso)" }}
                      >
                        {m.name}
                      </h3>
                      <span className="text-base font-medium" style={{ color: "var(--coffee)" }}>
                        ${m.price.toFixed(2)}
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2">
                      {m.description}
                    </p>
                    <button
                      onClick={() => add(m.id)}
                      className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-full py-2.5 text-sm font-medium transition cursor-pointer"
                      style={{ background: "var(--espresso)", color: "var(--cream)" }}
                    >
                      <Plus className="h-4 w-4" /> Add to Cart
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[85]"
              style={{ background: "color-mix(in oklab, var(--espresso) 60%, transparent)" }}
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 24, stiffness: 220 }}
              className="fixed right-0 top-0 z-[86] h-dvh w-full max-w-md flex flex-col shadow-luxe"
              style={{ background: "var(--cream)" }}
            >
              <div
                className="flex items-center justify-between p-5 border-b"
                style={{ borderColor: "color-mix(in oklab, var(--coffee) 20%, transparent)" }}
              >
                <h3 className="heading-serif text-2xl" style={{ color: "var(--espresso)" }}>
                  Your Cart
                </h3>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close cart"
                  className="h-10 w-10 rounded-full inline-flex items-center justify-center"
                  style={{
                    border: "1px solid color-mix(in oklab, var(--coffee) 20%, transparent)",
                  }}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {items.length === 0 && (
                  <div className="text-center py-16 text-muted-foreground">
                    <ShoppingBag className="h-10 w-10 mx-auto opacity-40" />
                    <p className="mt-3 text-sm">Your cart is empty. Try adding a croissant.</p>
                  </div>
                )}
                {items.map(({ item, qty }) => (
                  <div
                    key={item.id}
                    className="flex gap-4 rounded-2xl p-3 bg-card border"
                    style={{ borderColor: "color-mix(in oklab, var(--coffee) 12%, transparent)" }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-20 w-20 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-2">
                        <p
                          className="heading-serif text-base truncate"
                          style={{ color: "var(--espresso)" }}
                        >
                          {item.name}
                        </p>
                        <button
                          onClick={() => del(item.id)}
                          aria-label="Remove"
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground">${item.price.toFixed(2)} each</p>
                      <div className="mt-2 flex items-center justify-between">
                        <div
                          className="inline-flex items-center rounded-full border"
                          style={{
                            borderColor: "color-mix(in oklab, var(--coffee) 20%, transparent)",
                          }}
                        >
                          <button
                            onClick={() => remove(item.id)}
                            aria-label="Decrease"
                            className="h-8 w-8 inline-flex items-center justify-center"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm tabular-nums">{qty}</span>
                          <button
                            onClick={() => add(item.id)}
                            aria-label="Increase"
                            className="h-8 w-8 inline-flex items-center justify-center"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <span
                          className="font-medium tabular-nums"
                          style={{ color: "var(--coffee)" }}
                        >
                          ${(item.price * qty).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Checkout customer inputs (only when items exist) */}
                {items.length > 0 && (
                  <div
                    className="pt-6 mt-6 border-t space-y-3.5"
                    style={{ borderColor: "color-mix(in oklab, var(--coffee) 15%, transparent)" }}
                  >
                    <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-1">
                      Contact & Pickup Details
                    </h4>
                    <div className="space-y-3">
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                          required
                          type="text"
                          placeholder="Your Name *"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="w-full rounded-xl pl-10 pr-3 py-2.5 text-sm bg-card border outline-none focus:ring-2 focus:ring-[color:var(--gold)]"
                        />
                      </div>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                          required
                          type="email"
                          placeholder="Your Email *"
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          className="w-full rounded-xl pl-10 pr-3 py-2.5 text-sm bg-card border outline-none focus:ring-2 focus:ring-[color:var(--gold)]"
                        />
                      </div>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <select
                          value={pickupTime}
                          onChange={(e) => setPickupTime(e.target.value)}
                          className="w-full rounded-xl pl-10 pr-3 py-2.5 text-sm bg-card border outline-none focus:ring-2 focus:ring-[color:var(--gold)] appearance-none"
                        >
                          <option value="15 minutes">Pickup in 15 mins (ASAP)</option>
                          <option value="30 minutes">Pickup in 30 mins</option>
                          <option value="45 minutes">Pickup in 45 mins</option>
                          <option value="1 hour">Pickup in 1 hour</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div
                className="p-5 border-t space-y-4"
                style={{ borderColor: "color-mix(in oklab, var(--coffee) 20%, transparent)" }}
              >
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      placeholder="Try MAISON10"
                      className="w-full rounded-full pl-9 pr-3 py-2.5 text-sm bg-card border outline-none focus:ring-2 focus:ring-[color:var(--gold)]"
                    />
                  </div>
                  <button
                    onClick={applyCoupon}
                    className="rounded-full px-5 text-sm font-medium cursor-pointer"
                    style={{ background: "var(--espresso)", color: "var(--cream)" }}
                  >
                    Apply
                  </button>
                </div>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="tabular-nums">${subtotal.toFixed(2)}</span>
                  </div>
                  {applied > 0 && (
                    <div className="flex justify-between" style={{ color: "var(--coffee)" }}>
                      <span>Discount</span>
                      <span className="tabular-nums">−${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div
                    className="flex justify-between heading-serif text-xl pt-2"
                    style={{ color: "var(--espresso)" }}
                  >
                    <span>Total</span>
                    <span className="tabular-nums">${total.toFixed(2)}</span>
                  </div>
                </div>
                <button
                  disabled={items.length === 0 || isSubmittingOrder}
                  onClick={handleCheckout}
                  className="btn-gold w-full disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmittingOrder ? (
                    "Placing Order..."
                  ) : (
                    <>
                      Checkout <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
