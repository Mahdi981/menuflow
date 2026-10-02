"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Store,
  Palette,
  Clock,
  CreditCard,
  Bell,
  MessageCircle,
  Save,
  Upload,
  Check,
} from "lucide-react";

const tabs = [
  { id: "business", name: "Business", icon: Store },
  { id: "branding", name: "Branding", icon: Palette },
  { id: "hours", name: "Working Hours", icon: Clock },
  { id: "payments", name: "Payments", icon: CreditCard },
  { id: "notifications", name: "Notifications", icon: Bell },
  { id: "whatsapp", name: "WhatsApp", icon: MessageCircle },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("business");
  const [saved, setSaved] = useState(false);
  const [businessName, setBusinessName] = useState("Snack");
  const [slug, setSlug] = useState("snack");
  const [primaryColor, setPrimaryColor] = useState("#DC2626");
  const [secondaryColor, setSecondaryColor] = useState("#F59E0B");
  const [whatsapp, setWhatsapp] = useState("+961 70 053 406");
  const [deliveryFee, setDeliveryFee] = useState(2);
  const [payments, setPayments] = useState({
    cash: true,
    whish: true,
    card: false,
    omt: true,
  });
  const [notifications, setNotifications] = useState({
    newOrders: true,
    cancelled: true,
    newCustomers: false,
    dailySummary: true,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-6">
      {/* Header */}
      <motion.div variants={fadeInUp} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Settings</h1>
          <p className="text-sm text-gray-400">Manage your restaurant configuration</p>
        </div>
        <button
          onClick={handleSave}
          className="bg-gradient-to-r from-red-600 to-amber-500 px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition flex items-center justify-center gap-2"
        >
          {saved ? <Check size={16} /> : <Save size={16} />}
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <motion.div variants={fadeInUp} className="lg:col-span-1">
          <div className="bg-[#0F0F0F] rounded-2xl border border-white/10 p-2 space-y-1 lg:sticky lg:top-24">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-red-600/20 to-amber-500/10 text-amber-400 border border-red-600/30"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <tab.icon size={16} />
                {tab.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div variants={fadeInUp} className="lg:col-span-3 space-y-6">
          {/* Business Profile */}
          {activeTab === "business" && (
            <div className="bg-[#0F0F0F] rounded-2xl border border-white/10 p-6 space-y-5">
              <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                <div className="w-10 h-10 bg-gradient-to-br from-red-600/20 to-amber-500/20 rounded-xl flex items-center justify-center">
                  <Store size={20} className="text-amber-400" />
                </div>
                <div>
                  <h2 className="font-bold">Business Profile</h2>
                  <p className="text-xs text-gray-400">Your restaurant's basic information</p>
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-2 font-semibold">Restaurant Logo</label>
                <div className="flex items-center gap-4">
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold text-white transition-all duration-300"
                    style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
                  >
                    {businessName.charAt(0) || "S"}
                  </div>
                  <button className="bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-white/10 transition flex items-center gap-2">
                    <Upload size={16} />
                    Upload Logo
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-2 font-semibold">Restaurant Name</label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-red-600/50 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-2 font-semibold">Slug (URL)</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-red-600/50 transition"
                  />
                </div>
              </div>

              {/* Live Preview */}
              <div className="bg-white/5 rounded-2xl p-4">
                <p className="text-xs text-gray-400 mb-3">Live Preview</p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white transition-all duration-300"
                    style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
                  >
                    {businessName.charAt(0) || "S"}
                  </div>
                  <div>
                    <p className="font-bold">{businessName || "Restaurant Name"}</p>
                    <p className="text-xs text-gray-400">menuflow.app/r/{slug || "slug"}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Branding */}
          {activeTab === "branding" && (
            <div className="bg-[#0F0F0F] rounded-2xl border border-white/10 p-6 space-y-5">
              <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                <div className="w-10 h-10 bg-gradient-to-br from-red-600/20 to-amber-500/20 rounded-xl flex items-center justify-center">
                  <Palette size={20} className="text-amber-400" />
                </div>
                <div>
                  <h2 className="font-bold">Branding</h2>
                  <p className="text-xs text-gray-400">Customize your restaurant's colors and style</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-2 font-semibold">Primary Color</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-12 h-12 rounded-xl bg-transparent cursor-pointer"
                    />
                    <input
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-red-600/50 transition"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-2 font-semibold">Secondary Color</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="w-12 h-12 rounded-xl bg-transparent cursor-pointer"
                    />
                    <input
                      type="text"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-red-600/50 transition"
                    />
                  </div>
                </div>
              </div>

              {/* Live Preview */}
              <div className="bg-white/5 rounded-2xl p-4">
                <p className="text-xs text-gray-400 mb-3">Live Preview</p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white transition-all duration-300"
                    style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
                  >
                    {businessName.charAt(0) || "S"}
                  </div>
                  <div>
                    <p className="font-bold">{businessName || "Restaurant Name"}</p>
                    <div
                      className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
                      style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
                    >
                      Branded
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Working Hours */}
          {activeTab === "hours" && (
            <div className="bg-[#0F0F0F] rounded-2xl border border-white/10 p-6 space-y-5">
              <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                <div className="w-10 h-10 bg-gradient-to-br from-red-600/20 to-amber-500/20 rounded-xl flex items-center justify-center">
                  <Clock size={20} className="text-amber-400" />
                </div>
                <div>
                  <h2 className="font-bold">Working Hours</h2>
                  <p className="text-xs text-gray-400">Set your restaurant's opening hours</p>
                </div>
              </div>

              <div className="space-y-3">
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                  <div key={day} className="flex flex-wrap items-center gap-3 bg-white/5 rounded-xl p-3">
                    <span className="w-24 text-sm font-semibold">{day}</span>
                    <input
                      type="time"
                      defaultValue="10:00"
                      className="bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-red-600/50 transition"
                    />
                    <span className="text-gray-500 text-sm">to</span>
                    <input
                      type="time"
                      defaultValue="22:00"
                      className="bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-red-600/50 transition"
                    />
                    <label className="flex items-center gap-2 ml-auto text-sm text-gray-400 cursor-pointer">
                      <input type="checkbox" defaultChecked className="accent-amber-500" />
                      Open
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payments */}
          {activeTab === "payments" && (
            <div className="bg-[#0F0F0F] rounded-2xl border border-white/10 p-6 space-y-5">
              <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                <div className="w-10 h-10 bg-gradient-to-br from-red-600/20 to-amber-500/20 rounded-xl flex items-center justify-center">
                  <CreditCard size={20} className="text-amber-400" />
                </div>
                <div>
                  <h2 className="font-bold">Payment Methods</h2>
                  <p className="text-xs text-gray-400">Manage accepted payment options</p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { key: "cash" as const, name: "Cash on Delivery", desc: "Accept cash payments" },
                  { key: "whish" as const, name: "Whish Money", desc: "Lebanese digital wallet" },
                  { key: "card" as const, name: "Credit Card", desc: "Visa, Mastercard" },
                  { key: "omt" as const, name: "OMT", desc: "Lebanese money transfer" },
                ].map((method) => (
                  <button
                    key={method.key}
                    onClick={() => setPayments({ ...payments, [method.key]: !payments[method.key] })}
                    className="w-full flex items-center justify-between bg-white/5 hover:bg-white/10 rounded-xl p-4 transition text-left"
                  >
                    <div>
                      <p className="text-sm font-semibold">{method.name}</p>
                      <p className="text-xs text-gray-400">{method.desc}</p>
                    </div>
                    <div className={`w-10 h-6 rounded-full transition relative ${payments[method.key] ? "bg-emerald-500" : "bg-gray-600"}`}>
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${payments[method.key] ? "left-5" : "left-1"}`}></div>
                    </div>
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-2 font-semibold">Default Delivery Fee ($)</label>
                <input
                  type="number"
                  value={deliveryFee}
                  onChange={(e) => setDeliveryFee(Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-red-600/50 transition"
                />
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeTab === "notifications" && (
            <div className="bg-[#0F0F0F] rounded-2xl border border-white/10 p-6 space-y-5">
              <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                <div className="w-10 h-10 bg-gradient-to-br from-red-600/20 to-amber-500/20 rounded-xl flex items-center justify-center">
                  <Bell size={20} className="text-amber-400" />
                </div>
                <div>
                  <h2 className="font-bold">Notifications</h2>
                  <p className="text-xs text-gray-400">Choose how you receive alerts</p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { key: "newOrders" as const, name: "New Orders", desc: "Get notified when a new order arrives" },
                  { key: "cancelled" as const, name: "Cancelled Orders", desc: "When a customer cancels an order" },
                  { key: "newCustomers" as const, name: "New Customers", desc: "When a new customer places an order" },
                  { key: "dailySummary" as const, name: "Daily Summary", desc: "Receive a daily report at 11 PM" },
                ].map((notif) => (
                  <button
                    key={notif.key}
                    onClick={() => setNotifications({ ...notifications, [notif.key]: !notifications[notif.key] })}
                    className="w-full flex items-center justify-between bg-white/5 hover:bg-white/10 rounded-xl p-4 transition text-left"
                  >
                    <div>
                      <p className="text-sm font-semibold">{notif.name}</p>
                      <p className="text-xs text-gray-400">{notif.desc}</p>
                    </div>
                    <div className={`w-10 h-6 rounded-full transition relative ${notifications[notif.key] ? "bg-emerald-500" : "bg-gray-600"}`}>
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${notifications[notif.key] ? "left-5" : "left-1"}`}></div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* WhatsApp */}
          {activeTab === "whatsapp" && (
            <div className="bg-[#0F0F0F] rounded-2xl border border-white/10 p-6 space-y-5">
              <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                <div className="w-10 h-10 bg-gradient-to-br from-red-600/20 to-amber-500/20 rounded-xl flex items-center justify-center">
                  <MessageCircle size={20} className="text-amber-400" />
                </div>
                <div>
                  <h2 className="font-bold">WhatsApp Integration</h2>
                  <p className="text-xs text-gray-400">Connect your WhatsApp for order updates</p>
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-2 font-semibold">WhatsApp Number</label>
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-red-600/50 transition"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-2 font-semibold">Order Confirmation Message</label>
                <textarea
                  defaultValue="Thank you for your order! We'll contact you shortly."
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-red-600/50 transition resize-none"
                />
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span className="text-sm font-semibold text-emerald-400">WhatsApp Connected</span>
                </div>
                <p className="text-xs text-emerald-400/70">Your restaurant will receive order notifications on WhatsApp</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}