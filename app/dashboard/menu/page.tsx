"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { useRestaurant } from "@/lib/hooks/useRestaurant";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Star,
  StarOff,
  X,
  Save,
  Flame,
  Upload,
  Loader2,
  DollarSign,
  Image as ImageIcon,
} from "lucide-react";
import { uploadImage } from "@/lib/utils/uploadImage";

type Category = {
  id: number;
  name: string;
  icon: string | null;
};

type Product = {
  id: number;
  restaurant_id: number;
  category_id: number | null;
  name: string;
  description: string | null;
  price: number;
  discount_price: number | null;
  image_url: string | null;
  available: boolean;
  featured: boolean;
  created_at: string;
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

export default function MenuPage() {
  const supabase = createClient();
  const { restaurant, loading: restLoading } = useRestaurant();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<number | "all">("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    discount_price: 0,
    category_id: null as number | null,
    image_url: "",
    available: true,
    featured: false,
  });

  const fetchData = async () => {
    if (!restaurant) return;
    setLoading(true);

    const { data: cats } = await supabase
      .from("categories")
      .select("id, name, icon")
      .eq("restaurant_id", restaurant.id)
      .order("created_at", { ascending: true });

    setCategories(cats || []);

    const { data: prods, error } = await supabase
      .from("products")
      .select("*")
      .eq("restaurant_id", restaurant.id)
      .order("created_at", { ascending: false });

    if (error) setError(error.message);
    else setProducts(prods || []);

    setLoading(false);
  };

  useEffect(() => {
    if (restaurant) fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurant]);

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || p.category_id === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      description: "",
      price: 0,
      discount_price: 0,
      category_id: categories[0]?.id || null,
      image_url: "",
      available: true,
      featured: false,
    });
    setError("");
    setModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price,
      discount_price: product.discount_price || 0,
      category_id: product.category_id,
      image_url: product.image_url || "",
      available: product.available,
      featured: product.featured,
    });
    setError("");
    setModalOpen(true);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const url = await uploadImage(file);
    setUploading(false);

    if (url) {
      setFormData({ ...formData, image_url: url });
    } else {
      setError("Failed to upload image");
    }
  };

  const saveProduct = async () => {
    if (!formData.name || !formData.price || !restaurant) return;
    setSaving(true);
    setError("");

    try {
      const payload = {
        restaurant_id: restaurant.id,
        name: formData.name,
        description: formData.description || null,
        price: formData.price,
        discount_price: formData.discount_price || null,
        category_id: formData.category_id,
        image_url: formData.image_url || null,
        available: formData.available,
        featured: formData.featured,
      };

      if (editingProduct) {
        const { error } = await supabase
          .from("products")
          .update(payload)
          .eq("id", editingProduct.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("products").insert(payload);
        if (error) throw error;
      }

      await fetchData();
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
        .from("products")
        .delete()
        .eq("id", deleteConfirm.id);
      if (error) throw error;
      await fetchData();
      setDeleteConfirm(null);
    } catch (err: any) {
      setError(err.message || "Failed to delete");
    } finally {
      setSaving(false);
    }
  };

  const toggleAvailable = async (id: number, current: boolean) => {
    await supabase.from("products").update({ available: !current }).eq("id", id);
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, available: !current } : p))
    );
  };

  const toggleFeatured = async (id: number, current: boolean) => {
    await supabase.from("products").update({ featured: !current }).eq("id", id);
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, featured: !current } : p))
    );
  };

  if (restLoading || loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand/30 border-t-brand rounded-full animate-spin" />
      </div>
    );
  }

  const finalPrice = (p: Product) =>
    p.discount_price && p.discount_price > 0 ? p.discount_price : p.price;
  const discountPercent = (p: Product) =>
    p.discount_price && p.discount_price > 0
      ? Math.round(((p.price - p.discount_price) / p.price) * 100)
      : 0;

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
          <h1 className="text-2xl md:text-3xl font-bold text-ink">Menu</h1>
          <p className="text-sm text-ink-muted mt-1">
            Manage your restaurant products
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={openAddModal}
          className="bg-brand hover:bg-brand-dark text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-brand transition flex items-center justify-center gap-2"
        >
          <Plus size={16} />
          Add Product
        </motion.button>
      </motion.div>

      {/* Stats */}
      <motion.div
        variants={fadeInUp}
        className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
      >
        <StatBox label="Total Products" value={products.length} />
        <StatBox
          label="Available"
          value={products.filter((p) => p.available).length}
          color="green"
        />
        <StatBox
          label="Featured"
          value={products.filter((p) => p.featured).length}
          color="amber"
        />
        <StatBox
          label="On Discount"
          value={
            products.filter((p) => p.discount_price && p.discount_price > 0)
              .length
          }
          color="red"
        />
      </motion.div>

      {/* Filters */}
      <motion.div
        variants={fadeInUp}
        className="bg-surface rounded-2xl border border-line p-4 shadow-soft space-y-4"
      >
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
            size={18}
          />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-line rounded-xl py-3 pl-10 pr-4 text-sm text-ink placeholder:text-ink-muted/50 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <button
            onClick={() => setCategoryFilter("all")}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition ${
              categoryFilter === "all"
                ? "bg-brand text-white shadow-brand"
                : "bg-cream text-ink-muted hover:text-ink hover:bg-brand/10"
            }`}
          >
            All ({products.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                categoryFilter === cat.id
                  ? "bg-brand text-white shadow-brand"
                  : "bg-cream text-ink-muted hover:text-ink hover:bg-brand/10"
              }`}
            >
              <span>{cat.icon || "🍔"}</span>
              {cat.name} ({products.filter((p) => p.category_id === cat.id).length})
            </button>
          ))}
        </div>
      </motion.div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full bg-surface rounded-2xl border border-line p-12 text-center shadow-soft"
            >
              <div className="w-16 h-16 bg-brand/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ImageIcon size={24} className="text-brand" />
              </div>
              <p className="text-ink-muted font-medium mb-1">No products found</p>
              <p className="text-xs text-ink-muted/70 mb-4">
                Add your first product to get started
              </p>
              <button
                onClick={openAddModal}
                className="bg-brand hover:bg-brand-dark text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-brand transition inline-flex items-center gap-2"
              >
                <Plus size={16} />
                Add Product
              </button>
            </motion.div>
          ) : (
            filteredProducts.map((product, i) => {
              const price = finalPrice(product);
              const discount = discountPercent(product);

              return (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.03 }}
                  className={`bg-surface rounded-2xl border overflow-hidden shadow-soft transition ${
                    product.available
                      ? "border-line hover:border-brand/40 hover:shadow-brand"
                      : "border-red-500/20 opacity-60"
                  }`}
                >
                  <div className="relative h-40 bg-gradient-to-br from-brand/10 to-brand/5 flex items-center justify-center overflow-hidden">
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <ImageIcon size={40} className="text-brand/40" />
                    )}
                    {discount > 0 && (
                      <span className="absolute top-2 left-2 bg-amber-custom text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg z-10">
                        {discount}% OFF
                      </span>
                    )}
                    {product.featured && (
                      <span className="absolute top-2 right-2 bg-brand text-white p-1.5 rounded-full shadow-lg z-10">
                        <Flame size={14} />
                      </span>
                    )}
                    {!product.available && (
                      <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-10">
                        <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                          Unavailable
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-sm mb-1 truncate text-ink">
                      {product.name}
                    </h3>
                    <p className="text-xs text-ink-muted mb-3 line-clamp-2">
                      {product.description || "—"}
                    </p>

                    <div className="flex items-baseline gap-2 mb-3">
                      {discount > 0 && (
                        <span className="text-xs text-ink-muted line-through">
                          ${product.price}
                        </span>
                      )}
                      <span className="text-lg font-bold text-brand flex items-center">
                        <DollarSign size={14} />
                        {price}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openEditModal(product)}
                        className="flex-1 bg-cream hover:bg-brand/10 py-2 rounded-lg text-xs font-semibold text-ink-muted hover:text-brand transition flex items-center justify-center gap-1"
                      >
                        <Edit size={14} />
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          toggleAvailable(product.id, product.available)
                        }
                        className={`p-2 rounded-lg transition ${
                          product.available
                            ? "bg-cream hover:bg-amber-custom/10 text-ink-muted hover:text-amber-custom"
                            : "bg-green-500/10 text-green-600"
                        }`}
                      >
                        {product.available ? (
                          <EyeOff size={14} />
                        ) : (
                          <Eye size={14} />
                        )}
                      </button>
                      <button
                        onClick={() =>
                          toggleFeatured(product.id, product.featured)
                        }
                        className={`p-2 rounded-lg transition ${
                          product.featured
                            ? "bg-amber-custom/10 text-amber-custom"
                            : "bg-cream hover:bg-amber-custom/10 text-ink-muted hover:text-amber-custom"
                        }`}
                      >
                        {product.featured ? (
                          <Star size={14} fill="currentColor" />
                        ) : (
                          <StarOff size={14} />
                        )}
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(product)}
                        className="p-2 rounded-lg bg-cream hover:bg-red-500/10 text-ink-muted hover:text-red-600 transition"
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-surface rounded-3xl border border-line w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="p-5 border-b border-line flex items-center justify-between sticky top-0 bg-surface z-10">
                <h2 className="text-lg font-bold text-ink">
                  {editingProduct ? "Edit Product" : "Add New Product"}
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

                {/* Image Upload */}
                <div>
                  <label className="block text-xs text-ink-muted mb-2 font-semibold">
                    Product Image
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="relative h-40 bg-cream border-2 border-dashed border-line rounded-xl flex items-center justify-center cursor-pointer hover:border-brand transition overflow-hidden"
                  >
                    {uploading ? (
                      <div className="text-center">
                        <Loader2
                          size={24}
                          className="animate-spin text-brand mx-auto mb-2"
                        />
                        <p className="text-xs text-ink-muted">Uploading...</p>
                      </div>
                    ) : formData.image_url ? (
                      <Image
                        src={formData.image_url}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <Upload
                          size={24}
                          className="text-ink-muted mx-auto mb-2"
                        />
                        <p className="text-xs text-ink-muted">
                          Click to upload image
                        </p>
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                    className="hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs text-ink-muted mb-2 font-semibold">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Classic Burger"
                    className="w-full bg-white border border-line rounded-xl py-3 px-4 text-sm text-ink placeholder:text-ink-muted/50 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs text-ink-muted mb-2 font-semibold">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={2}
                    placeholder="Beef, cheese, lettuce, tomato"
                    className="w-full bg-white border border-line rounded-xl py-3 px-4 text-sm text-ink placeholder:text-ink-muted/50 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-ink-muted mb-2 font-semibold">
                    Category
                  </label>
                  <select
                    value={formData.category_id || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category_id: Number(e.target.value),
                      })
                    }
                    className="w-full bg-white border border-line rounded-xl py-3 px-4 text-sm text-ink focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition"
                  >
                    <option value="">Select category...</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-ink-muted mb-2 font-semibold">
                      Price ($) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          price: Number(e.target.value),
                        })
                      }
                      placeholder="0"
                      className="w-full bg-white border border-line rounded-xl py-3 px-4 text-sm text-ink focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-ink-muted mb-2 font-semibold">
                      Discount ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.discount_price || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          discount_price: Number(e.target.value),
                        })
                      }
                      placeholder="0"
                      className="w-full bg-white border border-line rounded-xl py-3 px-4 text-sm text-ink focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() =>
                      setFormData({
                        ...formData,
                        available: !formData.available,
                      })
                    }
                    className={`p-3 rounded-xl border text-sm font-semibold transition flex items-center justify-between ${
                      formData.available
                        ? "bg-green-500/10 border-green-500/30 text-green-600"
                        : "bg-cream border-line text-ink-muted"
                    }`}
                  >
                    Available
                    <div
                      className={`w-8 h-4 rounded-full transition ${
                        formData.available ? "bg-green-500" : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`w-3 h-3 bg-white rounded-full mt-0.5 transition-transform ${
                          formData.available
                            ? "translate-x-4"
                            : "translate-x-0.5"
                        }`}
                      />
                    </div>
                  </button>
                  <button
                    onClick={() =>
                      setFormData({ ...formData, featured: !formData.featured })
                    }
                    className={`p-3 rounded-xl border text-sm font-semibold transition flex items-center justify-between ${
                      formData.featured
                        ? "bg-amber-custom/10 border-amber-custom/30 text-amber-custom"
                        : "bg-cream border-line text-ink-muted"
                    }`}
                  >
                    Featured
                    <div
                      className={`w-8 h-4 rounded-full transition ${
                        formData.featured ? "bg-amber-custom" : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`w-3 h-3 bg-white rounded-full mt-0.5 transition-transform ${
                          formData.featured
                            ? "translate-x-4"
                            : "translate-x-0.5"
                        }`}
                      />
                    </div>
                  </button>
                </div>
              </div>

              <div className="p-5 border-t border-line flex gap-3 sticky bottom-0 bg-surface">
                <button
                  onClick={() => setModalOpen(false)}
                  className="flex-1 bg-cream hover:bg-brand/10 py-3 rounded-xl text-sm font-semibold text-ink transition"
                >
                  Cancel
                </button>
                <button
                  onClick={saveProduct}
                  disabled={
                    !formData.name || !formData.price || saving || uploading
                  }
                  className={`flex-1 py-3 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2 ${
                    formData.name && formData.price && !saving && !uploading
                      ? "bg-brand hover:bg-brand-dark text-white shadow-brand"
                      : "bg-cream text-ink-muted cursor-not-allowed"
                  }`}
                >
                  <Save size={16} />
                  {saving
                    ? "Saving..."
                    : editingProduct
                      ? "Save Changes"
                      : "Add Product"}
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
                Delete Product?
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

function StatBox({
  label,
  value,
  color = "brand",
}: {
  label: string;
  value: number;
  color?: "brand" | "green" | "amber" | "red";
}) {
  const colors = {
    brand: "text-brand",
    green: "text-green-600",
    amber: "text-amber-custom",
    red: "text-red-600",
  };
  return (
    <div className="bg-surface rounded-2xl p-4 border border-line shadow-soft">
      <p className="text-xs text-ink-muted uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className={`text-2xl font-bold ${colors[color]}`}>{value}</p>
    </div>
  );
}