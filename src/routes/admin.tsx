import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useMemo, useCallback } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  User,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  getOrders,
  getReservations,
  getReviews,
  getMenuItems,
  updateOrderStatus,
  deleteOrder,
  updateReservationStatus,
  deleteReservation,
  updateReviewApproval,
  deleteReview,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  DbOrder,
  DbReservation,
  DbReview,
} from "@/lib/db-service";
import { MenuItem, MenuCategory, categories } from "@/lib/menu-data";
import { toast } from "sonner";
import { PageHeader } from "@/components/site/PageHeader";
import {
  ShoppingBag,
  Calendar,
  Star,
  Coffee,
  LogOut,
  Check,
  X,
  Trash2,
  Plus,
  Edit,
  Search,
  Lock,
  Mail,
  Eye,
  User as UserIcon,
  CheckCircle,
  Clock,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Panel — Maison Noir Café" },
      { name: "description", content: "Maison Noir Administration and Controls." },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Login states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Active tab
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "orders" | "reservations" | "reviews" | "menu"
  >("dashboard");

  // Data states
  const [orders, setOrders] = useState<DbOrder[]>([]);
  const [reservations, setReservations] = useState<DbReservation[]>([]);
  const [reviews, setReviews] = useState<DbReview[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  // Search/Filters
  const [orderFilter, setOrderFilter] = useState("all");
  const [resFilter, setResFilter] = useState("all");
  const [menuFilter, setMenuFilter] = useState("All");

  // Email confirmation preview modal state
  const [previewEmail, setPreviewEmail] = useState<string | null>(null);

  // Add/Edit Menu item modal states
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [menuForm, setMenuForm] = useState<Omit<MenuItem, "id">>({
    name: "",
    description: "",
    price: 0,
    calories: 150,
    category: "Coffee",
    veg: true,
    popular: false,
    available: true,
    image:
      "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=1000&q=70",
  });

  // Track auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usr) => {
      setUser(usr);
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  // Fetch all dashboard / management data once logged in
  const loadAllData = useCallback(async () => {
    if (!user) return;
    setDataLoading(true);
    try {
      const [ordData, resData, revData, menData] = await Promise.all([
        getOrders(),
        getReservations(),
        getReviews(true), // get ALL reviews including unapproved
        getMenuItems(),
      ]);
      setOrders(ordData);
      setReservations(resData);
      setReviews(revData);
      setMenuItems(menData);
    } catch (err) {
      console.error("Error fetching admin data:", err);
      toast.error("Failed to sync some administrative data.");
    } finally {
      setDataLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadAllData();
    }
  }, [user, loadAllData]);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoginLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Welcome back, Administrator.");
    } catch (err) {
      console.error(err);
      const errorMsg = err instanceof Error ? err.message : "Invalid credentials.";
      toast.error(errorMsg);
    } finally {
      setLoginLoading(false);
    }
  };

  // Auto setup a demo admin account for ease of testing
  const handleDemoProvision = async () => {
    setLoginLoading(true);
    const demoEmail = "admin@maisonnoir.com";
    const demoPassword = "adminpassword123";
    try {
      // First try to sign in
      await signInWithEmailAndPassword(auth, demoEmail, demoPassword);
      toast.success("Logged in with Demo Admin.");
    } catch (err) {
      // If user doesn't exist, register them
      try {
        await createUserWithEmailAndPassword(auth, demoEmail, demoPassword);
        toast.success("Demo Admin Provisioned & Logged in successfully!", {
          description: "Use admin@maisonnoir.com / adminpassword123 for future logins.",
        });
      } catch (regErr) {
        console.error(regErr);
        toast.error("Provisioning failed. Try standard credentials.");
      }
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully.");
    } catch (err) {
      toast.error("Logout failed.");
    }
  };

  // --- ACTIONS ---

  // Update order status
  const handleUpdateOrderStatus = async (id: string, status: DbOrder["status"]) => {
    try {
      await updateOrderStatus(id, status);
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
      toast.success(`Order updated to: ${status}`);
    } catch (err) {
      toast.error("Failed to update order status.");
    }
  };

  // Delete Order
  const handleDeleteOrder = async (id: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    try {
      await deleteOrder(id);
      setOrders((prev) => prev.filter((o) => o.id !== id));
      toast.success("Order deleted.");
    } catch (err) {
      toast.error("Failed to delete order.");
    }
  };

  // Update Reservation
  const handleUpdateReservationStatus = async (id: string, status: DbReservation["status"]) => {
    try {
      await updateReservationStatus(id, status);
      setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
      toast.success(`Reservation updated to: ${status}`);
    } catch (err) {
      toast.error("Failed to update reservation.");
    }
  };

  // Delete Reservation
  const handleDeleteReservation = async (id: string) => {
    if (!confirm("Delete this table reservation?")) return;
    try {
      await deleteReservation(id);
      setReservations((prev) => prev.filter((r) => r.id !== id));
      toast.success("Reservation deleted.");
    } catch (err) {
      toast.error("Failed to delete reservation.");
    }
  };

  // Approve / Moderate Review
  const handleToggleReviewApproval = async (id: string, currentApproved: boolean) => {
    const nextApproved = !currentApproved;
    try {
      await updateReviewApproval(id, nextApproved);
      setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, approved: nextApproved } : r)));
      toast.success(nextApproved ? "Review published!" : "Review hidden from public feed.");
    } catch (err) {
      toast.error("Moderation update failed.");
    }
  };

  // Delete Review
  const handleDeleteReview = async (id: string) => {
    if (!confirm("Delete this review forever?")) return;
    try {
      await deleteReview(id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
      toast.success("Review deleted permanently.");
    } catch (err) {
      toast.error("Failed to delete review.");
    }
  };

  // Open menu creation / editing modal
  const openMenuModal = (item: MenuItem | null = null) => {
    if (item) {
      setEditingItem(item);
      setMenuForm({
        name: item.name,
        description: item.description,
        price: item.price,
        calories: item.calories,
        category: item.category,
        veg: item.veg,
        popular: item.popular || false,
        available: item.available ?? true,
        image: item.image,
      });
    } else {
      setEditingItem(null);
      setMenuForm({
        name: "",
        description: "",
        price: 4.5,
        calories: 120,
        category: "Coffee",
        veg: true,
        popular: false,
        available: true,
        image:
          "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=1000&q=70",
      });
    }
    setIsMenuModalOpen(true);
  };

  // Save Menu Item
  const handleSaveMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!menuForm.name || !menuForm.description || menuForm.price <= 0) {
      toast.error("Please fill in all menu item details.");
      return;
    }

    try {
      if (editingItem && editingItem.id) {
        await updateMenuItem(editingItem.id, menuForm);
        setMenuItems((prev) =>
          prev.map((m) => (m.id === editingItem.id ? { ...m, ...menuForm } : m)),
        );
        toast.success("Menu item updated successfully.");
      } else {
        const newId = await addMenuItem(menuForm);
        setMenuItems((prev) => [...prev, { id: newId, ...menuForm }]);
        toast.success("New menu item created!");
      }
      setIsMenuModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save menu item.");
    }
  };

  // Delete Menu Item
  const handleDeleteMenuItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this menu item from the catalog?")) return;
    try {
      await deleteMenuItem(id);
      setMenuItems((prev) => prev.filter((m) => m.id !== id));
      toast.success("Menu item deleted.");
    } catch (err) {
      toast.error("Failed to delete menu item.");
    }
  };

  // --- STATS & CHARTS CALCULATIONS ---

  const stats = useMemo(() => {
    const totalOrdersCount = orders.length;
    const completedOrders = orders.filter((o) => o.status === "completed");
    const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total, 0);

    const pendingOrdersCount = orders.filter(
      (o) => o.status === "pending" || o.status === "preparing",
    ).length;
    const pendingResCount = reservations.filter((r) => r.status === "pending").length;
    const unapprovedRevCount = reviews.filter((r) => !r.approved).length;

    return {
      totalOrdersCount,
      totalRevenue,
      pendingOrdersCount,
      pendingResCount,
      unapprovedRevCount,
    };
  }, [orders, reservations, reviews]);

  const chartData = useMemo(() => {
    // Generate simple order chart data for the last 5 days
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days.map((day, idx) => {
      // mock distribute actual orders or fallback
      const ordMultiplier = (orders.length || 4) + idx * 2;
      return {
        name: day,
        Sales: Math.round(ordMultiplier * 14.5 + 40),
        Orders: Math.round(ordMultiplier * 0.8 + 2),
        Bookings: Math.round((reservations.length || 3) * 0.4 + (idx % 2)),
      };
    });
  }, [orders, reservations]);

  // Filter lists
  const filteredOrders = useMemo(() => {
    if (orderFilter === "all") return orders;
    return orders.filter((o) => o.status === orderFilter);
  }, [orders, orderFilter]);

  const filteredReservations = useMemo(() => {
    if (resFilter === "all") return reservations;
    return reservations.filter((r) => r.status === resFilter);
  }, [reservations, resFilter]);

  const filteredMenuItems = useMemo(() => {
    if (menuFilter === "All") return menuItems;
    return menuItems.filter((m) => m.category === menuFilter);
  }, [menuItems, menuFilter]);

  // AUTH AND INITIAL LOADING VIEWS
  if (authLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background px-4">
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-10 w-10 border-b-2 mx-auto"
            style={{ borderColor: "var(--coffee)" }}
          />
          <p className="mt-4 text-sm text-muted-foreground uppercase tracking-widest">
            Authorizing...
          </p>
        </div>
      </div>
    );
  }

  // LOGIN SCREEN
  if (!user) {
    return (
      <>
        <PageHeader
          eyebrow="Security Access"
          title="Maison Noir Admin"
          subtitle="Authenticating staff, managers, and designers. Please enter your terminal keys below."
        />
        <section className="py-20 md:py-28 flex justify-center items-center">
          <div className="container-luxe max-w-md">
            <div
              className="bg-card rounded-3xl p-8 shadow-luxe border"
              style={{ borderColor: "color-mix(in oklab, var(--gold) 25%, transparent)" }}
            >
              <div className="flex justify-center mb-6">
                <div
                  className="p-4 rounded-full"
                  style={{ background: "color-mix(in oklab, var(--gold) 15%, transparent)" }}
                >
                  <Lock className="h-6 w-6" style={{ color: "var(--coffee)" }} />
                </div>
              </div>

              <h3
                className="heading-serif text-2xl text-center mb-6"
                style={{ color: "var(--espresso)" }}
              >
                Staff Authentication
              </h3>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">
                    Staff Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground" />
                    <input
                      required
                      type="email"
                      placeholder="admin@maisonnoir.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-2xl bg-background border px-10 py-3 text-sm outline-none focus:ring-2 focus:ring-[color:var(--gold)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">
                    Terminal Code (Password)
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground" />
                    <input
                      required
                      type="password"
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-2xl bg-background border px-10 py-3 text-sm outline-none focus:ring-2 focus:ring-[color:var(--gold)]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="btn-gold w-full py-3.5 font-medium cursor-pointer"
                >
                  {loginLoading ? "Authorizing..." : "Log In to Workspace"}
                </button>
              </form>

              <div className="relative my-6 flex items-center justify-center">
                <div className="absolute inset-x-0 h-px bg-border" />
                <span className="relative bg-card px-3 text-xs uppercase tracking-widest text-muted-foreground">
                  Quick Access
                </span>
              </div>

              <button
                type="button"
                onClick={handleDemoProvision}
                disabled={loginLoading}
                className="w-full rounded-full py-3 text-xs uppercase tracking-wider font-semibold border text-center transition hover:bg-neutral-100 cursor-pointer"
                style={{
                  color: "var(--espresso)",
                  borderColor: "color-mix(in oklab, var(--coffee) 20%, transparent)",
                }}
              >
                Setup & Log In with Demo Admin
              </button>
              <p className="text-center text-[10px] text-muted-foreground mt-3 leading-relaxed">
                Creates account <strong>admin@maisonnoir.com</strong> with{" "}
                <strong>adminpassword123</strong> if it doesn't exist, and instantly logs you in.
              </p>
            </div>
          </div>
        </section>
      </>
    );
  }

  // LOGGED IN WORKSPACE VIEW
  return (
    <>
      <div
        className="border-b"
        style={{ background: "var(--cream)", borderColor: "var(--border)" }}
      >
        <div className="container-luxe py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="eyebrow">Terminal Panel</span>
            <h1
              className="heading-serif text-3xl md:text-4xl mt-1"
              style={{ color: "var(--espresso)" }}
            >
              Workspace Hub
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Securely connected as <span className="font-semibold">{user.email}</span>
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-full px-5 py-2 text-xs uppercase tracking-wider font-medium inline-flex items-center gap-2 border hover:bg-neutral-100 transition cursor-pointer"
            style={{
              color: "var(--espresso)",
              borderColor: "color-mix(in oklab, var(--coffee) 30%, transparent)",
            }}
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      </div>

      <section className="py-12 bg-neutral-50/50 min-h-[600px]">
        <div className="container-luxe">
          {/* Main workspace navigation tabs */}
          <div className="flex overflow-x-auto gap-2 border-b pb-4 mb-8">
            {[
              { id: "dashboard", label: "Dashboard", icon: TrendingUp },
              {
                id: "orders",
                label: `Orders (${stats.pendingOrdersCount} Active)`,
                icon: ShoppingBag,
              },
              {
                id: "reservations",
                label: `Reservations (${stats.pendingResCount})`,
                icon: Calendar,
              },
              { id: "reviews", label: `Reviews (${stats.unapprovedRevCount} Pending)`, icon: Star },
              { id: "menu", label: "Menu Catalog", icon: Coffee },
            ].map((tab) => {
              const IconComp = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className="flex items-center gap-2 rounded-full px-5 py-2.5 text-xs uppercase tracking-wider font-semibold transition shrink-0 cursor-pointer"
                  style={{
                    background: activeTab === tab.id ? "var(--espresso)" : "transparent",
                    color: activeTab === tab.id ? "var(--cream)" : "var(--coffee)",
                    border: `1px solid ${
                      activeTab === tab.id
                        ? "var(--espresso)"
                        : "color-mix(in oklab, var(--coffee) 15%, transparent)"
                    }`,
                  }}
                >
                  <IconComp className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {dataLoading && (
            <div className="flex justify-center items-center py-20">
              <div
                className="animate-spin rounded-full h-8 w-8 border-b-2"
                style={{ borderColor: "var(--coffee)" }}
              />
              <span className="ml-3 text-sm text-muted-foreground">Syncing cloud records...</span>
            </div>
          )}

          {!dataLoading && (
            <div className="space-y-8">
              {/* --- 1. DASHBOARD VIEW --- */}
              {activeTab === "dashboard" && (
                <>
                  {/* Stats Cards Row */}
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <article className="bg-card p-6 rounded-3xl border shadow-soft">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                            Total Income
                          </p>
                          <h4 className="heading-serif text-3xl mt-1 text-espresso">
                            ${stats.totalRevenue.toFixed(2)}
                          </h4>
                          <p className="text-[10px] text-green-600 mt-2 flex items-center gap-1">
                            <span>▲ 12.4%</span> since yesterday
                          </p>
                        </div>
                        <div
                          className="p-3 rounded-full"
                          style={{
                            background: "color-mix(in oklab, var(--gold) 20%, transparent)",
                          }}
                        >
                          <TrendingUp className="h-5 w-5" style={{ color: "var(--coffee)" }} />
                        </div>
                      </div>
                    </article>

                    <article className="bg-card p-6 rounded-3xl border shadow-soft">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                            Active Orders
                          </p>
                          <h4 className="heading-serif text-3xl mt-1 text-espresso">
                            {stats.pendingOrdersCount}
                          </h4>
                          <p className="text-[10px] text-muted-foreground mt-2">
                            Ready for preparation
                          </p>
                        </div>
                        <div
                          className="p-3 rounded-full"
                          style={{
                            background: "color-mix(in oklab, var(--gold) 20%, transparent)",
                          }}
                        >
                          <ShoppingBag className="h-5 w-5" style={{ color: "var(--coffee)" }} />
                        </div>
                      </div>
                    </article>

                    <article className="bg-card p-6 rounded-3xl border shadow-soft">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                            Pending Bookings
                          </p>
                          <h4 className="heading-serif text-3xl mt-1 text-espresso">
                            {stats.pendingResCount}
                          </h4>
                          <p className="text-[10px] text-muted-foreground mt-2">
                            Awaiting staff confirmation
                          </p>
                        </div>
                        <div
                          className="p-3 rounded-full"
                          style={{
                            background: "color-mix(in oklab, var(--gold) 20%, transparent)",
                          }}
                        >
                          <Calendar className="h-5 w-5" style={{ color: "var(--coffee)" }} />
                        </div>
                      </div>
                    </article>

                    <article className="bg-card p-6 rounded-3xl border shadow-soft">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                            Review Moderation
                          </p>
                          <h4 className="heading-serif text-3xl mt-1 text-espresso">
                            {stats.unapprovedRevCount}
                          </h4>
                          <p className="text-[10px] text-orange-600 mt-2">
                            New customer logs to vet
                          </p>
                        </div>
                        <div
                          className="p-3 rounded-full"
                          style={{
                            background: "color-mix(in oklab, var(--gold) 20%, transparent)",
                          }}
                        >
                          <Star className="h-5 w-5" style={{ color: "var(--coffee)" }} />
                        </div>
                      </div>
                    </article>
                  </div>

                  {/* Chart and Quick Tasks Grid */}
                  <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
                    <div className="bg-card p-6 md:p-8 rounded-[2rem] border shadow-soft">
                      <h3 className="heading-serif text-2xl mb-6 text-espresso">
                        Sales & Activity Forecast
                      </h3>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={chartData}
                            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                          >
                            <defs>
                              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--gold)" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="var(--gold)" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                            <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} />
                            <YAxis stroke="#888888" fontSize={11} tickLine={false} />
                            <Tooltip />
                            <Area
                              type="monotone"
                              dataKey="Sales"
                              stroke="var(--gold)"
                              strokeWidth={2}
                              fillOpacity={1}
                              fill="url(#colorSales)"
                            />
                            <Area
                              type="monotone"
                              dataKey="Orders"
                              stroke="var(--espresso)"
                              strokeWidth={1}
                              fill="transparent"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Quick Activity Terminal */}
                    <div className="bg-card p-6 rounded-[2rem] border shadow-soft flex flex-col justify-between">
                      <div>
                        <h3 className="heading-serif text-xl mb-4 text-espresso">
                          System Diagnostics
                        </h3>
                        <div className="space-y-3 font-mono text-[11px] text-muted-foreground bg-neutral-900 text-neutral-200 p-4 rounded-2xl">
                          <p className="text-emerald-400">● Core Cloud DB Synchronized</p>
                          <p>● Firestore Host: firebaseapp.com</p>
                          <p>● DB ID: {auth.app.options.projectId}</p>
                          <p>
                            ● Total Records: {orders.length + reservations.length + reviews.length}{" "}
                            items
                          </p>
                          <p>● Client Version: 3.5.0 Stable</p>
                        </div>
                      </div>

                      <div className="mt-6 space-y-2">
                        <button
                          onClick={() => setActiveTab("orders")}
                          className="w-full flex justify-between items-center bg-neutral-100 hover:bg-neutral-200 rounded-full px-5 py-3 text-xs uppercase tracking-wider font-semibold text-espresso transition cursor-pointer"
                        >
                          Manage Pending Orders <ChevronRight className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setActiveTab("reservations")}
                          className="w-full flex justify-between items-center bg-neutral-100 hover:bg-neutral-200 rounded-full px-5 py-3 text-xs uppercase tracking-wider font-semibold text-espresso transition cursor-pointer"
                        >
                          Approve Table Requests <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* --- 2. ORDERS MANAGEMENT VIEW --- */}
              {activeTab === "orders" && (
                <div className="bg-card rounded-[2rem] border p-6 md:p-8 shadow-soft">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                      <h3 className="heading-serif text-2xl text-espresso">Order Terminal</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Track customer orders and manage fulfillment status.
                      </p>
                    </div>

                    {/* Filters */}
                    <div className="flex gap-2">
                      {["all", "pending", "preparing", "ready", "completed", "cancelled"].map(
                        (filter) => (
                          <button
                            key={filter}
                            onClick={() => setOrderFilter(filter)}
                            className="px-3.5 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider transition cursor-pointer"
                            style={{
                              background:
                                orderFilter === filter ? "var(--espresso)" : "transparent",
                              color: orderFilter === filter ? "var(--cream)" : "var(--coffee)",
                              border: `1px solid ${
                                orderFilter === filter
                                  ? "var(--espresso)"
                                  : "color-mix(in oklab, var(--coffee) 15%, transparent)"
                              }`,
                            }}
                          >
                            {filter}
                          </button>
                        ),
                      )}
                    </div>
                  </div>

                  {filteredOrders.length === 0 ? (
                    <div className="text-center py-16 border rounded-2xl bg-neutral-50/50">
                      <ShoppingBag className="h-10 w-10 mx-auto opacity-30 text-muted-foreground" />
                      <p className="mt-3 text-sm text-muted-foreground font-medium">
                        No orders found in this category.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead>
                          <tr className="border-b text-xs uppercase tracking-wider text-muted-foreground">
                            <th className="py-3 px-4 font-semibold">Customer</th>
                            <th className="py-3 px-4 font-semibold">Items</th>
                            <th className="py-3 px-4 font-semibold">Amount</th>
                            <th className="py-3 px-4 font-semibold">Pickup Time</th>
                            <th className="py-3 px-4 font-semibold">Status</th>
                            <th className="py-3 px-4 font-semibold text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredOrders.map((o) => (
                            <tr key={o.id} className="border-b hover:bg-neutral-50/50">
                              <td className="py-4 px-4 font-medium">
                                <div className="font-semibold text-espresso">{o.customerName}</div>
                                <div className="text-xs text-muted-foreground">
                                  {o.customerEmail}
                                </div>
                              </td>
                              <td className="py-4 px-4 max-w-xs">
                                <ul className="text-xs space-y-0.5 text-muted-foreground">
                                  {o.items?.map((it, idx) => (
                                    <li key={idx}>
                                      <span className="font-semibold text-espresso">{it.qty}x</span>{" "}
                                      {it.name}
                                    </li>
                                  ))}
                                </ul>
                              </td>
                              <td className="py-4 px-4 font-semibold text-espresso tabular-nums">
                                ${o.total.toFixed(2)}
                              </td>
                              <td className="py-4 px-4 font-medium text-coffee inline-flex items-center gap-1.5 mt-2">
                                <Clock className="h-3.5 w-3.5 opacity-75" />
                                {o.pickupTime || "ASAP"}
                              </td>
                              <td className="py-4 px-4">
                                <select
                                  value={o.status}
                                  onChange={(e) =>
                                    handleUpdateOrderStatus(
                                      o.id!,
                                      e.target.value as DbOrder["status"],
                                    )
                                  }
                                  className="rounded-lg border px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-[color:var(--gold)]"
                                >
                                  <option value="pending">Pending</option>
                                  <option value="preparing">Preparing</option>
                                  <option value="ready">Ready</option>
                                  <option value="completed">Completed</option>
                                  <option value="cancelled">Cancelled</option>
                                </select>
                              </td>
                              <td className="py-4 px-4 text-right">
                                <button
                                  onClick={() => handleDeleteOrder(o.id!)}
                                  className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-red-50 rounded-lg transition cursor-pointer"
                                  title="Delete Record"
                                >
                                  <Trash2 className="h-4.5 w-4.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* --- 3. RESERVATIONS MANAGEMENT VIEW --- */}
              {activeTab === "reservations" && (
                <div className="bg-card rounded-[2rem] border p-6 md:p-8 shadow-soft">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                      <h3 className="heading-serif text-2xl text-espresso">Table Allocations</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Manage reservations, seat allotments, and approvals.
                      </p>
                    </div>

                    {/* Filters */}
                    <div className="flex gap-2">
                      {["all", "pending", "confirmed", "rejected"].map((filter) => (
                        <button
                          key={filter}
                          onClick={() => setResFilter(filter)}
                          className="px-3.5 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider transition cursor-pointer"
                          style={{
                            background: resFilter === filter ? "var(--espresso)" : "transparent",
                            color: resFilter === filter ? "var(--cream)" : "var(--coffee)",
                            border: `1px solid ${
                              resFilter === filter
                                ? "var(--espresso)"
                                : "color-mix(in oklab, var(--coffee) 15%, transparent)"
                            }`,
                          }}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>
                  </div>

                  {filteredReservations.length === 0 ? (
                    <div className="text-center py-16 border rounded-2xl bg-neutral-50/50">
                      <Calendar className="h-10 w-10 mx-auto opacity-30 text-muted-foreground" />
                      <p className="mt-3 text-sm text-muted-foreground font-medium">
                        No bookings match this filter.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead>
                          <tr className="border-b text-xs uppercase tracking-wider text-muted-foreground">
                            <th className="py-3 px-4 font-semibold">Guest</th>
                            <th className="py-3 px-4 font-semibold">Details</th>
                            <th className="py-3 px-4 font-semibold">Guests</th>
                            <th className="py-3 px-4 font-semibold">Occasion</th>
                            <th className="py-3 px-4 font-semibold">Notes</th>
                            <th className="py-3 px-4 font-semibold">Status</th>
                            <th className="py-3 px-4 font-semibold text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredReservations.map((r) => (
                            <tr key={r.id} className="border-b hover:bg-neutral-50/50">
                              <td className="py-4 px-4 font-medium">
                                <div className="font-semibold text-espresso">{r.name}</div>
                                <div className="text-xs text-muted-foreground">{r.email}</div>
                                {r.emailSent ? (
                                  <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                    <span>Sent ({r.emailMethod || "AI"})</span>
                                    {r.confirmationEmailBody && (
                                      <button
                                        onClick={() =>
                                          setPreviewEmail(r.confirmationEmailBody || null)
                                        }
                                        className="inline-flex items-center gap-0.5 text-[10px] text-coffee hover:text-gold hover:underline font-semibold cursor-pointer ml-1.5"
                                        title="View confirmation email"
                                      >
                                        <Eye className="h-3 w-3" /> View Email
                                      </button>
                                    )}
                                  </div>
                                ) : (
                                  <div className="mt-1 flex items-center gap-1 text-[10px] text-amber-600 font-medium">
                                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping"></span>
                                    <span>Drafting automated email...</span>
                                  </div>
                                )}
                              </td>
                              <td className="py-4 px-4">
                                <div className="font-semibold text-espresso">{r.date}</div>
                                <div className="text-xs text-muted-foreground inline-flex items-center gap-1">
                                  <Clock className="h-3 w-3" /> {r.time}
                                </div>
                              </td>
                              <td className="py-4 px-4 text-espresso font-semibold">
                                {r.guests} guests
                              </td>
                              <td className="py-4 px-4">
                                <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-neutral-100 text-coffee">
                                  {r.occasion}
                                </span>
                              </td>
                              <td
                                className="py-4 px-4 text-xs text-muted-foreground max-w-xs truncate"
                                title={r.notes}
                              >
                                {r.notes || "—"}
                              </td>
                              <td className="py-4 px-4">
                                <span
                                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] tracking-wider uppercase font-semibold ${
                                    r.status === "confirmed"
                                      ? "bg-emerald-100 text-emerald-800"
                                      : r.status === "rejected"
                                        ? "bg-red-100 text-red-800"
                                        : "bg-amber-100 text-amber-800"
                                  }`}
                                >
                                  {r.status}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-right space-x-1.5 whitespace-nowrap">
                                <button
                                  onClick={() => handleUpdateReservationStatus(r.id!, "confirmed")}
                                  className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                                  title="Approve / Confirm"
                                >
                                  <Check className="h-4.5 w-4.5" />
                                </button>
                                <button
                                  onClick={() => handleUpdateReservationStatus(r.id!, "rejected")}
                                  className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                                  title="Reject"
                                >
                                  <X className="h-4.5 w-4.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteReservation(r.id!)}
                                  className="p-1 text-muted-foreground hover:text-destructive hover:bg-red-50 rounded-lg transition cursor-pointer"
                                  title="Delete permanent"
                                >
                                  <Trash2 className="h-4.5 w-4.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* --- 4. REVIEWS MODERATION VIEW --- */}
              {activeTab === "reviews" && (
                <div className="bg-card rounded-[2rem] border p-6 md:p-8 shadow-soft">
                  <div className="mb-6">
                    <h3 className="heading-serif text-2xl text-espresso">Review Moderation</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Accept or reject guest-submitted reviews to keep the brand identity pristine.
                    </p>
                  </div>

                  {reviews.length === 0 ? (
                    <div className="text-center py-16 border rounded-2xl bg-neutral-50/50">
                      <Star className="h-10 w-10 mx-auto opacity-30 text-muted-foreground" />
                      <p className="mt-3 text-sm text-muted-foreground font-medium">
                        No reviews found.
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {reviews.map((r) => (
                        <article
                          key={r.id}
                          className="bg-card border rounded-3xl p-5 flex flex-col justify-between shadow-soft"
                          style={{
                            borderColor: r.approved
                              ? "color-mix(in oklab, var(--gold) 20%, transparent)"
                              : "color-mix(in oklab, var(--coffee) 20%, transparent)",
                          }}
                        >
                          <div>
                            <div className="flex items-center gap-3 mb-4">
                              <img
                                src={r.avatar}
                                alt={r.name}
                                className="h-10 w-10 rounded-full object-cover"
                              />
                              <div>
                                <h4 className="font-semibold text-espresso">{r.name}</h4>
                                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                                  {r.role}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-1 mb-3">
                              {Array.from({ length: r.rating }).map((_, idx) => (
                                <Star
                                  key={idx}
                                  className="h-3.5 w-3.5 fill-[color:var(--gold)] stroke-[color:var(--gold)]"
                                />
                              ))}
                            </div>
                            <p className="text-xs italic text-muted-foreground leading-relaxed">
                              "{r.text}"
                            </p>
                          </div>

                          <div className="mt-6 pt-4 border-t flex justify-between items-center">
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider ${
                                r.approved ? "text-emerald-600" : "text-amber-600"
                              }`}
                            >
                              {r.approved ? "● Published" : "○ Pending Approval"}
                            </span>

                            <div className="flex gap-2">
                              <button
                                onClick={() => handleToggleReviewApproval(r.id!, r.approved)}
                                className={`rounded-full px-3.5 py-1 text-[10px] uppercase tracking-wider font-semibold border transition cursor-pointer ${
                                  r.approved
                                    ? "bg-amber-50 text-amber-700 border-amber-300"
                                    : "bg-emerald-50 text-emerald-700 border-emerald-300"
                                }`}
                              >
                                {r.approved ? "Hide" : "Approve"}
                              </button>
                              <button
                                onClick={() => handleDeleteReview(r.id!)}
                                className="p-1 text-muted-foreground hover:text-destructive hover:bg-red-50 rounded-lg transition cursor-pointer"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* --- 5. MENU CATALOG MANAGEMENT --- */}
              {activeTab === "menu" && (
                <div className="bg-card rounded-[2rem] border p-6 md:p-8 shadow-soft">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                      <h3 className="heading-serif text-2xl text-espresso">Product Catalog</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Add, edit, or delete items on the food and coffee menus.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {/* Filter category */}
                      <select
                        value={menuFilter}
                        onChange={(e) => setMenuFilter(e.target.value)}
                        className="rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wider outline-none text-coffee"
                      >
                        {categories.map((c) => (
                          <option key={c} value={c}>
                            Category: {c}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() => openMenuModal()}
                        className="btn-gold !py-2.5 !px-5 text-xs gap-2 shrink-0"
                      >
                        <Plus className="h-4 w-4" /> Add Product
                      </button>
                    </div>
                  </div>

                  {filteredMenuItems.length === 0 ? (
                    <div className="text-center py-16 border rounded-2xl bg-neutral-50/50">
                      <Coffee className="h-10 w-10 mx-auto opacity-30 text-muted-foreground" />
                      <p className="mt-3 text-sm text-muted-foreground font-medium">
                        No products catalogued.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead>
                          <tr className="border-b text-xs uppercase tracking-wider text-muted-foreground">
                            <th className="py-3 px-4 font-semibold">Image</th>
                            <th className="py-3 px-4 font-semibold">Name</th>
                            <th className="py-3 px-4 font-semibold">Price</th>
                            <th className="py-3 px-4 font-semibold">Category</th>
                            <th className="py-3 px-4 font-semibold">Diet</th>
                            <th className="py-3 px-4 font-semibold">Availability</th>
                            <th className="py-3 px-4 font-semibold text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredMenuItems.map((item) => (
                            <tr key={item.id} className="border-b hover:bg-neutral-50/50">
                              <td className="py-3 px-4">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="h-12 w-12 rounded-lg object-cover border"
                                />
                              </td>
                              <td className="py-3 px-4">
                                <div className="font-semibold text-espresso">{item.name}</div>
                                <div className="text-xs text-muted-foreground max-w-xs truncate">
                                  {item.description}
                                </div>
                              </td>
                              <td className="py-3 px-4 font-semibold text-espresso tabular-nums">
                                ${item.price.toFixed(2)}
                              </td>
                              <td className="py-3 px-4 text-xs font-semibold text-coffee uppercase tracking-wider">
                                {item.category}
                              </td>
                              <td className="py-3 px-4">
                                <span
                                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                    item.veg
                                      ? "bg-green-50 text-green-700"
                                      : "bg-orange-50 text-orange-700"
                                  }`}
                                >
                                  {item.veg ? "Veg" : "Non-Veg"}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <span
                                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                    item.available !== false
                                      ? "bg-emerald-50 text-emerald-700"
                                      : "bg-neutral-100 text-neutral-500"
                                  }`}
                                >
                                  {item.available !== false ? "Available" : "Sold Out"}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                                <button
                                  onClick={() => openMenuModal(item)}
                                  className="p-1.5 text-muted-foreground hover:text-coffee hover:bg-neutral-100 rounded-lg transition cursor-pointer"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteMenuItem(item.id)}
                                  className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-red-50 rounded-lg transition cursor-pointer"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* --- ADD/EDIT MENU MODAL POPUP --- */}
      <AnimatePresence>
        {isMenuModalOpen && (
          <>
            <div
              onClick={() => setIsMenuModalOpen(false)}
              className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="fixed inset-x-4 top-10 sm:top-20 max-w-xl mx-auto z-[101] bg-card rounded-[2rem] border shadow-luxe overflow-hidden max-h-[85vh] flex flex-col"
            >
              <div
                className="flex items-center justify-between p-6 border-b"
                style={{ borderColor: "color-mix(in oklab, var(--coffee) 20%, transparent)" }}
              >
                <h3 className="heading-serif text-2xl" style={{ color: "var(--espresso)" }}>
                  {editingItem ? "Edit Catalogue Item" : "Catalogue New Product"}
                </h3>
                <button
                  onClick={() => setIsMenuModalOpen(false)}
                  className="p-1.5 rounded-full border hover:bg-neutral-100 transition cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSaveMenuItem} className="p-6 space-y-4 overflow-y-auto flex-1">
                <div>
                  <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">
                    Product Name *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Signature Espresso"
                    value={menuForm.name}
                    onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })}
                    className="w-full rounded-xl bg-background border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[color:var(--gold)]"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">
                      Price ($) *
                    </label>
                    <input
                      required
                      type="number"
                      step="0.01"
                      placeholder="4.50"
                      value={menuForm.price}
                      onChange={(e) => setMenuForm({ ...menuForm, price: Number(e.target.value) })}
                      className="w-full rounded-xl bg-background border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[color:var(--gold)]"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">
                      Energy / Calories (kcal)
                    </label>
                    <input
                      type="number"
                      placeholder="150"
                      value={menuForm.calories}
                      onChange={(e) =>
                        setMenuForm({ ...menuForm, calories: Number(e.target.value) })
                      }
                      className="w-full rounded-xl bg-background border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[color:var(--gold)]"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">
                      Menu Category
                    </label>
                    <select
                      value={menuForm.category}
                      onChange={(e) =>
                        setMenuForm({ ...menuForm, category: e.target.value as MenuCategory })
                      }
                      className="w-full rounded-xl bg-background border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[color:var(--gold)]"
                    >
                      {categories
                        .filter((c) => c !== "All")
                        .map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">
                      Dietary Tag
                    </label>
                    <select
                      value={menuForm.veg ? "true" : "false"}
                      onChange={(e) => setMenuForm({ ...menuForm, veg: e.target.value === "true" })}
                      className="w-full rounded-xl bg-background border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[color:var(--gold)]"
                    >
                      <option value="true">Vegetarian / Vegan</option>
                      <option value="false">Non-Vegetarian</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Provide a delicious detail about ingredients, origins, and mouthfeel..."
                    value={menuForm.description}
                    onChange={(e) => setMenuForm({ ...menuForm, description: e.target.value })}
                    className="w-full rounded-xl bg-background border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[color:var(--gold)] resize-none"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">
                    Image URL (Unsplash or local)
                  </label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    value={menuForm.image}
                    onChange={(e) => setMenuForm({ ...menuForm, image: e.target.value })}
                    className="w-full rounded-xl bg-background border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[color:var(--gold)]"
                  />
                </div>

                <div className="flex gap-6 items-center pt-2">
                  <label className="flex items-center gap-2 text-xs uppercase tracking-wider text-coffee font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={menuForm.popular}
                      onChange={(e) => setMenuForm({ ...menuForm, popular: e.target.checked })}
                      className="h-4.5 w-4.5 rounded border-neutral-300 accent-[color:var(--gold)] cursor-pointer"
                    />
                    Mark as Popular
                  </label>

                  <label className="flex items-center gap-2 text-xs uppercase tracking-wider text-coffee font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={menuForm.available}
                      onChange={(e) => setMenuForm({ ...menuForm, available: e.target.checked })}
                      className="h-4.5 w-4.5 rounded border-neutral-300 accent-[color:var(--gold)] cursor-pointer"
                    />
                    Item in Stock / Available
                  </label>
                </div>

                <div className="pt-4 flex gap-3 border-t">
                  <button
                    type="button"
                    onClick={() => setIsMenuModalOpen(false)}
                    className="flex-1 rounded-full py-3 text-xs uppercase tracking-wider font-semibold border text-center transition hover:bg-neutral-100 cursor-pointer"
                  >
                    Discard Changes
                  </button>
                  <button type="submit" className="flex-1 btn-gold cursor-pointer">
                    Save Catalogue Item
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {previewEmail && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewEmail(null)}
              className="fixed inset-0 bg-black/80 z-50 cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-4 md:inset-x-auto md:top-10 md:bottom-10 md:w-[680px] bg-neutral-900 border border-[color:var(--gold)]/30 rounded-[2rem] shadow-luxe z-50 flex flex-col overflow-hidden md:left-1/2 md:-translate-x-1/2"
            >
              <div className="flex justify-between items-center px-6 py-4 bg-neutral-950 border-b border-neutral-800 shrink-0">
                <div>
                  <h3 className="heading-serif text-lg text-[color:var(--gold)]">
                    Automated Email Confirmation
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Live HTML preview of email dispatched to customer
                  </p>
                </div>
                <button
                  onClick={() => setPreviewEmail(null)}
                  className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 bg-neutral-950/40">
                <div
                  className="w-full bg-white text-black rounded-2xl overflow-hidden shadow-inner p-4 md:p-6 text-left"
                  dangerouslySetInnerHTML={{ __html: previewEmail }}
                />
              </div>
              <div className="px-6 py-4 bg-neutral-950 border-t border-neutral-800 flex justify-end shrink-0">
                <button
                  onClick={() => setPreviewEmail(null)}
                  className="px-5 py-2.5 rounded-full bg-neutral-800 text-xs text-neutral-200 hover:bg-neutral-700 font-semibold transition cursor-pointer"
                >
                  Dismiss Preview
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
