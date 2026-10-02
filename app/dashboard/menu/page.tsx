"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
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
  DollarSign,
  Clock,
} from "lucide-react";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  discount: number;
  category: string;
  available: boolean;
  featured: boolean;
  image: string;
  prepTime: number;
};

const initialProducts: Product[] = [
  { id: 1, name: "Classic Burger", description: "Beef, cheese, lettuce, tomato", price: 8, discount: 5, category: "Burgers", available: true, featured: true, image: "🍔", prepTime: 10 },
  { id: 2, name: "Double Burger", description: "Two beef patties, double cheese", price: 14, discount: 0, category: "Burgers", available: true, featured: true, image: "🍔", prepTime: 15 },
  { id: 3, name: "Cheese Pizza", description: "Mozzarella, tomato sauce, basil", price: 12, discount: 0, category: "Pizza", available: true, featured: true, image: "🍕", prepTime: 20 },
  { id: 4, name: "Pepperoni Pizza", description: "Mozzarella, pepperoni, tomato", price: 14, discount: 0, category: "Pizza", available: true, featured: false, image: "🍕", prepTime: 20 },
  { id: 5, name: "Fried Chicken", description: "Crispy, spicy, with sauce", price: 10, discount: 7, category: "Chicken", available: true, featured: false, image: "🍗", prepTime: 15 },
  { id: 6, name: "Chicken Wings", description: "Spicy, grilled, 6 pieces", price: 9, discount: 0, category: "Chicken", available: false, featured: false, image: "🍗", prepTime: 12 },
  { id: 7, name: "Coca Cola", description: "Ice cold, 330ml", price: 3, discount: 0, category: "Drinks", available: true, featured: false, image: "🥤", prepTime: 1 },
  { id: 8, name: "Orange Juice", description: "Fresh squeezed, 400ml", price: 4, discount: 0, category: "Drinks", available: true, featured: false, image: "🧃", prepTime: 3 },
  { id: 9, name: "Chocolate Cake", description: "Rich, moist, with fudge", price: 6, discount: 4, category: "Desserts", available: true, featured: true, image: "🍰", prepTime: 2 },
];

const categories = ["All", "Burgers", "Pizza", "Chicken", "Drinks", "Desserts"];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

export default function MenuPage() {
  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    description: "",
    price: 0,
    discount: 0,
    category: "Burgers",
    available: true,
    featured: false,
    image: "🍔",
    prepTime: 10,
  });

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "All" || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      description: "",
      price: 0,
      discount: 0,
      category: "Burgers",
      available: true,
      featured: false,
      image: "🍔",
      prepTime: 10,
    });
    setModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData(product);
    setModalOpen(true);
  };

  const saveProduct = () => {
    if (!formData.name || !formData.price) return;

    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? { ...p, ...formData } as Product : p))
      );
    } else {
      const newProduct: Product = {
        id: Math.max(...products.map((p) => p.id)) + 1,
        name: formData.name || "",
        description: formData.description || "",
        price: formData.price || 0,
        discount: formData.discount || 0,
        category: formData.category || "Burgers",
        available: formData.available ?? true,
        featured: formData.featured ?? false,
        image: formData.image || "🍔",
        prepTime: formData.prepTime || 10,
      };
      setProducts((prev) => [newProduct, ...prev]);
    }
    setModalOpen(false);
  };

  const deleteProduct = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const toggleAvailable = (id: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, available: !p.available } : p))
    );
  };

  const toggleFeatured = (id: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, featured: !p.featured } : p))
    );
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={stagger}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={fadeInUp} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Menu</h1>
          <p className="text-sm text-gray-400">Manage your restaurant products</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={openAddModal}
          className="bg-gradient-to-r from-red-600 to-amber-500 px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition flex items-center justify-center gap-2"
        >
          <Plus size={16} />
          Add Product
        </motion.button>
      </motion.div>

      {/* Stats */}
      <motion.div variants={fadeInUp} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#0F0F0F] rounded-2xl p-4 border border-white/10">
          <p className="text-xs text-gray-400 mb-1">Total Products</p>
          <p className="text-2xl font-bold">{products.length}</p>
        </div>
        <div className="bg-[#0F0F0F] rounded-2xl p-4 border border-white/10">
          <p className="text-xs text-gray-400 mb-1">Available</p>
          <p className="text-2xl font-bold text-emerald-400">{products.filter((p) => p.available).length}</p>
        </div>
        <div className="bg-[#0F0F0F] rounded-2xl p-4 border border-white/10">
          <p className="text-xs text-gray-400 mb-1">Featured</p>
          <p className="text-2xl font-bold text-amber-400">{products.filter((p) => p.featured).length}</p>
        </div>
        <div className="bg-[#0F0F0F] rounded-2xl p-4 border border-white/10">
          <p className="text-xs text-gray-400 mb-1">On Discount</p>
          <p className="text-2xl font-bold text-red-400">{products.filter((p) => p.discount > 0).length}</p>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={fadeInUp} className="bg-[#0F0F0F] rounded-2xl border border-white/10 p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-red-600/50 transition"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                categoryFilter === cat
                  ? "bg-gradient-to-r from-red-600 to-amber-500 text-white"
                  : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              {cat}
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
              className="col-span-full bg-[#0F0F0F] rounded-2xl border border-white/10 p-12 text-center"
            >
              <p className="text-gray-400 mb-1">No products found</p>
              <p className="text-xs text-gray-600">Try adjusting your filters</p>
            </motion.div>
          ) : (
            filteredProducts.map((product, i) => {
              const finalPrice = product.discount > 0 ? product.discount : product.price;
              const discountPercent = product.discount > 0
                ? Math.round(((product.price - product.discount) / product.price) * 100)
                : 0;

              return (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05 }}
                  className={`bg-[#0F0F0F] rounded-2xl border overflow-hidden transition ${
                    product.available ? "border-white/10 hover:border-amber-500/40" : "border-red-500/20 opacity-60"
                  }`}
                >
                  {/* Image Area */}
                  <div className="relative h-32 bg-gradient-to-br from-red-600/10 to-amber-500/10 flex items-center justify-center">
                    <span className="text-6xl">{product.image}</span>
                    {discountPercent > 0 && (
                      <span className="absolute top-2 left-2 bg-gradient-to-r from-red-600 to-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {discountPercent}% OFF
                      </span>
                    )}
                    {product.featured && (
                      <span className="absolute top-2 right-2 bg-amber-500/20 backdrop-blur-md text-amber-400 p-1.5 rounded-full">
                        <Flame size={14} />
                      </span>
                    )}
                    {!product.available && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                        <span className="bg-red-500/20 border border-red-500/50 text-red-400 text-xs font-bold px-3 py-1 rounded-full">
                          Unavailable
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-bold text-sm">{product.name}</h3>
                      <span className="text-[10px] text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">
                        {product.category}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mb-3 line-clamp-2">{product.description}</p>

                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {product.prepTime} min
                      </span>
                    </div>

                    <div className="flex items-baseline gap-2 mb-3">
                      {product.discount > 0 && (
                        <span className="text-xs text-gray-500 line-through">${product.price}</span>
                      )}
                      <span className="text-lg font-bold text-amber-400 flex items-center">
                        <DollarSign size={14} />
                        {finalPrice}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openEditModal(product)}
                        className="flex-1 bg-white/5 hover:bg-white/10 py-2 rounded-lg text-xs font-semibold text-gray-300 hover:text-white transition flex items-center justify-center gap-1"
                      >
                        <Edit size={14} />
                        Edit
                      </button>
                      <button
                        onClick={() => toggleAvailable(product.id)}
                        className={`p-2 rounded-lg transition ${
                          product.available
                            ? "bg-white/5 hover:bg-amber-500/20 text-gray-400 hover:text-amber-400"
                            : "bg-emerald-500/20 text-emerald-400"
                        }`}
                        title={product.available ? "Hide" : "Show"}
                      >
                        {product.available ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      <button
                        onClick={() => toggleFeatured(product.id)}
                        className={`p-2 rounded-lg transition ${
                          product.featured
                            ? "bg-amber-500/20 text-amber-400"
                            : "bg-white/5 hover:bg-amber-500/20 text-gray-400"
                        }`}
                        title={product.featured ? "Unfeature" : "Feature"}
                      >
                        {product.featured ? <Star size={14} fill="currentColor" /> : <StarOff size={14} />}
                      </button>
                      <button
                        onClick={() => deleteProduct(product.id)}
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
          <>
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
                className="bg-[#0F0F0F] rounded-3xl border border-white/10 w-full max-w-lg max-h-[90vh] overflow-y-auto"
              >
                {/* Modal Header */}
                <div className="p-5 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#0F0F0F] z-10">
                  <h2 className="text-lg font-bold">
                    {editingProduct ? "Edit Product" : "Add New Product"}
                  </h2>
                  <button
                    onClick={() => setModalOpen(false)}
                    className="p-2 rounded-lg hover:bg-white/10 transition"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-5 space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs text-gray-400 mb-2 font-semibold">Product Name *</label>
                    <input
                      type="text"
                      value={formData.name || ""}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Classic Burger"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-red-600/50 transition"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs text-gray-400 mb-2 font-semibold">Description</label>
                    <textarea
                      value={formData.description || ""}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Brief description..."
                      rows={2}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-red-600/50 transition resize-none"
                    />
                  </div>

                  {/* Price + Discount */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-400 mb-2 font-semibold">Price ($) *</label>
                      <input
                        type="number"
                        value={formData.price || ""}
                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                        placeholder="0"
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-red-600/50 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-2 font-semibold">Discount ($)</label>
                      <input
                        type="number"
                        value={formData.discount || ""}
                        onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
                        placeholder="0"
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-red-600/50 transition"
                      />
                    </div>
                  </div>

                  {/* Category + Prep Time */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-400 mb-2 font-semibold">Category</label>
                      <select
                        value={formData.category || "Burgers"}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-red-600/50 transition"
                      >
                        {categories.slice(1).map((c) => (
                          <option key={c} value={c} className="bg-[#0F0F0F]">
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-2 font-semibold">Prep Time (min)</label>
                      <input
                        type="number"
                        value={formData.prepTime || ""}
                        onChange={(e) => setFormData({ ...formData, prepTime: Number(e.target.value) })}
                        placeholder="10"
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-red-600/50 transition"
                      />
                    </div>
                  </div>

                  {/* Image */}
                  <div>
                    <label className="block text-xs text-gray-400 mb-2 font-semibold">Image (Emoji)</label>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {["🍔", "🍕", "🍗", "🥤", "🧃", "🍰", "🌮", "🍟", "🥗", "🍦"].map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => setFormData({ ...formData, image: emoji })}
                          className={`w-12 h-12 rounded-xl text-2xl flex items-center justify-center transition ${
                            formData.image === emoji
                              ? "bg-gradient-to-br from-red-600/30 to-amber-500/30 border-2 border-amber-500"
                              : "bg-white/5 hover:bg-white/10 border-2 border-transparent"
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Toggles */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setFormData({ ...formData, available: !formData.available })}
                      className={`p-3 rounded-xl border text-sm font-semibold transition flex items-center justify-between ${
                        formData.available
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                          : "bg-white/5 border-white/10 text-gray-400"
                      }`}
                    >
                      Available
                      <div className={`w-8 h-4 rounded-full transition ${formData.available ? "bg-emerald-500" : "bg-gray-600"}`}>
                        <div className={`w-3 h-3 bg-white rounded-full mt-0.5 transition-transform ${formData.available ? "translate-x-4" : "translate-x-0.5"}`}></div>
                      </div>
                    </button>
                    <button
                      onClick={() => setFormData({ ...formData, featured: !formData.featured })}
                      className={`p-3 rounded-xl border text-sm font-semibold transition flex items-center justify-between ${
                        formData.featured
                          ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                          : "bg-white/5 border-white/10 text-gray-400"
                      }`}
                    >
                      Featured
                      <div className={`w-8 h-4 rounded-full transition ${formData.featured ? "bg-amber-500" : "bg-gray-600"}`}>
                        <div className={`w-3 h-3 bg-white rounded-full mt-0.5 transition-transform ${formData.featured ? "translate-x-4" : "translate-x-0.5"}`}></div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-5 border-t border-white/10 flex gap-3 sticky bottom-0 bg-[#0F0F0F]">
                  <button
                    onClick={() => setModalOpen(false)}
                    className="flex-1 bg-white/5 hover:bg-white/10 py-3 rounded-xl text-sm font-semibold transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveProduct}
                    disabled={!formData.name || !formData.price}
                    className={`flex-1 py-3 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2 ${
                      formData.name && formData.price
                        ? "bg-gradient-to-r from-red-600 to-amber-500 hover:opacity-90"
                        : "bg-white/5 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    <Save size={16} />
                    {editingProduct ? "Save Changes" : "Add Product"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}