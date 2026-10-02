"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Search,
  Users,
  UserPlus,
  Crown,
  TrendingUp,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Eye,
  X,
  ShoppingCart,
  DollarSign,
  Calendar,
} from "lucide-react";

type Customer = {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  lastOrder: string;
  joinedDate: string;
  status: "VIP" | "Regular" | "New";
};

const initialCustomers: Customer[] = [
  { id: 1, name: "Ahmad Ali", phone: "70 123 456", email: "ahmad@email.com", address: "Hamra, Beirut", totalOrders: 24, totalSpent: 456, lastOrder: "2 hours ago", joinedDate: "Jan 2026", status: "VIP" },
  { id: 2, name: "Sarah Smith", phone: "71 234 567", email: "sarah@email.com", address: "Verdun, Beirut", totalOrders: 18, totalSpent: 342, lastOrder: "8 min ago", joinedDate: "Feb 2026", status: "VIP" },
  { id: 3, name: "Omar Khaled", phone: "76 345 678", email: "omar@email.com", address: "Achrafieh, Beirut", totalOrders: 12, totalSpent: 234, lastOrder: "1 day ago", joinedDate: "Mar 2026", status: "Regular" },
  { id: 4, name: "Layla Ahmad", phone: "78 456 789", email: "layla@email.com", address: "Jounieh", totalOrders: 8, totalSpent: 156, lastOrder: "2 days ago", joinedDate: "Apr 2026", status: "Regular" },
  { id: 5, name: "Hassan Ali", phone: "79 567 890", email: "hassan@email.com", address: "Downtown, Beirut", totalOrders: 5, totalSpent: 98, lastOrder: "3 days ago", joinedDate: "May 2026", status: "Regular" },
  { id: 6, name: "Nour Ibrahim", phone: "70 678 901", email: "nour@email.com", address: "Badaro, Beirut", totalOrders: 2, totalSpent: 34, lastOrder: "5 days ago", joinedDate: "Sep 2026", status: "New" },
  { id: 7, name: "Maya Khalil", phone: "71 789 012", email: "maya@email.com", address: "Gemmayzeh, Beirut", totalOrders: 3, totalSpent: 56, lastOrder: "1 week ago", joinedDate: "Aug 2026", status: "New" },
  { id: 8, name: "James Smith", phone: "76 890 123", email: "james@email.com", address: "Mar Mikhael, Beirut", totalOrders: 15, totalSpent: 289, lastOrder: "12 hours ago", joinedDate: "Feb 2026", status: "VIP" },
];

const statusConfig = {
  VIP: { color: "text-amber-400", bg: "bg-amber-500/20", border: "border-amber-500/30", icon: Crown },
  Regular: { color: "text-cyan-400", bg: "bg-cyan-500/20", border: "border-cyan-500/30", icon: Users },
  New: { color: "text-emerald-400", bg: "bg-emerald-500/20", border: "border-emerald-500/30", icon: UserPlus },
};

const filters: ("All" | "VIP" | "Regular" | "New")[] = ["All", "VIP", "Regular", "New"];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

export default function CustomersPage() {
  const [customers] = useState(initialCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "VIP" | "Regular" | "New">("All");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalSpent = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const totalOrders = customers.reduce((sum, c) => sum + c.totalOrders, 0);

  const statusCounts = {
    All: customers.length,
    VIP: customers.filter((c) => c.status === "VIP").length,
    Regular: customers.filter((c) => c.status === "Regular").length,
    New: customers.filter((c) => c.status === "New").length,
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-6">
      {/* Header */}
      <motion.div variants={fadeInUp} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Customers</h1>
          <p className="text-sm text-gray-400">Manage your customer base</p>
        </div>
        <button className="bg-gradient-to-r from-red-600 to-amber-500 px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition flex items-center justify-center gap-2">
          <UserPlus size={16} />
          Add Customer
        </button>
      </motion.div>

      {/* Stats */}
      <motion.div variants={fadeInUp} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#0F0F0F] rounded-2xl p-4 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <Users size={18} className="text-amber-400" />
          </div>
          <p className="text-xs text-gray-400 mb-1">Total Customers</p>
          <p className="text-2xl font-bold">{customers.length}</p>
        </div>
        <div className="bg-[#0F0F0F] rounded-2xl p-4 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <Crown size={18} className="text-amber-400" />
          </div>
          <p className="text-xs text-gray-400 mb-1">VIP Customers</p>
          <p className="text-2xl font-bold text-amber-400">{statusCounts.VIP}</p>
        </div>
        <div className="bg-[#0F0F0F] rounded-2xl p-4 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <ShoppingCart size={18} className="text-cyan-400" />
          </div>
          <p className="text-xs text-gray-400 mb-1">Total Orders</p>
          <p className="text-2xl font-bold text-cyan-400">{totalOrders}</p>
        </div>
        <div className="bg-[#0F0F0F] rounded-2xl p-4 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <DollarSign size={18} className="text-emerald-400" />
          </div>
          <p className="text-xs text-gray-400 mb-1">Total Revenue</p>
          <p className="text-2xl font-bold text-emerald-400">${totalSpent}</p>
        </div>
      </motion.div>

      {/* Search + Filters */}
      <motion.div variants={fadeInUp} className="bg-[#0F0F0F] rounded-2xl border border-white/10 p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search by name, phone, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-red-600/50 transition"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {filters.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 ${
                statusFilter === status
                  ? "bg-gradient-to-r from-red-600 to-amber-500 text-white"
                  : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              {status}
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${statusFilter === status ? "bg-white/20" : "bg-white/10"}`}>
                {statusCounts[status]}
              </span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredCustomers.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full bg-[#0F0F0F] rounded-2xl border border-white/10 p-12 text-center"
            >
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={24} className="text-gray-600" />
              </div>
              <p className="text-gray-400 mb-1">No customers found</p>
              <p className="text-xs text-gray-600">Try adjusting your search or filters</p>
            </motion.div>
          ) : (
            filteredCustomers.map((customer, i) => {
              const config = statusConfig[customer.status];
              const StatusIcon = config.icon;

              return (
                <motion.div
                  key={customer.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="bg-[#0F0F0F] rounded-2xl border border-white/10 hover:border-amber-500/40 transition overflow-hidden"
                >
                  <div className="p-5">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-amber-500 rounded-xl flex items-center justify-center text-lg font-bold">
                          {customer.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-sm truncate">{customer.name}</h3>
                          <p className="text-xs text-gray-500">Joined {customer.joinedDate}</p>
                        </div>
                      </div>
                      <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 ${config.bg} ${config.color} ${config.border} border`}>
                        <StatusIcon size={10} />
                        {customer.status}
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Phone size={12} className="text-amber-400 shrink-0" />
                        <span className="truncate">{customer.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Mail size={12} className="text-amber-400 shrink-0" />
                        <span className="truncate">{customer.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <MapPin size={12} className="text-amber-400 shrink-0" />
                        <span className="truncate">{customer.address}</span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-2 mb-4 pt-4 border-t border-white/10">
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">Orders</p>
                        <p className="text-lg font-bold">{customer.totalOrders}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">Spent</p>
                        <p className="text-lg font-bold text-amber-400">${customer.totalSpent}</p>
                      </div>
                    </div>

                    {/* Last Order */}
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                      <Calendar size={12} />
                      Last order: {customer.lastOrder}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedCustomer(customer)}
                        className="flex-1 bg-white/5 hover:bg-white/10 py-2 rounded-lg text-xs font-semibold text-gray-300 hover:text-white transition flex items-center justify-center gap-1"
                      >
                        <Eye size={14} />
                        View Profile
                      </button>
                      <button className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition" title="Message on WhatsApp">
                        <MessageCircle size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Customer Detail Modal */}
      <AnimatePresence>
        {selectedCustomer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCustomer(null)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0F0F0F] rounded-3xl border border-white/10 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="p-5 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#0F0F0F] z-10">
                <h2 className="text-lg font-bold">Customer Profile</h2>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="p-2 rounded-lg hover:bg-white/10 transition"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 space-y-5">
                {/* Profile Header */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-amber-500 rounded-2xl flex items-center justify-center text-2xl font-bold">
                    {selectedCustomer.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{selectedCustomer.name}</h3>
                    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold mt-1 ${statusConfig[selectedCustomer.status].bg} ${statusConfig[selectedCustomer.status].color} border ${statusConfig[selectedCustomer.status].border}`}>
                      {selectedCustomer.status}
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="bg-white/5 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center">
                      <Phone size={14} className="text-amber-400" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider">Phone</p>
                      <p className="text-sm font-semibold">{selectedCustomer.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center">
                      <Mail size={14} className="text-amber-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider">Email</p>
                      <p className="text-sm font-semibold truncate">{selectedCustomer.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center">
                      <MapPin size={14} className="text-amber-400" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider">Address</p>
                      <p className="text-sm font-semibold">{selectedCustomer.address}</p>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white/5 rounded-2xl p-3 text-center">
                    <ShoppingCart size={16} className="text-cyan-400 mx-auto mb-1" />
                    <p className="text-[10px] text-gray-500 uppercase">Orders</p>
                    <p className="text-lg font-bold">{selectedCustomer.totalOrders}</p>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-3 text-center">
                    <DollarSign size={16} className="text-emerald-400 mx-auto mb-1" />
                    <p className="text-[10px] text-gray-500 uppercase">Spent</p>
                    <p className="text-lg font-bold text-emerald-400">${selectedCustomer.totalSpent}</p>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-3 text-center">
                    <TrendingUp size={16} className="text-amber-400 mx-auto mb-1" />
                    <p className="text-[10px] text-gray-500 uppercase">Avg</p>
                    <p className="text-lg font-bold text-amber-400">
                      ${Math.round(selectedCustomer.totalSpent / selectedCustomer.totalOrders)}
                    </p>
                  </div>
                </div>

                {/* Info */}
                <div className="bg-white/5 rounded-2xl p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Joined</span>
                    <span className="font-semibold">{selectedCustomer.joinedDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Last Order</span>
                    <span className="font-semibold">{selectedCustomer.lastOrder}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button className="flex-1 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 py-3 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2">
                    <MessageCircle size={16} />
                    WhatsApp
                  </button>
                  <button className="flex-1 bg-gradient-to-r from-red-600 to-amber-500 hover:opacity-90 py-3 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2">
                    <ShoppingCart size={16} />
                    New Order
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}