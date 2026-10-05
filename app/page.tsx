'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  QrCode,
  ShoppingBag,
  BarChart3,
  Smartphone,
  Zap,
  Shield,
  ChevronRight,
  Star,
  Check,
  Utensils,
  TrendingUp,
  Clock,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
      {/* ============ NAVBAR ============ */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#0a0a0f]/80 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
              <Utensils size={16} className="text-white" />
            </div>
            <span className="font-bold text-lg">MenuFlow</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
            <a href="#features" className="hover:text-white transition">
              Features
            </a>
            <Link href="/pricing" className="hover:text-white transition">
              Pricing
            </Link>
            <a href="#testimonials" className="hover:text-white transition">
              Testimonials
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="text-sm text-gray-300 hover:text-white transition"
            >
              Login
            </Link>
            <Link
              href="/auth/signup"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold hover:opacity-90 transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ============ HERO ============ */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 px-4 md:px-6 overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-orange-500/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-medium mb-6">
              <Zap size={14} />
              Now with QR ordering
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              Your restaurant,
              <br />
              <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent">
                online in minutes
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
              MenuFlow gives your restaurant a beautiful online menu, QR ordering,
              and a powerful dashboard to manage everything — no coding, no
              commissions.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/auth/signup"
                className="group flex items-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold hover:opacity-90 transition shadow-lg shadow-orange-500/30"
              >
                Start Free
                <ChevronRight
                  size={18}
                  className="group-hover:translate-x-1 transition"
                />
              </Link>
              <Link
                href="/pricing"
                className="flex items-center gap-2 px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition"
              >
                See Pricing
              </Link>
            </div>

            {/* Small trust line */}
            <p className="text-xs text-gray-500 mt-6">
              ✓ No credit card required &nbsp;·&nbsp; ✓ 14-day free trial
              &nbsp;·&nbsp; ✓ Cancel anytime
            </p>
          </motion.div>

          {/* Hero mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-16 md:mt-20 relative"
          >
            <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent p-2 shadow-2xl">
              <div className="rounded-xl bg-[#0f0f14] overflow-hidden">
                {/* Fake browser bar */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/60" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                    <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  </div>
                  <div className="flex-1 mx-auto max-w-sm h-6 rounded-md bg-white/5 text-xs text-gray-500 flex items-center justify-center">
                    meinfina.com/r/your-restaurant
                  </div>
                </div>

                {/* Fake menu preview */}
                <div className="p-6 md:p-10 grid md:grid-cols-3 gap-4">
                  {[
                    { emoji: '🍔', name: 'Classic Burger', price: '$8.50' },
                    { emoji: '🍕', name: 'Margherita Pizza', price: '$12.00' },
                    { emoji: '🥗', name: 'Caesar Salad', price: '$6.50' },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className="rounded-xl border border-white/10 bg-white/[0.02] p-4"
                    >
                      <div className="aspect-square rounded-lg bg-gradient-to-br from-orange-500/20 to-amber-500/10 flex items-center justify-center text-5xl mb-3">
                        {item.emoji}
                      </div>
                      <p className="font-semibold text-sm">{item.name}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-orange-400 font-bold text-sm">
                          {item.price}
                        </span>
                        <div className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center">
                          <span className="text-white text-xs">+</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ FEATURES ============ */}
      <section id="features" className="py-20 md:py-32 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Everything you need
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              From QR menus to real-time orders — MenuFlow has everything your
              restaurant needs to go digital.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: QrCode,
                title: 'QR Menu',
                desc: 'Print a QR code for your tables. Customers scan and order instantly.',
                color: 'orange',
              },
              {
                icon: ShoppingBag,
                title: 'Real-time Orders',
                desc: 'Get notified the second an order comes in. Accept, prepare, deliver.',
                color: 'amber',
              },
              {
                icon: BarChart3,
                title: 'Analytics',
                desc: 'Track sales, top products, and customer trends — all in one place.',
                color: 'blue',
              },
              {
                icon: Smartphone,
                title: 'Mobile-first',
                desc: 'Built for phones. Your customers order in 3 taps or less.',
                color: 'green',
              },
              {
                icon: TrendingUp,
                title: 'Offers & Coupons',
                desc: 'Create discount codes to boost sales and reward loyal customers.',
                color: 'purple',
              },
              {
                icon: Shield,
                title: 'No Commission',
                desc: 'You keep 100%. No hidden fees, no per-order cuts, ever.',
                color: 'red',
              },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-orange-500/30 transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 mb-4 group-hover:scale-110 transition">
                    <Icon size={22} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {f.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="py-20 md:py-32 px-4 md:px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Live in 3 steps
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Create your account',
                desc: 'Sign up with Google or email in seconds.',
                icon: Zap,
              },
              {
                step: '02',
                title: 'Add your menu',
                desc: 'Upload categories and products. Beautiful in minutes.',
                icon: Utensils,
              },
              {
                step: '03',
                title: 'Share your QR',
                desc: 'Print your QR code. Customers order instantly.',
                icon: QrCode,
              },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="relative"
                >
                  <div className="text-6xl font-bold text-orange-500/20 mb-4">
                    {s.step}
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 mb-4">
                    <Icon size={18} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-400">{s.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section
        id="testimonials"
        className="py-20 md:py-32 px-4 md:px-6 border-t border-white/5"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Loved by restaurants
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Ahmad K.',
                role: 'Owner, Burger House',
                quote:
                  'Setup took 20 minutes. Orders started coming in the same day. Incredible.',
              },
              {
                name: 'Sarah M.',
                role: 'Manager, Pizza Corner',
                quote:
                  'The QR menu changed everything. No more printing menus every month.',
              },
              {
                name: 'Omar H.',
                role: 'Owner, Sushi Time',
                quote:
                  'Finally an affordable solution without the crazy commissions.',
              },
            ].map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-white/[0.02] border border-white/10"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star
                      key={j}
                      size={14}
                      className="fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-300 leading-relaxed mb-6">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center font-bold text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="py-20 md:py-32 px-4 md:px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl p-10 md:p-16 text-center bg-gradient-to-br from-orange-500/20 via-amber-500/10 to-transparent border border-orange-500/30 overflow-hidden"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-orange-500/30 blur-[100px] rounded-full pointer-events-none" />

            <div className="relative">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Ready to go digital?
              </h2>
              <p className="text-gray-300 max-w-lg mx-auto mb-8">
                Join restaurants that trust MenuFlow. Free to start, no credit
                card required.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/auth/signup"
                  className="group flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold hover:opacity-90 transition shadow-lg shadow-orange-500/30"
                >
                  Start Free Trial
                  <ChevronRight
                    size={18}
                    className="group-hover:translate-x-1 transition"
                  />
                </Link>
                <Link
                  href="/pricing"
                  className="flex items-center gap-2 px-8 py-4 rounded-xl bg-white/5 border border-white/10 font-semibold hover:bg-white/10 transition"
                >
                  See Pricing
                </Link>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-xs text-gray-400">
                <span className="flex items-center gap-1.5">
                  <Check size={14} className="text-green-400" />
                  No credit card
                </span>
                <span className="flex items-center gap-1.5">
                  <Check size={14} className="text-green-400" />
                  14-day free trial
                </span>
                <span className="flex items-center gap-1.5">
                  <Check size={14} className="text-green-400" />
                  Cancel anytime
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="border-t border-white/5 py-12 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                  <Utensils size={16} className="text-white" />
                </div>
                <span className="font-bold text-lg">MenuFlow</span>
              </Link>
              <p className="text-sm text-gray-500 max-w-xs">
                Digital menus, QR ordering, and analytics for modern
                restaurants.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>
                  <a href="#features" className="hover:text-white transition">
                    Features
                  </a>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="hover:text-white transition"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Demo
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>
                  <a
                    href="mailto:hello@meinfina.com"
                    className="hover:text-white transition"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} MenuFlow. All rights reserved.
            </p>
            <p className="text-xs text-gray-500 flex items-center gap-1.5">
              <Clock size={12} />
              Built for restaurants, by restaurant lovers
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}