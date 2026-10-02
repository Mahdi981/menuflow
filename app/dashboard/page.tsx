"use client";

import { motion } from "framer-motion";
import {
  ShoppingCart,
  DollarSign,
  Users,
  Clock,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

const stats = [
  { label: "Today's Orders", value: "48", change: "+18.4%", isUp: true, icon: ShoppingCart, color: "red" },
  { label: "Today's Revenue", value: "$1,240", change: "+24.8%", isUp: true, icon: DollarSign, color: "amber" },
  { label: "New Customers", value: "12", change: "+8.2%", isUp: true, icon: Users, color: "emerald" },
  { label: "Cancellation Rate", value: "2.4%", change: "-1.1%", isUp: false, icon: Clock, color: "cyan" },
];

const revenueData = [
  { day: "Mon", revenue: 420, orders: 18 },
  { day: "Tue", revenue: 680, orders: 24 },
  { day: "Wed", revenue: 520, orders: 20 },
  { day: "Thu", revenue: 840, orders: 32 },
  { day: "Fri", revenue: 1120, orders: 45 },
  { day: "Sat", revenue: 1240, orders: 48 },
  { day: "Sun", revenue: 980, orders: 38 },
];

const statusData = [
  { name: "Completed", value: 32, color: "#10B981" },
  { name: "Pending", value: 8, color: "#F59E0B" },
  { name: "Preparing", value: 6, color: "#06B6D4" },
  { name: "Cancelled", value: 2, color: "#EF4444" },
];

const popularProducts = [
  { name: "Classic Burger", sales: 142, revenue: "$710" },
  { name: "Cheese Pizza", sales: 98, revenue: "$1,176" },
  { name: "Fried Chicken", sales: 87, revenue: "$609" },
  { name: "Coca Cola", sales: 156, revenue: "$468" },
  { name: "Chocolate Cake", sales: 64, revenue: "$256" },
];

const recentOrders = [
  { id: "#1042", customer: "Ahmad Ali", total: "$19", status: "Pending", time: "2 min ago" },
  { id: "#1041", customer: "Sarah Smith", total: "$14", status: "Preparing", time: "8 min ago" },
  { id: "#1040", customer: "Omar Khaled", total: "$24", status: "Completed", time: "25 min ago" },
  { id: "#1039", customer: "Layla Ahmad", total: "$12", status: "Completed", time: "45 min ago" },
  { id: "#1038", customer: "Hassan Ali", total: "$32", status: "Completed", time: "1h ago" },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  red: { bg: "bg-red-600/20", text: "text-red-400", border: "border-red-600/30" },
  amber: { bg: "bg-amber-500/20", text: "text-amber-400", border: "border-amber-500/30" },
  emerald: { bg: "bg-emerald-500/20", text: "text-emerald-400", border: "border-emerald-500/30" },
  cyan: { bg: "bg-cyan-500/20", text: "text-cyan-400", border: "border-cyan-500/30" },
};

export default function DashboardOverview() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={stagger}
      className="space-y-6"
    >
      {/* Page Header */}
      <motion.div variants={fadeInUp} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Overview</h1>
          <p className="text-sm text-gray-400">Here's your restaurant performance today</p>
        </div>
        <button className="hidden md:flex items-center gap-2 bg-gradient-to-r from-red-600 to-amber-500 px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition">
          <ArrowUpRight size={16} />
          View Reports
        </button>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const colors = colorMap[stat.color];
          return (
            <motion.div
              key={stat.label}
              variants={fadeInUp}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-[#0F0F0F] rounded-2xl p-5 border border-white/10 hover:border-red-600/30 transition"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors.bg}`}>
                  <stat.icon size={20} className={colors.text} />
                </div>
                <span className={`text-xs font-semibold flex items-center gap-1 ${stat.isUp ? "text-emerald-400" : "text-red-400"}`}>
                  {stat.isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {stat.change}
                </span>
              </div>
              <p className="text-xs text-gray-400 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue Chart */}
        <motion.div
          variants={fadeInUp}
          className="lg:col-span-2 bg-[#0F0F0F] rounded-2xl p-5 border border-white/10"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-bold">Revenue Overview</h2>
              <p className="text-xs text-gray-400">Last 7 days</p>
            </div>
            <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-red-600/50">
              <option>This Week</option>
              <option>Last Week</option>
              <option>This Month</option>
            </select>
          </div>
          <div className="w-full overflow-hidden">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#DC2626" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#DC2626" stopOpacity={0} />
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
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#DC2626"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Status Chart */}
        <motion.div variants={fadeInUp} className="bg-[#0F0F0F] rounded-2xl p-5 border border-white/10">
          <div className="mb-5">
            <h2 className="font-bold">Order Status</h2>
            <p className="text-xs text-gray-400">Today's breakdown</p>
          </div>
          <div className="w-full overflow-hidden">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
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
            {statusData.map((s) => (
              <div key={s.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }}></span>
                  <span className="text-gray-400">{s.name}</span>
                </div>
                <span className="font-semibold">{s.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Orders */}
        <motion.div
          variants={fadeInUp}
          className="lg:col-span-2 bg-[#0F0F0F] rounded-2xl border border-white/10 overflow-hidden"
        >
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <div>
              <h2 className="font-bold">Recent Orders</h2>
              <p className="text-xs text-gray-400">Latest from your restaurant</p>
            </div>
            <a href="/dashboard/orders" className="text-xs text-amber-400 hover:text-amber-300 font-semibold">
              View All
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-white/5">
                <tr className="text-left text-xs text-gray-500">
                  <th className="px-5 py-3 font-medium">Order</th>
                  <th className="px-5 py-3 font-medium">Customer</th>
                  <th className="px-5 py-3 font-medium">Total</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium hidden md:table-cell">Time</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition">
                    <td className="px-5 py-3 text-amber-400 font-semibold">{order.id}</td>
                    <td className="px-5 py-3">{order.customer}</td>
                    <td className="px-5 py-3 font-semibold">{order.total}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                          order.status === "Completed"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : order.status === "Pending"
                            ? "bg-amber-500/20 text-amber-400"
                            : "bg-cyan-500/20 text-cyan-400"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs text-gray-500 hidden md:table-cell">{order.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Popular Products */}
        <motion.div
          variants={fadeInUp}
          className="bg-[#0F0F0F] rounded-2xl border border-white/10 overflow-hidden"
        >
          <div className="p-5 border-b border-white/10">
            <h2 className="font-bold">Popular Products</h2>
            <p className="text-xs text-gray-400">Best sellers this week</p>
          </div>
          <div className="p-3">
            {popularProducts.map((p, i) => (
              <div
                key={p.name}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 bg-gradient-to-br from-red-600/20 to-amber-500/20 rounded-lg flex items-center justify-center text-xs font-bold text-amber-400">
                    {i + 1}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{p.name}</p>
                    <p className="text-xs text-gray-500">{p.sales} sales</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-amber-400">{p.revenue}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Orders Bar Chart */}
      <motion.div
        variants={fadeInUp}
        className="bg-[#0F0F0F] rounded-2xl p-5 border border-white/10"
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-bold">Orders by Day</h2>
            <p className="text-xs text-gray-400">Weekly order volume</p>
          </div>
        </div>
        <div className="w-full overflow-hidden">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revenueData}>
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
              <Bar dataKey="orders" fill="#F59E0B" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </motion.div>
  );
}