"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  UtensilsCrossed, ArrowRight, Check, Sparkles, ChefHat, Coffee, Pizza, Sandwich,
  LayoutDashboard, ShoppingCart, Menu as MenuIcon, Grid3x3, Tag, Users, BarChart3,
  QrCode, Settings, TrendingUp, DollarSign, Clock, Plus, Minus, X, Star, Flame,
  Shield, Zap, Smartphone, Bell, ChevronDown, MapPin, Phone, Mail, MessageCircle,
} from "lucide-react";

const fadeInUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } };

const industries = [
  { icon: ChefHat, name: "Fine Dining" }, { icon: Coffee, name: "Cafes" },
  { icon: Pizza, name: "Pizzerias" }, { icon: Sandwich, name: "Fast Food" },
];

const sidebarItems = [
  { icon: LayoutDashboard, name: "Overview", active: true },
  { icon: ShoppingCart, name: "Orders" }, { icon: MenuIcon, name: "Menu" },
  { icon: Grid3x3, name: "Categories" }, { icon: Tag, name: "Offers" },
  { icon: Users, name: "Customers" }, { icon: BarChart3, name: "Analytics" },
  { icon: QrCode, name: "QR Menu" }, { icon: Settings, name: "Settings" },
];

const stats = [
  { label: "Today's Orders", value: "48", change: "+18.4%", icon: ShoppingCart, color: "text-red-400" },
  { label: "Revenue", value: "$1,240", change: "+24.8%", icon: DollarSign, color: "text-amber-400" },
  { label: "Customers", value: "342", change: "+12.6%", icon: Users, color: "text-emerald-400" },
  { label: "Pending", value: "12", change: "+5.2%", icon: Clock, color: "text-cyan-400" },
];

const chartData = [40, 65, 45, 80, 55, 90, 70];
const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const recentOrders = [
  { id: "#1042", customer: "Ahmad Ali", items: "2× Burger, 1× Fries", total: "$19", status: "Pending" },
  { id: "#1041", customer: "Sarah Smith", items: "1× Pizza, 2× Pepsi", total: "$14", status: "Preparing" },
  { id: "#1040", customer: "Omar Khaled", items: "3× Chicken, 1× Salad", total: "$24", status: "Completed" },
  { id: "#1039", customer: "Layla Ahmad", items: "1× Pasta, 1× Juice", total: "$12", status: "Completed" },
];

const categories = ["All", "Burgers", "Pizza", "Chicken", "Drinks", "Desserts"];

const products = [
  { id: 1, name: "Classic Burger", desc: "Beef, cheese, lettuce, tomato", price: 8, discount: 5, image: "🍔", category: "Burgers", rating: 4.8, featured: true },
  { id: 2, name: "Cheese Pizza", desc: "Mozzarella, tomato sauce, basil", price: 12, discount: 0, image: "🍕", category: "Pizza", rating: 4.9, featured: true },
  { id: 3, name: "Fried Chicken", desc: "Crispy, spicy, with sauce", price: 10, discount: 7, image: "🍗", category: "Chicken", rating: 4.7, featured: false },
  { id: 4, name: "Coca Cola", desc: "Ice cold, 330ml", price: 3, discount: 0, image: "🥤", category: "Drinks", rating: 4.5, featured: false },
  { id: 5, name: "Chocolate Cake", desc: "Rich, moist, with fudge", price: 6, discount: 4, image: "🍰", category: "Desserts", rating: 4.9, featured: true },
  { id: 6, name: "Double Burger", desc: "Two beef patties, double cheese", price: 14, discount: 0, image: "🍔", category: "Burgers", rating: 4.9, featured: true },
];

const features = [
  { icon: ShoppingCart, title: "Smart Ordering", desc: "Give your customers a fast and beautiful ordering experience available 24/7." },
  { icon: Zap, title: "Real-time Orders", desc: "Receive orders instantly. No refresh needed. Live updates on your dashboard." },
  { icon: QrCode, title: "QR Menu", desc: "Generate a QR code that opens your restaurant's menu instantly." },
  { icon: Bell, title: "WhatsApp Ready", desc: "Connect your customers directly with your business through WhatsApp." },
  { icon: BarChart3, title: "Powerful Analytics", desc: "Understand your revenue, orders, customers and business performance." },
  { icon: Shield, title: "Built for Speed", desc: "A fast, responsive and modern experience across desktop and mobile." },
];

const steps = [
  { num: "01", title: "Set up your menu", desc: "Add your products, categories, prices and images in minutes." },
  { num: "02", title: "Share your QR", desc: "Print your QR code and place it on tables. Customers scan and order." },
  { num: "03", title: "Receive orders", desc: "Get orders in real-time on your dashboard. Accept, prepare, deliver." },
  { num: "04", title: "Grow your business", desc: "Track revenue, customers and insights to grow smarter." },
];

const pricing = [
  { name: "Starter", price: "Free", period: "forever", features: ["1 Restaurant", "50 Orders/month", "Basic Analytics", "QR Menu"], cta: "Get Started", highlight: false },
  { name: "Professional", price: "$29", period: "/month", features: ["Unlimited Orders", "Advanced Analytics", "Custom Branding", "WhatsApp Integration", "Delivery Zones", "Priority Support"], cta: "Start Free Trial", highlight: true },
  { name: "Business", price: "$79", period: "/month", features: ["Everything in Pro", "Multiple Locations", "API Access", "White Label", "Dedicated Manager"], cta: "Contact Sales", highlight: false },
];

const testimonials = [
  { name: "Snack", role: "Fast Food Restaurant", text: "MenuFlow transformed our ordering process. Customers scan and order in seconds. Game changer!", rating: 5 },
  { name: "Pizza Roma", role: "Pizzeria", text: "The real-time orders feature is flawless. Our staff loves it. Revenue is up 40%.", rating: 5 },
  { name: "Green Cafe", role: "Coffee Shop", text: "Setup took 15 minutes. Best investment for our cafe this year.", rating: 5 },
];

const faqs = [
  { q: "Can customers order from their phone?", a: "Yes. MenuFlow is designed to provide a fast, responsive, and beautiful ordering experience on any device." },
  { q: "Can I manage multiple restaurants?", a: "Yes. MenuFlow supports multiple locations with individual menus, staff, and analytics." },
  { q: "Can I customize my menu branding?", a: "Absolutely. Add your logo, brand colors, and personalize the entire ordering experience." },
  { q: "Does MenuFlow support WhatsApp?", a: "Yes. Connect your customers directly with your business through WhatsApp notifications." },
  { q: "How does the QR menu work?", a: "Customers scan your unique QR code and instantly access your digital menu. No app download required." },
];

type CartItem = { id: number; name: string; price: number; quantity: number; image: string };

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [cart, setCart] = useState<CartItem[]>([
    { id: 1, name: "Classic Burger", price: 5, quantity: 2, image: "🍔" },
    { id: 4, name: "Coca Cola", price: 3, quantity: 2, image: "🥤" },
  ]);

  const filteredProducts = activeCategory === "All" ? products : products.filter((p) => p.category === activeCategory);

  const addToCart = (product: typeof products[0]) => {
    const price = product.discount > 0 ? product.discount : product.price;
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) return prev.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { id: product.id, name: product.name, price, quantity: 1, image: product.image }];
    });
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart((prev) => prev.map((item) => item.id === id ? { ...item, quantity: item.quantity + delta } : item).filter((item) => item.quantity > 0));
  };

  const removeFromCart = (id: number) => setCart((prev) => prev.filter((item) => item.id !== id));

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = 2;
  const total = subtotal + deliveryFee;
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white overflow-x-hidden">

      {/* ===== NAVBAR ===== */}
      <motion.nav initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-amber-500 rounded-xl flex items-center justify-center">
              <UtensilsCrossed size={20} className="text-white" />
            </div>
            <div>
              <span className="text-xl font-bold">MenuFlow</span>
              <p className="text-[10px] text-amber-400 tracking-widest uppercase">Smart Ordering</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm">
            <a href="#features" className="text-gray-400 hover:text-white transition">Features</a>
            <a href="#how" className="text-gray-400 hover:text-white transition">How it works</a>
            <a href="#pricing" className="text-gray-400 hover:text-white transition">Pricing</a>
            <a href="#faq" className="text-gray-400 hover:text-white transition">FAQ</a>
            <a href="#contact" className="text-gray-400 hover:text-white transition">Contact</a>
          </div>
          <div className="flex items-center gap-3">
            <a href="#" className="hidden md:block text-sm text-gray-400 hover:text-white transition">Login</a>
            <a href="/dashboard" className="bg-gradient-to-r from-red-600 to-amber-500 px-5 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition">
              Get Started
            </a>
          </div>
        </div>
      </motion.nav>

      {/* ===== HERO ===== */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 -left-40 w-96 h-96 bg-red-600/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 -right-40 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl"></div>
        </div>
        <motion.div variants={stagger} initial="hidden" animate="visible" className="max-w-5xl mx-auto text-center">
          <motion.div variants={fadeInUp} className="mb-6">
            <span className="inline-flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-md px-4 py-2 rounded-full text-sm text-gray-300">
              <Sparkles size={14} className="text-amber-400" /> The smarter way to order
            </span>
          </motion.div>
          <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Your Menu. Your Orders.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-400">One Simple Platform.</span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            The modern online ordering system for restaurants, cafes, and food businesses. Accept orders 24/7, manage your menu, and grow your revenue.
          </motion.p>
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} href="/dashboard"
              className="bg-gradient-to-r from-red-600 to-amber-500 px-8 py-4 rounded-full font-semibold inline-flex items-center justify-center gap-2 hover:opacity-90 transition shadow-lg shadow-red-600/30">
              Get Started <ArrowRight size={20} />
            </motion.a>
            <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} href="#demo"
              className="bg-white/5 border border-white/10 backdrop-blur-md px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition">
              View Demo
            </motion.a>
          </motion.div>
          <motion.div variants={fadeInUp} className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 mb-12">
            <div className="flex items-center gap-2"><Check size={16} className="text-amber-400" /><span>Real-time orders</span></div>
            <div className="flex items-center gap-2"><Check size={16} className="text-amber-400" /><span>QR Menu</span></div>
            <div className="flex items-center gap-2"><Check size={16} className="text-amber-400" /><span>WhatsApp ready</span></div>
          </motion.div>
          <motion.div variants={fadeInUp} className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
            {industries.map((ind) => (<div key={ind.name} className="flex items-center gap-2"><ind.icon size={16} /><span>{ind.name}</span></div>))}
          </motion.div>
        </motion.div>
      </section>

      {/* ===== DASHBOARD PREVIEW ===== */}
      <section className="px-6 py-20 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
          className="relative rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-4 backdrop-blur-md">
          <div className="rounded-2xl bg-[#0F0F0F] border border-white/10 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-[#0A0A0A]">
              <div className="w-3 h-3 rounded-full bg-red-500/60"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/60"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/60"></div>
              <div className="ml-4 px-3 py-1 rounded-md bg-white/5 text-xs text-gray-400">app.menuflow.com/dashboard</div>
            </div>
            <div className="flex">
              <div className="hidden md:block w-56 border-r border-white/10 bg-[#0A0A0A] p-4">
                <div className="flex items-center gap-2 mb-6 px-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-amber-500 rounded-lg flex items-center justify-center"><UtensilsCrossed size={16} /></div>
                  <span className="font-bold text-sm">MenuFlow</span>
                </div>
                <nav className="space-y-1">
                  {sidebarItems.map((item) => (
                    <div key={item.name} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${item.active ? "bg-gradient-to-r from-red-600/20 to-amber-500/10 text-amber-400 border border-red-600/30" : "text-gray-400 hover:bg-white/5"}`}>
                      <item.icon size={16} /><span>{item.name}</span>
                    </div>
                  ))}
                </nav>
              </div>
              <div className="flex-1 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div><h3 className="text-2xl font-bold">Good morning 👋</h3><p className="text-sm text-gray-400">Here's your restaurant today</p></div>
                  <div className="hidden md:block px-3 py-1 rounded-lg bg-white/5 text-xs text-gray-400">Tuesday, October 1</div>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {stats.map((stat, i) => (
                    <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                      className="bg-white/5 rounded-2xl p-4 border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <stat.icon size={18} className={stat.color} />
                        <span className="text-xs text-emerald-400 font-semibold">{stat.change}</span>
                      </div>
                      <p className="text-xs text-gray-400 mb-1">{stat.label}</p>
                      <p className="text-xl font-bold">{stat.value}</p>
                    </motion.div>
                  ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
                    className="lg:col-span-2 bg-white/5 rounded-2xl p-5 border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <div><p className="text-sm font-semibold">Weekly Revenue</p><p className="text-xs text-gray-400">Last 7 days</p></div>
                      <TrendingUp size={16} className="text-emerald-400" />
                    </div>
                    <div className="flex items-end gap-2 h-32">
                      {chartData.map((h, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <div className="w-full bg-gradient-to-t from-red-600 to-amber-500 rounded-t-md" style={{ height: `${h}%` }}></div>
                          <span className="text-[10px] text-gray-500">{weekdays[i]}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 }}
                    className="bg-white/5 rounded-2xl p-5 border border-white/10 flex flex-col items-center justify-center">
                    <div className="relative w-28 h-28">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" stroke="#1a1a1a" strokeWidth="12" fill="none" />
                        <circle cx="50" cy="50" r="40" stroke="#DC2626" strokeWidth="12" fill="none" strokeDasharray="100 251" strokeLinecap="round" />
                        <circle cx="50" cy="50" r="40" stroke="#F59E0B" strokeWidth="12" fill="none" strokeDasharray="60 251" strokeDashoffset="-100" strokeLinecap="round" />
                      </svg>
                    </div>
                    <p className="mt-3 text-xs text-gray-400">Order Status</p>
                    <div className="flex gap-3 mt-2 text-[10px]">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-600"></span>Completed</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span>Pending</span>
                    </div>
                  </motion.div>
                </div>
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.6 }}
                  className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                  <div className="p-4 border-b border-white/10 flex items-center justify-between">
                    <p className="font-semibold text-sm">Recent Orders</p>
                    <span className="text-xs text-amber-400">View All</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-xs text-gray-500 border-b border-white/10">
                          <th className="px-4 py-3 font-medium">Order</th>
                          <th className="px-4 py-3 font-medium">Customer</th>
                          <th className="px-4 py-3 font-medium hidden md:table-cell">Items</th>
                          <th className="px-4 py-3 font-medium">Total</th>
                          <th className="px-4 py-3 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentOrders.map((order) => (
                          <tr key={order.id} className="border-b border-white/5 last:border-0">
                            <td className="px-4 py-3 text-amber-400 font-medium">{order.id}</td>
                            <td className="px-4 py-3">{order.customer}</td>
                            <td className="px-4 py-3 text-gray-400 hidden md:table-cell text-xs">{order.items}</td>
                            <td className="px-4 py-3 font-semibold">{order.total}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded-full text-[10px] font-semibold ${order.status === "Completed" ? "bg-emerald-500/20 text-emerald-400" : order.status === "Pending" ? "bg-amber-500/20 text-amber-400" : "bg-cyan-500/20 text-cyan-400"}`}>
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ===== MENU + CART DEMO ===== */}
      <section id="demo" className="px-6 py-20 max-w-7xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-12">
          <motion.span variants={fadeInUp} className="text-amber-400 text-sm font-semibold tracking-widest uppercase">Live Demo</motion.span>
          <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold mt-3 mb-4">Ordering made effortless.</motion.h2>
          <motion.p variants={fadeInUp} className="text-gray-400 max-w-2xl mx-auto">From menu browsing to checkout, give your customers an experience they actually enjoy.</motion.p>
        </motion.div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="lg:col-span-2 rounded-3xl border border-white/10 bg-[#0F0F0F] overflow-hidden">
            <div className="p-5 border-b border-white/10 bg-gradient-to-r from-red-600/10 to-amber-500/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-amber-500 rounded-xl flex items-center justify-center"><ChefHat size={20} /></div>
                <div><p className="font-bold">Snack</p><p className="text-xs text-gray-400">Ain Baal, Lebanon</p></div>
              </div>
            </div>
            <div className="p-4 border-b border-white/10">
              <div className="flex gap-2 overflow-x-auto pb-1">
                {categories.map((cat) => (
                  <button key={cat} onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition ${activeCategory === cat ? "bg-gradient-to-r from-red-600 to-amber-500 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"}`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product, i) => {
                  const price = product.discount > 0 ? product.discount : product.price;
                  const discountPercent = product.discount > 0 ? Math.round(((product.price - product.discount) / product.price) * 100) : 0;
                  return (
                    <motion.div key={product.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: i * 0.05 }}
                      className="bg-white/5 border border-white/10 rounded-2xl p-3 hover:border-amber-500/40 transition relative">
                      {discountPercent > 0 && (<span className="absolute top-2 left-2 z-10 bg-gradient-to-r from-red-600 to-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{discountPercent}% OFF</span>)}
                      {product.featured && (<span className="absolute top-2 right-2 z-10 bg-amber-500/20 backdrop-blur-md text-amber-400 p-1 rounded-full"><Flame size={12} /></span>)}
                      <div className="text-5xl text-center py-4 bg-gradient-to-br from-red-600/10 to-amber-500/10 rounded-xl mb-3">{product.image}</div>
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-bold text-sm">{product.name}</h4>
                        <div className="flex items-center gap-1 text-[10px] text-amber-400 shrink-0"><Star size={10} fill="currentColor" />{product.rating}</div>
                      </div>
                      <p className="text-xs text-gray-400 mb-3 line-clamp-2">{product.desc}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-baseline gap-2">
                          {product.discount > 0 && (<span className="text-xs text-gray-500 line-through">${product.price}</span>)}
                          <span className="text-lg font-bold text-amber-400">${price}</span>
                        </div>
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => addToCart(product)}
                          className="w-8 h-8 bg-gradient-to-br from-red-600 to-amber-500 rounded-full flex items-center justify-center hover:opacity-90 transition"><Plus size={16} /></motion.button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-3xl border border-white/10 bg-[#0F0F0F] overflow-hidden h-fit lg:sticky lg:top-24">
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2"><ShoppingCart size={18} className="text-amber-400" /><span className="font-bold">Your Cart</span></div>
              <span className="bg-gradient-to-r from-red-600 to-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{cartCount}</span>
            </div>
            <div className="p-4 max-h-80 overflow-y-auto">
              {cart.length === 0 ? (
                <div className="text-center py-8"><ShoppingCart size={32} className="text-gray-600 mx-auto mb-3" /><p className="text-sm text-gray-500">Your cart is empty</p></div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence>
                    {cart.map((item) => (
                      <motion.div key={item.id} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                        className="flex items-center gap-3 bg-white/5 rounded-xl p-3 border border-white/10">
                        <div className="text-2xl">{item.image}</div>
                        <div className="flex-1 min-w-0"><p className="text-sm font-semibold truncate">{item.name}</p><p className="text-xs text-amber-400">${item.price}</p></div>
                        <div className="flex items-center gap-1">
                          <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 bg-white/5 rounded-md flex items-center justify-center hover:bg-white/10 transition"><Minus size={12} /></button>
                          <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 bg-white/5 rounded-md flex items-center justify-center hover:bg-white/10 transition"><Plus size={12} /></button>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-gray-500 hover:text-red-400 transition"><X size={14} /></button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
            {cart.length > 0 && (
              <div className="p-5 border-t border-white/10 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-gray-400">Subtotal</span><span className="font-semibold">${subtotal}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-400">Delivery</span><span className="font-semibold">${deliveryFee}</span></div>
                <div className="flex justify-between text-base pt-2 border-t border-white/10"><span className="font-bold">Total</span><span className="font-bold text-amber-400">${total}</span></div>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="w-full mt-3 bg-gradient-to-r from-red-600 to-amber-500 py-3 rounded-full font-bold text-sm hover:opacity-90 transition shadow-lg shadow-red-600/30">
                  Checkout
                </motion.button>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" className="px-6 py-24 max-w-7xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-16">
          <motion.span variants={fadeInUp} className="text-red-400 text-sm font-semibold tracking-widest uppercase">Features</motion.span>
          <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold mt-3 mb-4">Everything your business needs.</motion.h2>
          <motion.p variants={fadeInUp} className="text-gray-400 max-w-2xl mx-auto">Powerful features built for modern restaurants.</motion.p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -5 }}
              className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 hover:border-amber-500/50 transition-colors">
              <div className="w-12 h-12 bg-gradient-to-br from-red-600/20 to-amber-500/20 rounded-xl flex items-center justify-center mb-4">
                <f.icon className="text-amber-400" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how" className="px-6 py-24 max-w-7xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-16">
          <motion.span variants={fadeInUp} className="text-amber-400 text-sm font-semibold tracking-widest uppercase">How it Works</motion.span>
          <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold mt-3">Live in 4 simple steps</motion.h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <motion.div key={s.num} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
              <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-red-500/60 to-transparent mb-4">{s.num}</div>
              <h3 className="text-xl font-bold mb-2">{s.title}</h3>
              <p className="text-gray-400 text-sm">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section id="pricing" className="px-6 py-24 max-w-7xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-16">
          <motion.span variants={fadeInUp} className="text-red-400 text-sm font-semibold tracking-widest uppercase">Pricing</motion.span>
          <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold mt-3">Simple, transparent pricing</motion.h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pricing.map((p, i) => (
            <motion.div key={p.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className={`relative rounded-3xl p-8 border ${p.highlight ? "bg-gradient-to-b from-red-600/10 to-amber-500/5 border-red-500/50" : "bg-white/5 border-white/10"}`}>
              {p.highlight && (<div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-red-600 to-amber-500 px-4 py-1 rounded-full text-xs font-bold">Most Popular</div>)}
              <h3 className="text-2xl font-bold mb-2">{p.name}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold">{p.price}</span>
                <span className="text-gray-400 text-sm">{p.period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {p.features.map((f) => (<li key={f} className="flex items-center gap-2 text-sm text-gray-300"><Check size={16} className="text-amber-400 shrink-0" />{f}</li>))}
              </ul>
              <a href="/dashboard" className={`block text-center w-full py-3 rounded-full font-semibold transition ${p.highlight ? "bg-gradient-to-r from-red-600 to-amber-500 hover:opacity-90" : "bg-white/10 hover:bg-white/20"}`}>{p.cta}</a>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="px-6 py-24 max-w-7xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-16">
          <motion.span variants={fadeInUp} className="text-amber-400 text-sm font-semibold tracking-widest uppercase">Testimonials</motion.span>
          <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold mt-3">Loved by restaurants</motion.h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div key={t.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6">
              <div className="flex gap-1 mb-4">{Array.from({ length: t.rating }).map((_, j) => (<Star key={j} size={16} className="text-amber-400" fill="currentColor" />))}</div>
              <p className="text-gray-300 mb-6 italic">"{t.text}"</p>
              <div><p className="font-bold">{t.name}</p><p className="text-sm text-gray-500">{t.role}</p></div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section id="faq" className="px-6 py-24 max-w-3xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-16">
          <motion.span variants={fadeInUp} className="text-red-400 text-sm font-semibold tracking-widest uppercase">FAQ</motion.span>
          <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold mt-3">Common questions</motion.h2>
        </motion.div>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full px-6 py-5 flex items-center justify-between text-right hover:bg-white/5 transition">
                <span className="font-semibold">{f.q}</span>
                <ChevronDown size={20} className={`text-gray-400 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
              </button>
              {openFaq === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="px-6 pb-5 text-gray-400 text-sm">{f.a}</motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <section id="contact" className="px-6 py-24 max-w-7xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-16">
          <motion.span variants={fadeInUp} className="text-red-400 text-sm font-semibold tracking-widest uppercase">Contact Us</motion.span>
          <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold mt-3 mb-4">Get in touch</motion.h2>
          <motion.p variants={fadeInUp} className="text-gray-400 max-w-2xl mx-auto">Have a question or want a demo? We'd love to hear from you.</motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.a variants={fadeInUp} href="tel:+96170053406" whileHover={{ y: -5 }}
            className="bg-[#0F0F0F] rounded-2xl border border-white/10 p-6 text-center hover:border-amber-500/40 transition">
            <div className="w-14 h-14 bg-gradient-to-br from-red-600/20 to-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Phone size={24} className="text-amber-400" />
            </div>
            <h3 className="font-bold mb-2">Call Us</h3>
            <p className="text-sm text-amber-400 font-semibold">+961 70 053 406</p>
            <p className="text-xs text-gray-500 mt-1">Available 9 AM - 9 PM</p>
          </motion.a>

          <motion.a variants={fadeInUp} href="mailto:mahdi.dev.dev@gmail.com" whileHover={{ y: -5 }}
            className="bg-[#0F0F0F] rounded-2xl border border-white/10 p-6 text-center hover:border-amber-500/40 transition">
            <div className="w-14 h-14 bg-gradient-to-br from-red-600/20 to-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Mail size={24} className="text-amber-400" />
            </div>
            <h3 className="font-bold mb-2">Email Us</h3>
            <p className="text-sm text-amber-400 font-semibold break-all">mahdi.dev.dev@gmail.com</p>
            <p className="text-xs text-gray-500 mt-1">We reply within 24h</p>
          </motion.a>

          <motion.a variants={fadeInUp} href="https://wa.me/96170053406?text=مرحبا، بدي أعرف أكثر عن MenuFlow"
            target="_blank" rel="noopener noreferrer" whileHover={{ y: -5 }}
            className="bg-[#0F0F0F] rounded-2xl border border-white/10 p-6 text-center hover:border-emerald-500/40 transition">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MessageCircle size={24} className="text-emerald-400" />
            </div>
            <h3 className="font-bold mb-2">WhatsApp</h3>
            <p className="text-sm text-emerald-400 font-semibold">Chat with us</p>
            <p className="text-xs text-gray-500 mt-1">Fastest response</p>
          </motion.a>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="px-6 py-24 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden border border-red-500/30 bg-gradient-to-br from-red-600/20 via-transparent to-amber-500/20 p-12 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Ready to grow your restaurant?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">Join restaurants using MenuFlow to manage orders smarter.</p>
          <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} href="/dashboard"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-amber-500 px-8 py-4 rounded-full font-semibold hover:opacity-90 transition shadow-lg shadow-red-600/30">
            Start Free Trial <ArrowRight size={20} />
          </motion.a>
        </motion.div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-white/10 px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-amber-500 rounded-lg flex items-center justify-center">
                  <UtensilsCrossed size={16} />
                </div>
                <span className="font-bold">MenuFlow</span>
              </div>
              <p className="text-sm text-gray-500 mb-4">Smart ordering for modern restaurants.</p>
              <div className="space-y-2 text-sm">
                <a href="tel:+96170053406" className="flex items-center gap-2 text-gray-500 hover:text-amber-400 transition">
                  <Phone size={14} />
                  +961 70 053 406
                </a>
                <a href="mailto:mahdi.dev.dev@gmail.com" className="flex items-center gap-2 text-gray-500 hover:text-amber-400 transition">
                  <Mail size={14} />
                  mahdi.dev.dev@gmail.com
                </a>
                <div className="flex items-center gap-2 text-gray-500">
                  <MapPin size={14} />
                  Beirut, Lebanon
                </div>
              </div>
            </div>
            {[
              { title: "Product", links: ["Features", "Pricing", "Demo", "API"] },
              { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
              { title: "Legal", links: ["Privacy", "Terms", "Security", "Cookies"] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-semibold mb-3">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((l) => (
                    <li key={l}>
                      <a href="#" className="text-sm text-gray-500 hover:text-white transition">{l}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-8 border-t border-white/10 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} MenuFlow. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}