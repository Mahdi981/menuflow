"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  GripVertical,
  X,
  Save,
  Grid3x3,
  Package,
} from "lucide-react";

type Category = {
  id: number;
  name: string;
  nameAr: string;
  icon: string;
  productCount: number;
  active: boolean;
};

const initialCategories: Category[] = [
  { id: 1, name: "Burgers", nameAr: "برغر", icon: "🍔", productCount: 12, active: true },
  { id: 2, name: "Pizza", nameAr: "بيتزا", icon: "🍕", productCount: 8, active: true },
  { id: 3, name: "Chicken", nameAr: "دجاج", icon: "🍗", productCount: 10, active: true },
  { id: 4, name: "Drinks", nameAr: "مشروبات", icon: "🥤", productCount: 15, active: true },
  { id: 5, name: "Desserts", nameAr: "حلويات", icon: "🍰", productCount: 6, active: true },
  { id: 6, name: "Salads", nameAr: "سلطات", icon: "🥗", productCount: 4, active: false },
];

const emojiOptions = ["🍔", "🍕", "🍗", "🥤", "🍰", "🥗", "🍟", "🌮", "🍜", "🍣", "🍝", "🥙", "🍦", "☕"];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState(initialCategories);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Category | null>(null);
  const [formData, setFormData] = useState<Partial<Category>>({
    name: "",
    nameAr: "",
    icon: "🍔",
    active: true,
  });

  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({ name: "", nameAr: "", icon: "🍔", active: true });
    setModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setFormData(cat);
    setModalOpen(true);
  };

  const saveCategory = () => {
    if (!formData.name) return;

    if (editingCategory) {
      setCategories((prev) =>
        prev.map((c) => (c.id === editingCategory.id ? { ...c, ...formData } as Category : c))
      );
    } else {
      const newCat: Category = {
        id: Math.max(...categories.map((c) => c.id), 0) + 1,
        name: formData.name || "",
        nameAr: formData.nameAr || "",
        icon: formData.icon || "🍔",
        productCount: 0,
        active: formData.active ?? true,
      };
      setCategories((prev) => [...prev, newCat]);
    }
    setModalOpen(false);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      setCategories((prev) => prev.filter((c) => c.id !== deleteConfirm.id));
      setDeleteConfirm(null);
    }
  };

  const toggleActive = (id: number) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    );
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-6">
      {/* Header */}
      <motion.div variants={fadeInUp} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Categories</h1>
          <p className="text-sm text-gray-400">Organize your menu with categories</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={openAddModal}
          className="bg-gradient-to-r from-red-600 to-amber-500 px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition flex items-center justify-center gap-2"
        >
          <Plus size={16} />
          Add Category
        </motion.button>
      </motion.div>

      {/* Stats */}
      <motion.div variants={fadeInUp} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#0F0F0F] rounded-2xl p-4 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <Grid3x3 size={18} className="text-amber-400" />
          </div>
          <p className="text-xs text-gray-400 mb-1">Total Categories</p>
          <p className="text-2xl font-bold">{categories.length}</p>
        </div>
        <div className="bg-[#0F0F0F] rounded-2xl p-4 border border-white/10">
          <p className="text-xs text-gray-400 mb-1">Active</p>
          <p className="text-2xl font-bold text-emerald-400">{categories.filter((c) => c.active).length}</p>
        </div>
        <div className="bg-[#0F0F0F] rounded-2xl p-4 border border-white/10">
          <p className="text-xs text-gray-400 mb-1">Total Products</p>
          <p className="text-2xl font-bold">{categories.reduce((sum, c) => sum + c.productCount, 0)}</p>
        </div>
        <div className="bg-[#0F0F0F] rounded-2xl p-4 border border-white/10">
          <p className="text-xs text-gray-400 mb-1">Avg Products</p>
          <p className="text-2xl font-bold text-amber-400">
            {categories.length > 0 ? Math.round(categories.reduce((sum, c) => sum + c.productCount, 0) / categories.length) : 0}
          </p>
        </div>
      </motion.div>

      {/* Categories List */}
      <motion.div variants={fadeInUp} className="bg-[#0F0F0F] rounded-2xl border border-white/10 overflow-hidden">
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="font-bold">All Categories</h2>
            <p className="text-xs text-gray-400">Drag to reorder categories</p>
          </div>
        </div>
        <div className="divide-y divide-white/5">
          <AnimatePresence mode="popLayout">
            {categories.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-12 text-center"
              >
                <p className="text-gray-400 mb-1">No categories yet</p>
                <p className="text-xs text-gray-600 mb-4">Add your first category to get started</p>
                <button
                  onClick={openAddModal}
                  className="bg-gradient-to-r from-red-600 to-amber-500 px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition inline-flex items-center gap-2"
                >
                  <Plus size={16} />
                  Add Category
                </button>
              </motion.div>
            ) : (
              categories.map((cat, i) => (
                <motion.div
                  key={cat.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: i * 0.03 }}
                  className="p-4 flex items-center gap-4 hover:bg-white/5 transition group"
                >
                  {/* Drag Handle */}
                  <div className="cursor-grab text-gray-600 group-hover:text-gray-400 transition">
                    <GripVertical size={18} />
                  </div>

                  {/* Icon */}
                  <div className="w-12 h-12 bg-gradient-to-br from-red-600/20 to-amber-500/20 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                    {cat.icon}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm truncate">{cat.name}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        cat.active
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-gray-500/20 text-gray-400"
                      }`}>
                        {cat.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{cat.nameAr || "—"}</p>
                  </div>

                  {/* Product Count */}
                  <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg">
                    <Package size={14} className="text-amber-400" />
                    <span className="text-xs font-semibold">{cat.productCount}</span>
                    <span className="text-xs text-gray-500">products</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleActive(cat.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                        cat.active
                          ? "bg-white/5 hover:bg-gray-500/20 text-gray-400"
                          : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400"
                      }`}
                    >
                      {cat.active ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      onClick={() => openEditModal(cat)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition"
                      title="Edit"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(cat)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </motion.div>

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
                  {editingCategory ? "Edit Category" : "Add New Category"}
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
                {/* Name EN */}
                <div>
                  <label className="block text-xs text-gray-400 mb-2 font-semibold">Name (English) *</label>
                  <input
                    type="text"
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Burgers"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-red-600/50 transition"
                  />
                </div>

                {/* Name AR */}
                <div>
                  <label className="block text-xs text-gray-400 mb-2 font-semibold">Name (Arabic)</label>
                  <input
                    type="text"
                    value={formData.nameAr || ""}
                    onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                    placeholder="مثال: برغر"
                    dir="rtl"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-red-600/50 transition"
                  />
                </div>

                {/* Icon Picker */}
                <div>
                  <label className="block text-xs text-gray-400 mb-2 font-semibold">Icon</label>
                  <div className="grid grid-cols-7 gap-2">
                    {emojiOptions.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => setFormData({ ...formData, icon: emoji })}
                        className={`aspect-square rounded-xl text-xl flex items-center justify-center transition ${
                          formData.icon === emoji
                            ? "bg-gradient-to-br from-red-600/30 to-amber-500/30 border-2 border-amber-500"
                            : "bg-white/5 hover:bg-white/10 border-2 border-transparent"
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
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
                  onClick={saveCategory}
                  disabled={!formData.name}
                  className={`flex-1 py-3 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2 ${
                    formData.name
                      ? "bg-gradient-to-r from-red-600 to-amber-500 hover:opacity-90"
                      : "bg-white/5 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <Save size={16} />
                  {editingCategory ? "Save Changes" : "Add Category"}
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
              <h3 className="text-lg font-bold mb-2">Delete Category?</h3>
              <p className="text-sm text-gray-400 mb-6">
                Are you sure you want to delete <span className="font-semibold text-white">{deleteConfirm.name}</span>? This action cannot be undone.
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