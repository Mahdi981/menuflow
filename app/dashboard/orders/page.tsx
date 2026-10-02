"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Search,
  Filter,
  Eye,
  Check,
  X,
  Clock,
  ChefHat,
  Bike,
  CheckCircle2,
  XCircle,
  Phone,
  MapPin,
  DollarSign,
} from "lucide-react";

type OrderStatus = "Pending" | "Accepted" | "Preparing" | "Ready" | "Out for Delivery" | "Completed" | "Cancelled";

const statusConfig: Record<OrderStatus, { color: string; bg: string; border: string }> = {
  Pending: { color: "text-amber-400", bg: "bg-amber-500/20", border: "border-amber-500/30" },
  Accepted: { color: "text-cyan-400", bg: "bg-cyan-500/20", border: "border-cyan-500/30" },
  Preparing: { color: "text-blue-400", bg: "bg-blue-500/20", border: "border-blue-500/30" },
  Ready: { color: "text-violet-400", bg: "bg-violet-500/20", border: "border-violet-500/30" },
  "Out for Delivery": { color: "text-orange-400", bg: "bg-orange-500/20", border: "border-orange-500/30" },
  Completed: { color: "text-emerald-400", bg: "bg-emerald-500/20", border: "border-emerald-500/30" },
  Cancelled: { color: "text-red-400", bg: "bg-red-500/20", border: "border-red-500/30" },
};

const allOrders = [
  { id: "#1048", customer: "Ahmad Ali", phone: "70 123 456", items: "2× Burger, 1× Fries", subtotal: 17, delivery: 2, total: 19, status: "Pending" as OrderStatus, type: "Delivery", address: "Hamra, Beirut", time: "2 min ago" },
  { id: "#1047", customer: "Sarah Smith", phone: "71 234 567", items: "1× Pizza, 2× Pepsi", subtotal: 18, delivery: 2, total: 20, status: "Preparing" as OrderStatus, type: "Delivery", address: "Verdun, Beirut", time: "8 min ago" },
  { id: "#1046", customer: "Omar Khaled", phone: "76 345 678", items: "3× Chicken, 1× Salad", subtotal: 32, delivery: 2, total: 34, status: "Completed" as OrderStatus, type: "Delivery", address: "Achrafieh, Beirut", time: "25 min ago" },
  { id: "#1045", customer: "Layla Ahmad", phone: "78 456 789", items: "1× Pasta, 1× Juice", subtotal: 15, delivery: 0, total: 15, status: "Completed" as OrderStatus, type: "Pickup", address: "—", time: "45 min ago" },
  { id: "#1044", customer: "Hassan Ali", phone: "79 567 890", items: "2× Burger, 2× Fries", subtotal: 26, delivery: 2, total: 28, status: "Out for Delivery" as OrderStatus, type: "Delivery", address: "Downtown, Beirut", time: "1h ago" },
  { id: "#1043", customer: "Nour Ibrahim", phone: "70 678 901", items: "1× Cake, 1× Coffee", subtotal: 12, delivery: 2, total: 14, status: "Cancelled" as OrderStatus, type: "Delivery", address: "Jounieh", time: "1h ago" },
  { id: "#1042", customer: "Maya Khalil", phone: "71 789 012", items: "2× Pizza", subtotal: 24, delivery: 2, total: 26, status: "Accepted" as OrderStatus, type: "Delivery", address: "Badaro, Beirut", time: "2h ago" },
  { id: "#1041", customer: "James Smith", phone: "76 890 123", items: "1× Burger, 1× Coke", subtotal: 11, delivery: 2, total: 13, status: "Ready" as OrderStatus, type: "Delivery", address: "Gemmayzeh, Beirut", time: "2h ago" },
];

const statusFilters: (OrderStatus | "All")[] = ["All", "Pending", "Accepted", "Preparing", "Ready", "Out for Delivery", "Completed", "Cancelled"];

const statusActions: Record<OrderStatus, OrderStatus | null> = {
  Pending: "Accepted",
  Accepted: "Preparing",
  Preparing: "Ready",
  Ready: "Out for Delivery",
  "Out for Delivery": "Completed",
  Completed: null,
  Cancelled: null,
};

export default function OrdersPage() {
  const [orders, setOrders] = useState(allOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "All">("All");

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone.includes(searchTerm);
    const matchesStatus = statusFilter === "All" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const updateStatus = (id: string, newStatus: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o)));
  };

  const cancelOrder = (id: string) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: "Cancelled" as OrderStatus } : o)));
  };

  const statusCounts = {
    All: orders.length,
    Pending: orders.filter((o) => o.status === "Pending").length,
    Accepted: orders.filter((o) => o.status === "Accepted").length,
    Preparing: orders.filter((o) => o.status === "Preparing").length,
    Ready: orders.filter((o) => o.status === "Ready").length,
    "Out for Delivery": orders.filter((o) => o.status === "Out for Delivery").length,
    Completed: orders.filter((o) => o.status === "Completed").length,
    Cancelled: orders.filter((o) => o.status === "Cancelled").length,
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Orders</h1>
          <p className="text-sm text-gray-400">Manage and track all your restaurant orders</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            <span className="text-xs font-semibold text-emerald-400">Live</span>
          </div>
        </div>
      </div>

      {/* Status Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {statusFilters.map((status) => {
          const isActive = statusFilter === status;
          const count = statusCounts[status];
          return (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 ${
                isActive
                  ? "bg-gradient-to-r from-red-600 to-amber-500 text-white"
                  : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              {status}
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${isActive ? "bg-white/20" : "bg-white/10"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="bg-[#0F0F0F] rounded-2xl border border-white/10 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search by order number, customer name, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-red-600/50 transition"
          />
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredOrders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-[#0F0F0F] rounded-2xl border border-white/10 p-12 text-center"
            >
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={24} className="text-gray-600" />
              </div>
              <p className="text-gray-400 mb-1">No orders found</p>
              <p className="text-xs text-gray-600">Try adjusting your search or filters</p>
            </motion.div>
          ) : (
            filteredOrders.map((order, i) => {
              const config = statusConfig[order.status];
              const nextStatus = statusActions[order.status];
              return (
                <motion.div
                  key={order.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.03 }}
                  className="bg-[#0F0F0F] rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 transition"
                >
                  <div className="p-5">
                    {/* Header Row */}
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-red-600/20 to-amber-500/20 rounded-xl flex items-center justify-center">
                          <ChefHat size={22} className="text-amber-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-amber-400">{order.id}</span>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${config.bg} ${config.color} ${config.border}`}>
                              {order.status}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">{order.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${order.type === "Delivery" ? "bg-orange-500/20 text-orange-400" : "bg-cyan-500/20 text-cyan-400"}`}>
                          {order.type === "Delivery" ? <Bike size={14} /> : <MapPin size={14} />}
                          {order.type}
                        </span>
                        <span className="px-3 py-1.5 rounded-lg bg-white/5 text-sm font-bold text-amber-400">
                          ${order.total}
                        </span>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-white/5 rounded-xl p-3">
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Customer</p>
                        <p className="text-sm font-semibold">{order.customer}</p>
                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                          <Phone size={12} />
                          {order.phone}
                        </p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-3 md:col-span-2">
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Items</p>
                        <p className="text-sm text-gray-300">{order.items}</p>
                        {order.type === "Delivery" && (
                          <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                            <MapPin size={12} />
                            {order.address}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Price Breakdown */}
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-4 pb-4 border-b border-white/10">
                      <span>Subtotal: <span className="text-white font-semibold">${order.subtotal}</span></span>
                      <span>Delivery: <span className="text-white font-semibold">${order.delivery}</span></span>
                      <span>Total: <span className="text-amber-400 font-bold">${order.total}</span></span>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-2">
                      {nextStatus && (
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => updateStatus(order.id, nextStatus)}
                          className="flex-1 md:flex-none px-4 py-2.5 bg-gradient-to-r from-red-600 to-amber-500 rounded-xl text-sm font-semibold hover:opacity-90 transition flex items-center justify-center gap-2"
                        >
                          <Check size={16} />
                          Accept as {nextStatus}
                        </motion.button>
                      )}
                      {order.status === "Pending" && (
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => cancelOrder(order.id)}
                          className="px-4 py-2.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm font-semibold hover:bg-red-500/20 transition flex items-center gap-2"
                        >
                          <XCircle size={16} />
                          Reject
                        </motion.button>
                      )}
                      <button className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition">
                        <Eye size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}