"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import {
  UtensilsCrossed,
  Store,
  Phone,
  MapPin,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

export default function SetupPage() {
  const router = useRouter();
  const supabase = createClient();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. تأكد من المستخدم
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // 2. أنشئ المطعم عبر API Route (service role)
      const res = await fetch("/api/restaurants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug,
          phone,
          address,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error ?? "Failed to create restaurant");
      }

      const restaurant = json.restaurant;

      // 3. أنشئ الاشتراك (لو الجدول موجود، وإلا تجاهل الخطأ)
      try {
        await supabase.from("subscriptions").insert({
          restaurant_id: restaurant.id,
          plan: "starter",
          status: "active",
          max_orders: 5,
          max_products: 10,
          max_categories: 1,
          order_count: 0,
        });
      } catch (subErr) {
        // نتجاهل خطأ الاشتراك — مش حرج
        console.warn("Subscription insert skipped:", subErr);
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center p-4">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-red-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 -right-40 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-amber-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <UtensilsCrossed size={24} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Setup your restaurant</h1>
          <p className="text-gray-400 text-sm">Tell us about your business</p>
        </div>

        <div className="bg-[#0F0F0F] rounded-3xl border border-white/10 p-6 md:p-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-4 flex items-start gap-2">
              <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
              <p className="text-xs text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 mb-2 font-semibold">
                Restaurant Name *
              </label>
              <div className="relative">
                <Store
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                  size={18}
                />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setSlug(
                      e.target.value
                        .toLowerCase()
                        .replace(/\s+/g, "-")
                        .replace(/[^a-z0-9-]/g, "")
                    );
                  }}
                  placeholder="Your Restaurant"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-red-600/50 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-2 font-semibold">
                URL Slug *
              </label>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3">
                <span className="text-xs text-gray-500 shrink-0">/r/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) =>
                    setSlug(
                      e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "")
                    )
                  }
                  placeholder="snack"
                  required
                  className="flex-1 bg-transparent py-3 text-sm focus:outline-none"
                />
              </div>
              <p className="text-[10px] text-gray-500 mt-1">
                Your menu will be at: /r/{slug || "your-slug"}
              </p>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-2 font-semibold">
                Phone
              </label>
              <div className="relative">
                <Phone
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                  size={18}
                />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+961 70 053 406"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-red-600/50 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-2 font-semibold">
                Address
              </label>
              <div className="relative">
                <MapPin
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                  size={18}
                />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Your City"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-red-600/50 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !name || !slug}
              className="w-full bg-gradient-to-r from-red-600 to-amber-500 py-3.5 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? "Creating..." : "Create Restaurant"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>
        </div>
      </motion.div>
    </main>
  );
}