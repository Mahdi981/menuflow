"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  Save,
  Tag,
  Calendar,
  Percent,
  Clock,
  Power,
  TrendingUp,
  DollarSign,
} from "lucide-react";

type Offer = {
  id: number;
  name: string;
  product: string;
  originalPrice: number;
  discountPrice: number;
  startDate: string;
  endDate: string;
  active: boolean;
  usageCount: number;
  image: string;
};

const initialOffers: Offer[] = [
  { id: 1, name: "Weekend Burger", product: "Classic Burger", originalPrice: 8, discountPrice: 5, startDate: "Friday", endDate: "Sunday", active: true, usageCount: 48, image: "🍔" },
  { id: 2, name: "Pizza Tuesday", product: "Cheese Pizza", originalPrice: 12, discountPrice: 9, startDate: "Tuesday", endDate: "Tuesday", active: true, usageCount: 24, image: "🍕" },
  { id: 3, name: "Chicken Combo", product: "Fried Chicken", originalPrice: 10, discountPrice: 7, startDate: "2026-10-01", endDate: "2026-10-31", active: true, usageCount: 36, image: "🍗" },
  { id: 4, name: "Happy Hour Drinks", product: "Coca Cola", originalPrice: 3, discountPrice: 2, startDate: "14:00", endDate: "17:00", active: false, usageCount: 12, image: "🥤" },
  { id: 5, name: "Dessert Special", product: "Chocolate Cake", originalPrice: 6, discountPrice: 4, startDate: "2026-10-01", endDate: "2026-10-15", active: false, usageCount: 8, image: "🍰" },
];

const products = [
  { name: "Classic Burger", price: 8, image: "🍔" },
  { name: "Cheese Pizza", price: 12, image: "🍕" },
  { name: "Fried Chicken", price: 10, image: "🍗" },
  { name: "Coca Cola", price: 3, image: "🥤" },
  { name: "Chocolate Cake", price: 6, image: "🍰" },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

export default function OffersPage() {
  const [offers, setOffers] = useState(initialOffers);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Offer | null>(null);
  const [formData, setFormData] = useState<Partial<Offer>>({
    name: "",
    product: "",
    originalPrice: 0,
    discountPrice: 0,
    startDate: "",
    endDate: "",
    active: true,
    image: "🍔",
  });

  const filteredOffers = offers.filter((o) =>
    o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.product.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddModal = () => {
    setEditingOffer(null);
    setFormData({
      name: "",
      product: "",
      originalPrice: 0,
      discountPrice: 0,
      startDate: "",
      endDate: "",
      active: true,
      image: "🍔",
    });
    setModalOpen(true);
  };

  const openEditModal = (offer: Offer) => {
    setEditingOffer(offer);
    setFormData(offer);
    setModalOpen(true);
  };

  const saveOffer = () => {
    if (!formData.name || !formData.discountPrice) return;

    if (editingOffer) {
      setOffers((prev) =>
        prev.map((o) => (o.id === editingOffer.id ? { ...o, ...formData } as Offer : o))
      );
    } else {
      const newOffer: Offer = {
        id: Math.max(...offers.map((o) => o.id), 0) + 1,
        name: formData.name || "",
        product: formData.product || "",
        originalPrice: formData.originalPrice || 0,
        discountPrice: formData.discountPrice || 0,
        startDate: formData.startDate || "",
        endDate: formData.endDate || "",
        active: formData.active ?? true,
        usageCount: 0,
        image: formData.image || "🍔",
      };
      setOffers((prev) => [newOffer, ...prev]);
    }
    setModalOpen(false);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      setOffers((prev) => prev.filter((o) => o.id !== deleteConfirm.id));
      setDeleteConfirm(null);
    }
  };

  const toggleActive = (id: number) => {
    setOffers((prev) =>
      prev.map((o) => (o.id === id ? { ...o, active: !o.active } : o))
    );
  };

  const activeOffers = offers.filter((o) => o.active).length;
  const totalUsage = offers.reduce((sum, o) => sum + o.usageCount, 0);
  const avgDiscount = offers.length > 0
    ? Math.round(offers.reduce((sum, o) => sum + ((o.originalPrice - o.discountPrice) / o.originalPrice * 100), 0) / offers.length)
    : 0;

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-6">
      {/* Header */}
      <motion.div variants={fadeInUp} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Offers</h1>
          <p className="text-sm text-gray-400">Manage your restaurant promotions and discounts</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={openAddModal}
          className="bg-gradient-to-r from-red-600 to-amber-500 px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition flex items-center justify-center gap-2"
        >
          <Plus size={16} />
          Create Offer
        </motion.button>
      </motion.div>

      {/* Stats */}
      <motion.div variants={fadeInUp} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#0F0F0F] rounded-2xl p-4 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <Tag size={18} className="text-amber-400" />
          </div>
          <p className="text-xs text-gray-400 mb-1">Total Offers</p>
          <p className="text-2xl font-bold">{offers.length}</p>
        </div>
        <div className="bg-[#0F0F0F] rounded-2xl p-4 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <Power size={18} className="text-emerald-400" />
          </div>
          <p className="text-xs text-gray-400 mb-1">Active</p>
          <p className="text-2xl font-bold text-emerald-400">{activeOffers}</p>
        </div>
        <div className="bg-[#0F0F0F] rounded-2xl p-4 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <Percent size={18} className="text-red-400" />
          </div>
          <p className="text-xs text-gray-400 mb-1">Avg Discount</p>
          <p className="text-2xl font-bold text-red-400">{avgDiscount}%</p>
        </div>
        <div className="bg-[#0F0F0F] rounded-2xl p-4 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp size={18} className="text-cyan-400" />
          </div>
          <p className="text-xs text-gray-400 mb-1">Total Usage</p>
          <p className="text-2xl font-bold text-cyan-400">{totalUsage}</p>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div variants={fadeInUp} className="bg-[#0F0F0F] rounded-2xl border border-white/10 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search offers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-red-600/50 transition"
          />
        </div>
      </motion.div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredOffers.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full bg-[#0F0F0F] rounded-2xl border border-white/10 p-12 text-center"
            >
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <Tag size={24} className="text-gray-600" />
              </div>
              <p className="text-gray-400 mb-1">No offers found</p>
              <p className="text-xs text-gray-600 mb-4">Create your first offer to boost sales</p>
              <button
                onClick={openAddModal}
                className="bg-gradient-to-r from-red-600 to-amber-500 px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition inline-flex items-center gap-2"
              >
                <Plus size={16} />
                Create Offer
              </button>
            </motion.div>
          ) : (
            filteredOffers.map((offer, i) => {
              const discountPercent = Math.round(((offer.originalPrice - offer.discountPrice) / offer.originalPrice) * 100);
              return (
                <motion.div
                  key={offer.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -4 }}
                  className={`bg-[#0F0F0F] rounded-2xl border overflow-hidden transition ${
                    offer.active ? "border-white/10 hover:border-amber-500/40" : "border-red-500/20 opacity-60"
                  }`}
                >
                  {/* Image Area */}
                  <div className="relative h-32 bg-gradient-to-br from-red-600/10 to-amber-500/10 flex items-center justify-center">
                    <span className="text-6xl">{offer.image}</span>
                    <span className="absolute top-2 left-2 bg-gradient-to-r from-red-600 to-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                      {discountPercent}% OFF
                    </span>
                    {!offer.active && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                        <span className="bg-red-500/20 border border-red-500/50 text-red-400 text-xs font-bold px-3 py-1 rounded-full">
                          Inactive
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-bold text-sm mb-1">{offer.name}</h3>
                    <p className="text-xs text-gray-400 mb-3">{offer.product}</p>

                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-xs text-gray-500 line-through">${offer.originalPrice}</span>
                      <span className="text-lg font-bold text-amber-400 flex items-center">
                        <DollarSign size={14} />
                        {offer.discountPrice}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[10px] text-gray-500 mb-3 pb-3 border-b border-white/10">
                      <span className="flex items-center gap-1">
                        <Calendar size={10} />
                        {offer.startDate} → {offer.endDate}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-gray-400">Used {offer.usageCount} times</span>
                      <button
                        onClick={() => toggleActive(offer.id)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition ${
                          offer.active
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-gray-500/20 text-gray-400"
                        }`}
                      >
                        {offer.active ? "Active" : "Inactive"}
                      </button>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(offer)}
                        className="flex-1 bg-white/5 hover:bg-white/10 py-2 rounded-lg text-xs font-semibold text-gray-300 hover:text-white transition flex items-center justify-center gap-1"
                      >
                        <Edit size={14} />
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(offer)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0F0F0F] rounded-3xl border border-white/10 w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="p-5 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#0F0F0F] z-10">
                <h2 className="text-lg font-bold">
                  {editingOffer ? "Edit Offer" : "Create New Offer"}
                </h2>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/10 transition"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 space-y-4">
                {/* Offer Name */}
                <div>
                  <label className="block text-xs text-gray-400 mb-2 font-semibold">Offer Name *</label>
                  <input
                    type="text"
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Weekend Burger"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-red-600/50 transition"
                  />
                </div>

                {/* Product */}
                <div>
                  <label className="block text-xs text-gray-400 mb-2 font-semibold">Product</label>
                  <select
                    value={formData.product || ""}
                    onChange={(e) => {
                      const selected = products.find((p) => p.name === e.target.value);
                      setFormData({
                        ...formData,
                        product: e.target.value,
                        originalPrice: selected?.price || 0,
                        image: selected?.image || "🍔",
                      });
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-red-600/50 transition"
                  >
                    <option value="" className="bg-[#0F0F0F]">Select product...</option>
                    {products.map((p) => (
                      <option key={p.name} value={p.name} className="bg-[#0F0F0F]">
                        {p.image} {p.name} - ${p.price}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Prices */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-2 font-semibold">Original ($)</label>
                    <input
                      type="number"
                      value={formData.originalPrice || ""}
                      onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-red-600/50 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-2 font-semibold">Discount ($) *</label>
                    <input
                      type="number"
                      value={formData.discountPrice || ""}
                      onChange={(e) => setFormData({ ...formData, discountPrice: Number(e.target.value) })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-red-600/50 transition"
                    />
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-2 font-semibold">Start</label>
                    <input
                      type="text"
                      value={formData.startDate || ""}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      placeholder="Friday or 2026-10-01"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-red-600/50 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-2 font-semibold">End</label>
                    <input
                      type="text"
                      value={formData.endDate || ""}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      placeholder="Sunday or 2026-10-31"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-red-600/50 transition"
                    />
                  </div>
                </div>

                {/* Active Toggle */}
                <button
                  onClick={() => setFormData({ ...formData, active: !formData.active })}
                  className={`w-full p-3 rounded-xl border text-sm font-semibold transition flex items-center justify-between ${
                    formData.active
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      : "bg-white/5 border-white/10 text-gray-400"
                  }`}
                >
                  Active
                  <div className={`w-9 h-5 rounded-full transition relative ${formData.active ? "bg-emerald-500" : "bg-gray-600"}`}>
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all ${formData.active ? "left-4" : "left-0.5"}`}></div>
                  </div>
                </button>
              </div>

              {/* Footer */}
              <div className="p-5 border-t border-white/10 flex gap-3 sticky bottom-0 bg-[#0F0F0F]">
                <button
                  onClick={() => setModalOpen(false)}
                  className="flex-1 bg-white/5 hover:bg-white/10 py-3 rounded-xl text-sm font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  onClick={saveOffer}
                  disabled={!formData.name || !formData.discountPrice}
                  className={`flex-1 py-3 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2 ${
                    formData.name && formData.discountPrice
                      ? "bg-gradient-to-r from-red-600 to-amber-500 hover:opacity-90"
                      : "bg-white/5 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <Save size={16} />
                  {editingOffer ? "Save Changes" : "Create Offer"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDeleteConfirm(null)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0F0F0F] rounded-3xl border border-white/10 w-full max-w-sm p-6 text-center"
            >
              <div className="w-14 h-14 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={24} className="text-red-400" />
              </div>
              <h3 className="text-lg font-bold mb-2">Delete Offer?</h3>
              <p className="text-sm text-gray-400 mb-6">
                Are you sure you want to delete <span className="font-semibold text-white">{deleteConfirm.name}</span>?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 bg-white/5 hover:bg-white/10 py-3 rounded-xl text-sm font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 bg-red-600 hover:bg-red-700 py-3 rounded-xl text-sm font-semibold transition"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}