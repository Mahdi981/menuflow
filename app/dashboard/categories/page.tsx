"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRestaurant } from "@/lib/hooks/useRestaurant";
import { Plus, Edit, Trash2, X, Save, Grid3x3 } from "lucide-react";

type Category = {
  id: number;
  restaurant_id: number;
  name: string;
  name_ar: string | null;
  icon: string | null;
  created_at: string;
};

const emojiOptions = [
  "🍔",
  "🍕",
  "🍗",
  "🥤",
  "🍰",
  "🥗",
  "🍟",
  "🌮",
  "🍜",
  "🍣",
  "🍝",
  "🥙",
  "🍦",
  "☕",
];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

export default function CategoriesPage() {
  const supabase = createClient();
  const { restaurant, loading: restLoading } = useRestaurant();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Category | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    name_ar: "",
    icon: "🍔",
  });

  const fetchCategories = async () => {
    if (!restaurant) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("restaurant_id", restaurant.id)
      .order("created_at", { ascending: true });

    if (error) {
      setError(error.message);
    } else {
      setCategories(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (restaurant) {
      fetchCategories();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurant]);

  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({ name: "", name_ar: "", icon: "🍔" });
    setError("");
    setModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      name_ar: cat.name_ar || "",
      icon: cat.icon || "🍔",
    });
    setError("");
    setModalOpen(true);
  };

  const saveCategory = async () => {
    if (!formData.name || !restaurant) return;
    setSaving(true);
    setError("");

    try {
      if (editingCategory) {
        const { error } = await supabase
          .from("categories")
          .update({
            name: formData.name,
            name_ar: formData.name_ar || null,
            icon: formData.icon,
          })
          .eq("id", editingCategory.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("categories").insert({
          restaurant_id: restaurant.id,
          name: formData.name,
          name_ar: formData.name_ar || null,
          icon: formData.icon,
        });

        if (error) throw error;
      }

      await fetchCategories();
      setModalOpen(false);
    } catch (err: any) {
      setError(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", deleteConfirm.id);

      if (error) throw error;

      await fetchCategories();
      setDeleteConfirm(null);
    } catch (err: any) {
      setError(err.message || "Failed to delete");
    } finally {
      setSaving(false);
    }
  };

  if (restLoading || loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand/30 border-t-brand rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={stagger}
      className="min-h-screen bg-cream p-4 md:p-6 space-y-6"
    >
      {/* Header */}
      <motion.div
        variants={fadeInUp}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-ink">
            Categories
          </h1>
          <p className="text-sm text-ink-muted mt-1">
            Organize your menu with categories
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={openAddModal}
          className="bg-brand hover:bg-brand-dark text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-brand transition flex items-center justify-center gap-2"
        >
          <Plus size={16} />
          Add Category
        </motion.button>
      </motion.div>

      {/* Stats */}
      <motion.div
        variants={fadeInUp}
        className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
      >
        <div className="bg-surface rounded-2xl p-4 border border-line shadow-soft">
          <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center mb-3">
            <Grid3x3 size={18} />
          </div>
          <p className="text-xs text-ink-muted uppercase tracking-wider">
            Total Categories
          </p>
          <p className="text-2xl font-bold text-brand mt-1">
            {categories.length}
          </p>
        </div>
        <div className="bg-surface rounded-2xl p-4 border border-line shadow-soft">
          <p className="text-xs text-ink-muted uppercase tracking-wider mb-1">
            Plan Limit
          </p>
          <p className="text-2xl font-bold text-amber-custom">1</p>
        </div>
        <div className="bg-surface rounded-2xl p-4 border border-line shadow-soft">
          <p className="text-xs text-ink-muted uppercase tracking-wider mb-1">
            Active
          </p>
          <p className="text-2xl font-bold text-green-600">
            {categories.length}
          </p>
        </div>
        <div className="bg-surface rounded-2xl p-4 border border-line shadow-soft">
          <p className="text-xs text-ink-muted uppercase tracking-wider mb-1">
            Products
          </p>
          <p className="text-2xl font-bold text-ink">0</p>
        </div>
      </motion.div>

      {/* Categories List */}
      <motion.div
        variants={fadeInUp}
        className="bg-surface rounded-2xl border border-line overflow-hidden shadow-soft"
      >
        <div className="p-5 border-b border-line">
          <h2 className="font-bold text-ink">All Categories</h2>
          <p className="text-xs text-ink-muted mt-0.5">Your menu sections</p>
        </div>

        {categories.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-brand/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Grid3x3 size={24} className="text-brand" />
            </div>
            <p className="text-ink-muted font-medium mb-1">
              No categories yet
            </p>
            <p className="text-xs text-ink-muted/70 mb-4">
              Add your first category to get started
            </p>
            <button
              onClick={openAddModal}
              className="bg-brand hover:bg-brand-dark text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-brand transition inline-flex items-center gap-2"
            >
              <Plus size={16} />
              Add Category
            </button>
          </div>
        ) : (
          <div className="divide-y divide-line">
            <AnimatePresence mode="popLayout">
              {categories.map((cat, i) => (
                <motion.div
                  key={cat.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: i * 0.03 }}
                  className="p-4 flex items-center gap-4 hover:bg-cream transition"
                >
                  <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                    {cat.icon || "🍔"}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm truncate text-ink">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-ink-muted truncate">
                      {cat.name_ar || "—"}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(cat)}
                      className="p-2 rounded-lg bg-cream hover:bg-brand/10 text-ink-muted hover:text-brand transition"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(cat)}
                      className="p-2 rounded-lg bg-cream hover:bg-red-500/10 text-ink-muted hover:text-red-600 transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-surface rounded-3xl border border-line w-full max-w-md shadow-2xl"
            >
              <div className="p-5 border-b border-line flex items-center justify-between">
                <h2 className="text-lg font-bold text-ink">
                  {editingCategory ? "Edit Category" : "Add New Category"}
                </h2>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-2 rounded-lg hover:bg-cream transition text-ink-muted"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-5 space-y-4">
                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3">
                    <p className="text-xs text-red-600">{error}</p>
                  </div>
                )}

                <div>
                  <label className="block text-xs text-ink-muted mb-2 font-semibold">
                    Name (English) *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Burgers"
                    className="w-full bg-white border border-line rounded-xl py-3 px-4 text-sm text-ink placeholder:text-ink-muted/50 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs text-ink-muted mb-2 font-semibold">
                    Name (Arabic)
                  </label>
                  <input
                    type="text"
                    value={formData.name_ar}
                    onChange={(e) =>
                      setFormData({ ...formData, name_ar: e.target.value })
                    }
                    placeholder="برغر"
                    dir="rtl"
                    className="w-full bg-white border border-line rounded-xl py-3 px-4 text-sm text-ink placeholder:text-ink-muted/50 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs text-ink-muted mb-2 font-semibold">
                    Icon
                  </label>
                  <div className="grid grid-cols-7 gap-2">
                    {emojiOptions.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() =>
                          setFormData({ ...formData, icon: emoji })
                        }
                        className={`aspect-square rounded-xl text-xl flex items-center justify-center transition ${
                          formData.icon === emoji
                            ? "bg-brand/10 border-2 border-brand"
                            : "bg-cream hover:bg-brand/10 border-2 border-transparent"
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 border-t border-line flex gap-3">
                <button
                  onClick={() => setModalOpen(false)}
                  className="flex-1 bg-cream hover:bg-brand/10 py-3 rounded-xl text-sm font-semibold text-ink transition"
                >
                  Cancel
                </button>
                <button
                  onClick={saveCategory}
                  disabled={!formData.name || saving}
                  className={`flex-1 py-3 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2 ${
                    formData.name && !saving
                      ? "bg-brand hover:bg-brand-dark text-white shadow-brand"
                      : "bg-cream text-ink-muted cursor-not-allowed"
                  }`}
                >
                  <Save size={16} />
                  {saving
                    ? "Saving..."
                    : editingCategory
                      ? "Save Changes"
                      : "Add Category"}
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-surface rounded-3xl border border-line w-full max-w-sm p-6 text-center shadow-2xl"
            >
              <div className="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={24} className="text-red-600" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-ink">
                Delete Category?
              </h3>
              <p className="text-sm text-ink-muted mb-6">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-ink">
                  {deleteConfirm.name}
                </span>
                ?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 bg-cream hover:bg-brand/10 py-3 rounded-xl text-sm font-semibold text-ink transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={saving}
                  className="flex-1 bg-red-600 hover:bg-red-700 py-3 rounded-xl text-sm font-semibold text-white transition disabled:opacity-50"
                >
                  {saving ? "Deleting..." : "Delete"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}