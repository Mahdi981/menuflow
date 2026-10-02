"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Clock,
  Star,
  Flame,
  ArrowUpRight,
  Calendar,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  RadialBarChart,
  RadialBar,
} from "recharts";

const periodOptions = ["7 Days", "30 Days", "90 Days"];

const metrics = {
  "7 Days": [
    { label: "Total Revenue", value: "$8,420", change: "+24.8%", isUp: true, icon: DollarSign, color: "emerald" },
    { label: "Total Orders", value: "248", change: "+18.4%", isUp: true, icon: ShoppingCart, color: "amber" },
    { label: "New Customers", value: "42", change: "+12.6%", isUp: true, icon: Users, color: "cyan" },
    { label: "Avg Order Value", value: "$33.95", change: "-2.1%", isUp: false, icon: TrendingUp, color: "red" },
  ],
  "30 Days": [
    { label: "Total Revenue", value: "$34,280", change: "+32.4%", isUp: true, icon: DollarSign, color: "emerald" },
    { label: "Total Orders", value: "1,024", change: "+22.8%", isUp: true, icon: ShoppingCart, color: "amber" },
    { label: "New Customers", value: "186", change: "+18.2%", isUp: true, icon: Users, color: "cyan" },
    { label: "Avg Order Value", value: "$33.47", change: "+4.2%", isUp: true, icon: TrendingUp, color: "red" },
  ],
  "90 Days": [
    { label: "Total Revenue", value: "$98,640", change: "+45.2%", isUp: true, icon: DollarSign, color: "emerald" },
    { label: "Total Orders", value: "3,186", change: "+38.4%", isUp: true, icon: ShoppingCart, color: "amber" },
    { label: "New Customers", value: "524", change: "+28.6%", isUp: true, icon: Users, color: "cyan" },
    { label: "Avg Order Value", value: "$30.96", change: "-1.4%", isUp: false, icon: TrendingUp, color: "red" },
  ],
};

const revenueTrend = [
  { day: "Mon", revenue: 420, orders: 18, customers: 14 },
  { day: "Tue", revenue: 680, orders: 24, customers: 20 },
  { day: "Wed", revenue: 520, orders: 20, customers: 16 },
  { day: "Thu", revenue: 840, orders: 32, customers: 26 },
  { day: "Fri", revenue: 1120, orders: 45, customers: 38 },
  { day: "Sat", revenue: 1240, orders: 48, customers: 42 },
  { day: "Sun", revenue: 980, orders: 38, customers: 30 },
];

const ordersByHour = [
  { hour: "8AM", orders: 2 },
  { hour: "10AM", orders: 5 },
  { hour: "12PM", orders: 18 },
  { hour: "2PM", orders: 22 },
  { hour: "4PM", orders: 12 },
  { hour: "6PM", orders: 28 },
  { hour: "8PM", orders: 42 },
  { hour: "10PM", orders: 24 },
];

const topProducts = [
  { name: "Classic Burger", sales: 142, revenue: 710, growth: "+18%", image: "🍔" },
  { name: "Cheese Pizza", sales: 98, revenue: 1176, growth: "+12%", image: "🍕" },
  { name: "Fried Chicken", sales: 87, revenue: 609, growth: "+24%", image: "🍗" },
  { name: "Coca Cola", sales: 156, revenue: 468, growth: "+8%", image: "🥤" },
  { name: "Chocolate Cake", sales: 64, revenue: 256, growth: "+32%", image: "🍰" },
];

const categoryData = [
  { name: "Burgers", value: 38, color: "#DC2626" },
  { name: "Pizza", value: 24, color: "#F59E0B" },
  { name: "Chicken", value: 18, color: "#06B6D4" },
  { name: "Drinks", value: 12, color: "#10B981" },
  { name: "Desserts", value: 8, color: "#8B5CF6" },
];

const customerRetention = [
  { name: "Returning", value: 68, fill: "#DC2626" },
  { name: "New", value: 32, fill: "#F59E0B" },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const colorMap: Record<string, { bg: string; text: string }> = {
  emerald: { bg: "bg-emerald-500/20", text: "text-emerald-400" },
  amber: { bg: "bg-amber-500/20", text: "text-amber-400" },
  cyan: { bg: "bg-cyan-500/20", text: "text-cyan-400" },
  red: { bg: "bg-red-500/20", text: "text-red-400" },
};

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<"7 Days" | "30 Days" | "90 Days">("7 Days");
  const currentMetrics = metrics[period];

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-6">
      {/* Header */}
      <motion.div variants={fadeInUp} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Analytics</h1>
          <p className="text-sm text-gray-400">Deep insights into your restaurant performance</p>
        </div>
        <div className="flex items-center gap-2 bg-[#0F0F0F] rounded-xl p-1 border border-white/10">
          {periodOptions.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p as typeof period)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
                period === p
                  ? "bg-gradient-to-r from-red-600 to-amber-500 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {currentMetrics.map((metric, i) => {
          const colors = colorMap[metric.color];
          return (
            <motion.div
              key={metric.label}
              variants={fadeInUp}
              whileHover={{ y: -4 }}
              className="bg-[#0F0F0F] rounded-2xl p-5 border border-white/10 hover:border-amber-500/30 transition"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors.bg}`}>
                  <metric.icon size={20} className={colors.text} />
                </div>
                <span className={`text-xs font-semibold flex items-center gap-1 ${metric.isUp ? "text-emerald-400" : "text-red-400"}`}>
                  {metric.isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {metric.change}
                </span>
              </div>
              <p className="text-xs text-gray-400 mb-1">{metric.label}</p>
              <p className="text-2xl font-bold">{metric.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Revenue + Orders Trend */}
      <motion.div variants={fadeInUp} className="bg-[#0F0F0F] rounded-2xl p-5 border border-white/10">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-bold">Revenue & Orders Trend</h2>
            <p className="text-xs text-gray-400">Performance over time</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-600"></span>
              <span className="text-gray-400">Revenue</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              <span className="text-gray-400">Orders</span>
            </div>
          </div>
        </div>
        <div className="w-full overflow-hidden">
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={revenueTrend}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#DC2626" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#DC2626" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
              <XAxis dataKey="day" stroke="#666" fontSize={12} />
              <YAxis stroke="#666" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0F0F0F",
                  border: "1px solid #333",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#DC2626" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              <Area type="monotone" dataKey="orders" stroke="#F59E0B" strokeWidth={2} fillOpacity={1} fill="url(#colorOrders)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Orders by Hour + Category */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div variants={fadeInUp} className="lg:col-span-2 bg-[#0F0F0F] rounded-2xl p-5 border border-white/10">
          <div className="mb-5">
            <h2 className="font-bold">Orders by Hour</h2>
            <p className="text-xs text-gray-400">Busiest times of the day</p>
          </div>
          <div className="w-full overflow-hidden">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={ordersByHour}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
                <XAxis dataKey="hour" stroke="#666" fontSize={11} />
                <YAxis stroke="#666" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0F0F0F",
                    border: "1px solid #333",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="orders" fill="#F59E0B" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div variants={fadeInUp} className="bg-[#0F0F0F] rounded-2xl p-5 border border-white/10">
          <div className="mb-5">
            <h2 className="font-bold">Sales by Category</h2>
            <p className="text-xs text-gray-400">Category distribution</p>
          </div>
          <div className="w-full overflow-hidden">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0F0F0F",
                    border: "1px solid #333",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {categoryData.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }}></span>
                  <span className="text-gray-400">{cat.name}</span>
                </div>
                <span className="font-semibold">{cat.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Top Products + Customer Retention */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div variants={fadeInUp} className="lg:col-span-2 bg-[#0F0F0F] rounded-2xl border border-white/10 overflow-hidden">
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <div>
              <h2 className="font-bold">Top Products</h2>
              <p className="text-xs text-gray-400">Best sellers by sales</p>
            </div>
            <button className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1">
              View All
              <ArrowUpRight size={12} />
            </button>
          </div>
          <div className="p-3">
            {topProducts.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition">
                <div className="w-10 h-10 bg-gradient-to-br from-red-600/20 to-amber-500/20 rounded-xl flex items-center justify-center text-xl">
                  {p.image}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-500">#{i + 1}</span>
                    <p className="text-sm font-semibold truncate">{p.name}</p>
                  </div>
                  <p className="text-xs text-gray-500">{p.sales} sales</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-amber-400">${p.revenue}</p>
                  <p className="text-xs text-emerald-400">{p.growth}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={fadeInUp} className="bg-[#0F0F0F] rounded-2xl p-5 border border-white/10">
          <div className="mb-5">
            <h2 className="font-bold">Customer Retention</h2>
            <p className="text-xs text-gray-400">Returning vs new</p>
          </div>
          <div className="w-full overflow-hidden">
            <ResponsiveContainer width="100%" height={200}>
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="30%"
                outerRadius="100%"
                data={customerRetention}
                startAngle={90}
                endAngle={-270}
              >
                <RadialBar dataKey="value" cornerRadius={10} background={{ fill: "#1a1a1a" }} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-2">
            {customerRetention.map((c) => (
              <div key={c.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c.fill }}></span>
                  <span className="text-sm text-gray-400">{c.name}</span>
                </div>
                <span className="text-sm font-bold">{c.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div variants={fadeInUp} className="bg-gradient-to-br from-red-600/10 to-transparent border border-red-600/30 rounded-2xl p-5">
          <div className="w-10 h-10 bg-red-600/20 rounded-xl flex items-center justify-center mb-3">
            <Flame size={20} className="text-red-400" />
          </div>
          <h3 className="font-bold mb-1">Peak Hours</h3>
          <p className="text-sm text-gray-400 mb-2">8 PM - 10 PM</p>
          <p className="text-xs text-red-400">+34% orders this period</p>
        </motion.div>

        <motion.div variants={fadeInUp} className="bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/30 rounded-2xl p-5">
          <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center mb-3">
            <Star size={20} className="text-amber-400" />
          </div>
          <h3 className="font-bold mb-1">Top Rated</h3>
          <p className="text-sm text-gray-400 mb-2">Cheese Pizza</p>
          <p className="text-xs text-amber-400">4.9 ★ from 124 reviews</p>
        </motion.div>

        <motion.div variants={fadeInUp} className="bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/30 rounded-2xl p-5">
          <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-3">
            <Clock size={20} className="text-emerald-400" />
          </div>
          <h3 className="font-bold mb-1">Avg Prep Time</h3>
          <p className="text-sm text-gray-400 mb-2">18 minutes</p>
          <p className="text-xs text-emerald-400">-2 min faster than last week</p>
        </motion.div>
      </div>
    </motion.div>
  );
}