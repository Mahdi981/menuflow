'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import {
  QrCode,
  ShoppingBag,
  BarChart3,
  Smartphone,
  Percent,
  Shield,
  ArrowRight,
  Star,
  Check,
  ChefHat,
  Clock,
  Menu,
  X,
  Bell,
  TrendingUp,
  MessageCircle,
  Palette,
  Lock,
  Plus,
} from 'lucide-react';

const EASE = [0.22, 1, 0.36, 1] as const;

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Testimonials', href: '#testimonials' },
];

// Fade-up عند الظهور بالـ viewport
function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
}) {
  return (
    <Reveal className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
      <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3 text-brand">
        {eyebrow}
      </p>
      <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-balance text-ink">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base md:text-lg text-pretty text-ink-muted">
          {description}
        </p>
      )}
    </Reveal>
  );
}

/* ================================================================== */
/*  NAVBAR                                                             */
/* ================================================================== */

function LandingNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-[background-color,box-shadow,border-color] duration-300 border-b ${
        scrolled || open
          ? 'bg-cream/85 backdrop-blur-xl border-line shadow-soft'
          : 'bg-transparent border-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center shadow-brand">
            <ChefHat size={18} className="text-white" />
          </div>
          <span className="font-bold text-lg text-ink">MenuFlow</span>
        </Link>

        <div className="hidden md:flex items-center gap-1 text-sm">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-3 py-2 rounded-lg text-ink-muted hover:text-ink hover:bg-ink/5 transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/auth/login"
            className="hidden sm:inline-flex px-3 py-2 text-sm font-medium text-ink hover:text-brand transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-ink text-white text-sm font-semibold hover:bg-brand-deeper active:scale-95 transition"
          >
            Start free
          </Link>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="md:hidden p-2 -mr-2 rounded-lg text-ink hover:bg-ink/5 transition"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="md:hidden overflow-hidden"
          >
            <div className="px-4 pb-4 flex flex-col">
              {[...NAV_LINKS, { label: 'Log in', href: '/auth/login' }].map(
                (l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="py-3 text-ink font-medium border-b border-line last:border-0"
                  >
                    {l.label}
                  </Link>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

/* ================================================================== */
/*  HERO — phone mockup                                                */
/* ================================================================== */

const MOCK_ITEMS = [
  { emoji: '🍔', name: 'Classic Smash Burger', desc: 'Double beef, cheddar', price: '$8.50' },
  { emoji: '🍕', name: 'Margherita Pizza', desc: 'San Marzano, basil', price: '$12.00' },
  { emoji: '🥗', name: 'Fattoush Salad', desc: 'Sumac, pomegranate', price: '$6.50' },
];

function PhoneMockup() {
  return (
    <div className="relative mx-auto w-[270px] sm:w-[300px]">
      {/* Frame */}
      <div className="relative rounded-[2.75rem] bg-ink p-2.5 shadow-[0_40px_80px_-20px_rgba(13,66,71,0.45)]">
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-6 bg-ink rounded-b-2xl z-20" />
        <div className="relative rounded-[2.25rem] overflow-hidden bg-cream h-[560px] sm:h-[600px]">
          {/* Cover */}
          <div className="h-28 bg-gradient-to-br from-brand to-brand-deeper relative">
            <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_30%_20%,white_0,transparent_45%)]" />
          </div>
          {/* Info card */}
          <div className="mx-3 -mt-10 relative bg-surface rounded-2xl p-3 shadow-soft border border-line">
            <div className="flex gap-3">
              <div className="w-12 h-12 -mt-6 rounded-xl bg-amber-custom border-2 border-surface shadow-md flex items-center justify-center text-xl">
                🍽️
              </div>
              <div className="min-w-0">
                <p className="font-bold text-sm text-ink">Beit Al Sham</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-green-500/10 text-green-700 text-[9px] font-bold">
                    <span className="w-1 h-1 rounded-full bg-green-500" />
                    Open now
                  </span>
                  <span className="text-[9px] text-ink-muted">10:00 – 23:00</span>
                </div>
              </div>
            </div>
          </div>
          {/* Tabs */}
          <div className="flex gap-1.5 px-3 mt-4">
            {['Popular', 'Burgers', 'Pizza', 'Salads'].map((t, i) => (
              <span
                key={t}
                className={`px-3 py-1.5 rounded-full text-[10px] font-semibold whitespace-nowrap ${
                  i === 0
                    ? 'bg-brand text-white'
                    : 'bg-surface text-ink-muted border border-line'
                }`}
              >
                {t}
              </span>
            ))}
          </div>
          {/* Items */}
          <div className="px-3 mt-3 space-y-2">
            {MOCK_ITEMS.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.12, duration: 0.5, ease: EASE }}
                className="bg-surface rounded-xl p-2 flex gap-2.5 border border-line"
              >
                <div className="w-14 h-14 rounded-lg bg-cream flex items-center justify-center text-2xl shrink-0">
                  {item.emoji}
                </div>
                <div className="flex-1 min-w-0 flex flex-col">
                  <p className="text-[11px] font-bold text-ink truncate">
                    {item.name}
                  </p>
                  <p className="text-[9px] text-ink-muted truncate">
                    {item.desc}
                  </p>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-[11px] font-bold text-brand">
                      {item.price}
                    </span>
                    <span className="w-6 h-6 rounded-lg bg-brand text-white flex items-center justify-center">
                      <Plus size={12} strokeWidth={3} />
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          {/* Cart bar */}
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2, type: 'spring', damping: 22 }}
            className="absolute bottom-4 inset-x-3 rounded-xl bg-gradient-to-r from-brand to-brand-dark text-white px-3 py-2.5 flex items-center justify-between shadow-brand-lg"
          >
            <span className="flex items-center gap-2 text-[11px] font-semibold">
              <ShoppingBag size={14} /> View Cart
            </span>
            <span className="text-[11px] font-bold bg-white/20 rounded-full px-2 py-0.5">
              $20.50
            </span>
          </motion.div>
        </div>
      </div>

      {/* Floating: new order */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0, y: [0, -6, 0] }}
        transition={{
          opacity: { delay: 1.4, duration: 0.5 },
          x: { delay: 1.4, duration: 0.5 },
          y: { delay: 2, duration: 4, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="hidden sm:flex absolute top-24 -left-24 lg:-left-32 items-center gap-3 bg-surface rounded-2xl p-3 pr-4 shadow-xl border border-line"
      >
        <div className="w-9 h-9 rounded-xl bg-brand/10 text-brand flex items-center justify-center">
          <Bell size={16} />
        </div>
        <div>
          <p className="text-xs font-bold text-ink">New order #1042</p>
          <p className="text-[11px] text-ink-muted">Delivery · $24.50</p>
        </div>
      </motion.div>

      {/* Floating: growth */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0, y: [0, 6, 0] }}
        transition={{
          opacity: { delay: 1.6, duration: 0.5 },
          x: { delay: 1.6, duration: 0.5 },
          y: { delay: 2.2, duration: 5, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="hidden sm:block absolute bottom-28 -right-20 lg:-right-28 bg-surface rounded-2xl p-3 shadow-xl border border-line"
      >
        <p className="text-[11px] text-ink-muted">Orders this week</p>
        <div className="flex items-end gap-2 mt-1">
          <p className="text-xl font-bold text-ink">148</p>
          <span className="flex items-center gap-0.5 text-[11px] font-bold text-green-600 mb-1">
            <TrendingUp size={12} /> 32%
          </span>
        </div>
        <div className="flex items-end gap-1 mt-2 h-8">
          {[40, 55, 35, 70, 60, 85, 100].map((h, i) => (
            <span
              key={i}
              className={`w-2.5 rounded-sm ${i === 6 ? 'bg-brand' : 'bg-brand/25'}`}
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/* ================================================================== */
/*  PAGE                                                               */
/* ================================================================== */

const FEATURES = [
  {
    icon: QrCode,
    title: 'QR menu for every table',
    desc: 'Print once, update forever. Prices, photos and availability change instantly — no reprinting.',
    span: 'md:col-span-2',
  },
  {
    icon: Bell,
    title: 'Real-time orders',
    desc: 'Get notified the second an order lands. Accept, prepare, done.',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp confirmation',
    desc: 'Orders arrive straight to your WhatsApp for instant confirmation.',
  },
  {
    icon: Percent,
    title: 'Offers & coupons',
    desc: 'Run discounts and promo codes that bring customers back.',
  },
  {
    icon: Palette,
    title: 'Your brand, your colors',
    desc: 'Pick a theme, add your logo and cover — the menu looks like you.',
  },
  {
    icon: BarChart3,
    title: 'Analytics that matter',
    desc: 'Best sellers, peak hours, revenue and loyal customers — at a glance.',
    span: 'md:col-span-2',
  },
  {
    icon: Smartphone,
    title: 'Built for phones',
    desc: 'Fast on any connection. Customers order in three taps.',
  },
];

const STEPS = [
  {
    title: 'Create your account',
    desc: 'Sign up with email or Google. No card, no contracts.',
  },
  {
    title: 'Build your menu',
    desc: 'Add categories, dishes, photos, sizes and add-ons in minutes.',
  },
  {
    title: 'Share your QR',
    desc: 'Put it on tables, Instagram and WhatsApp. Orders start flowing.',
  },
];

const TESTIMONIALS = [
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
    quote: 'Finally an affordable solution without the crazy commissions.',
  },
];

const STATS = [
  { value: '0%', label: 'Commission per order' },
  { value: '< 10 min', label: 'To publish your menu' },
  { value: '24/7', label: 'Customers can order' },
  { value: '3 taps', label: 'From scan to order' },
];

export default function LandingPage() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-cream text-ink overflow-x-hidden">
        <LandingNav />

        {/* ============ HERO ============ */}
        <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 px-4 md:px-6">
          {/* Background */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden>
            <div className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full bg-brand/15 blur-[120px]" />
            <div className="absolute top-20 -right-40 w-[460px] h-[460px] rounded-full bg-amber-custom/15 blur-[120px]" />
            <div className="absolute inset-0 opacity-60 [background-image:radial-gradient(var(--color-line)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
          </div>

          <div className="relative max-w-6xl mx-auto grid lg:grid-cols-[1.1fr_1fr] gap-14 lg:gap-8 items-center">
            {/* Copy */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
              className="text-center lg:text-left"
            >
              <span className="inline-flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full bg-surface border border-line shadow-soft text-xs font-medium text-ink-muted mb-6">
                <span className="px-2 py-0.5 rounded-full bg-brand text-white text-[10px] font-bold uppercase tracking-wider">
                  New
                </span>
                WhatsApp ordering is live
              </span>

              <h1 className="text-[2.6rem] leading-[1.05] sm:text-6xl lg:text-[4.25rem] font-bold tracking-tight text-balance">
                Your restaurant,{' '}
                <span className="relative text-brand sm:inline-block">
                  online in minutes
                  <svg
                    className="hidden sm:block absolute -bottom-2 left-0 w-full h-3 text-amber-custom"
                    viewBox="0 0 300 12"
                    preserveAspectRatio="none"
                    aria-hidden
                  >
                    <motion.path
                      d="M2 9 C 80 2, 200 2, 298 7"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 0.6, duration: 0.9, ease: EASE }}
                    />
                  </svg>
                </span>
              </h1>

              <p className="mt-7 text-base sm:text-lg md:text-xl text-ink-muted max-w-xl mx-auto lg:mx-0 text-pretty">
                A beautiful digital menu, QR ordering and a dashboard that runs
                your day — without commissions, without code.
              </p>

              <div className="mt-9 flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 max-w-sm sm:max-w-none mx-auto lg:mx-0">
                <Link
                  href="/auth/signup"
                  className="group inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-gradient-to-r from-brand to-brand-dark text-white font-semibold shadow-brand-lg hover:shadow-brand hover:-translate-y-0.5 active:translate-y-0 transition duration-300"
                >
                  Start your free trial
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-surface border border-line text-ink font-semibold hover:border-brand/40 hover:text-brand transition-colors"
                >
                  View pricing
                </Link>
              </div>

              <ul className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-sm text-ink-muted">
                {['14-day free trial', 'No credit card', 'Cancel anytime'].map(
                  (t) => (
                    <li key={t} className="flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-brand/10 text-brand flex items-center justify-center">
                        <Check size={10} strokeWidth={3} />
                      </span>
                      {t}
                    </li>
                  )
                )}
              </ul>
            </motion.div>

            {/* Mockup */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
            >
              <PhoneMockup />
            </motion.div>
          </div>
        </section>

        {/* ============ STATS BAND ============ */}
        <section className="px-4 md:px-6">
          <Reveal className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-px rounded-3xl bg-line border border-line shadow-soft overflow-hidden">
            {STATS.map((s) => (
              <div key={s.label} className="bg-surface p-6 md:p-8 text-center">
                <p className="text-2xl md:text-4xl font-bold text-brand tracking-tight">
                  {s.value}
                </p>
                <p className="mt-1 text-xs md:text-sm text-ink-muted">
                  {s.label}
                </p>
              </div>
            ))}
          </Reveal>
        </section>

        {/* ============ FEATURES (bento) ============ */}
        <section
          id="features"
          className="py-24 md:py-32 px-4 md:px-6 scroll-mt-16"
        >
          <div className="max-w-6xl mx-auto">
            <SectionHeading
              eyebrow="Features"
              title="Everything your restaurant needs to sell online"
              description="One platform for your menu, your orders and your customers — designed to feel effortless."
            />

            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              {FEATURES.map((f, i) => {
                const Icon = f.icon;
                return (
                  <Reveal
                    key={f.title}
                    delay={(i % 4) * 0.06}
                    className={f.span ?? ''}
                  >
                    <div className="group h-full p-6 md:p-7 rounded-3xl bg-surface border border-line hover:border-brand/30 hover:shadow-brand hover:-translate-y-1 transition duration-300">
                      <div className="w-11 h-11 rounded-2xl bg-brand/10 text-brand flex items-center justify-center mb-5 group-hover:bg-brand group-hover:text-white transition-colors duration-300">
                        <Icon size={20} />
                      </div>
                      <h3 className="text-lg font-semibold text-ink mb-2">
                        {f.title}
                      </h3>
                      <p className="text-sm text-ink-muted leading-relaxed">
                        {f.desc}
                      </p>
                    </div>
                  </Reveal>
                );
              })}

              {/* No-commission highlight */}
              <Reveal delay={0.12} className="sm:col-span-2 md:col-span-1">
                <div className="h-full p-6 md:p-7 rounded-3xl bg-gradient-to-br from-amber-custom to-amber-custom-dark text-white relative overflow-hidden">
                  <Shield
                    size={120}
                    className="absolute -right-6 -bottom-6 text-white/10"
                    aria-hidden
                  />
                  <p className="text-4xl font-bold">100%</p>
                  <p className="mt-2 font-semibold">Of every order is yours</p>
                  <p className="mt-1 text-sm text-white/85">
                    No per-order fees. Ever.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ============ HOW IT WORKS ============ */}
        <section
          id="how"
          className="py-24 md:py-32 px-4 md:px-6 bg-surface border-y border-line scroll-mt-16"
        >
          <div className="max-w-6xl mx-auto">
            <SectionHeading
              eyebrow="How it works"
              title="Live in three simple steps"
            />

            <div className="relative grid md:grid-cols-3 gap-10 md:gap-8">
              {/* Connector line */}
              <div className="hidden md:block absolute top-7 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-brand/30 to-transparent" />

              {STEPS.map((s, i) => (
                <Reveal
                  key={s.title}
                  delay={i * 0.12}
                  className="relative text-center"
                >
                  <div className="relative mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-brand to-brand-dark text-white flex items-center justify-center text-xl font-bold shadow-brand mb-6">
                    {i + 1}
                  </div>
                  <h3 className="text-xl font-semibold text-ink mb-2">
                    {s.title}
                  </h3>
                  <p className="text-sm text-ink-muted max-w-xs mx-auto leading-relaxed">
                    {s.desc}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ============ DASHBOARD SHOWCASE (dark) ============ */}
        <section className="py-24 md:py-32 px-4 md:px-6 bg-brand-deeper text-white relative overflow-hidden">
          <div className="absolute -top-32 right-0 w-[500px] h-[500px] rounded-full bg-brand/40 blur-[140px] pointer-events-none" />
          <div className="relative max-w-6xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <Reveal>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-custom-light mb-3">
                  Dashboard
                </p>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-balance">
                  Run your whole day from one screen
                </h2>
                <p className="mt-4 text-white/70 text-base md:text-lg text-pretty">
                  Orders, menu, offers and customers — organized, live and
                  simple enough to use during the dinner rush.
                </p>
              </Reveal>
              <ul className="mt-8 space-y-4">
                {[
                  'Live order board with sound alerts',
                  'Edit prices and availability in seconds',
                  'Know your best sellers and loyal customers',
                ].map((t, i) => (
                  <Reveal key={t} delay={0.1 + i * 0.08}>
                    <li className="flex items-start gap-3">
                      <span className="mt-0.5 w-6 h-6 rounded-full bg-amber-custom/20 text-amber-custom-light flex items-center justify-center shrink-0">
                        <Check size={14} strokeWidth={3} />
                      </span>
                      <span className="text-white/90">{t}</span>
                    </li>
                  </Reveal>
                ))}
              </ul>
            </div>

            {/* Mini dashboard */}
            <Reveal delay={0.15}>
              <div className="rounded-3xl bg-white/[0.06] border border-white/10 backdrop-blur p-4 sm:p-6 shadow-2xl">
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { l: "Today's orders", v: '36' },
                    { l: 'Revenue', v: '$842' },
                    { l: 'Pending', v: '4' },
                  ].map((s) => (
                    <div
                      key={s.l}
                      className="rounded-2xl bg-white/[0.06] p-3 sm:p-4"
                    >
                      <p className="text-[10px] sm:text-xs text-white/60 truncate">
                        {s.l}
                      </p>
                      <p className="text-lg sm:text-2xl font-bold mt-1">
                        {s.v}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="rounded-2xl bg-white/[0.06] p-4">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-semibold">
                      Revenue · last 7 days
                    </p>
                    <span className="text-xs text-green-300 font-semibold flex items-center gap-1">
                      <TrendingUp size={12} /> 18%
                    </span>
                  </div>
                  <div className="flex items-end gap-2 sm:gap-3 h-32">
                    {[45, 60, 40, 75, 65, 90, 100].map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        whileInView={{ height: `${h}%` }}
                        viewport={{ once: true }}
                        transition={{
                          delay: 0.2 + i * 0.06,
                          duration: 0.6,
                          ease: EASE,
                        }}
                        className={`flex-1 rounded-t-lg ${
                          i === 6
                            ? 'bg-gradient-to-t from-amber-custom-dark to-amber-custom-light'
                            : 'bg-white/20'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 text-[10px] text-white/50">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(
                      (d) => (
                        <span key={d} className="flex-1 text-center">
                          {d}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ============ TESTIMONIALS ============ */}
        <section
          id="testimonials"
          className="py-24 md:py-32 px-4 md:px-6 scroll-mt-16"
        >
          <div className="max-w-6xl mx-auto">
            <SectionHeading
              eyebrow="Testimonials"
              title="Loved by restaurant owners"
            />

            <div className="grid md:grid-cols-3 gap-4 md:gap-6">
              {TESTIMONIALS.map((t, i) => (
                <Reveal key={t.name} delay={i * 0.08}>
                  <figure className="h-full flex flex-col p-6 md:p-7 rounded-3xl bg-surface border border-line shadow-soft">
                    <div
                      className="flex gap-0.5 mb-4"
                      role="img"
                      aria-label="5 out of 5 stars"
                    >
                      {[...Array(5)].map((_, j) => (
                        <Star
                          key={j}
                          size={16}
                          className="fill-amber-custom text-amber-custom"
                        />
                      ))}
                    </div>
                    <blockquote className="text-ink leading-relaxed flex-1">
                      “{t.quote}”
                    </blockquote>
                    <figcaption className="flex items-center gap-3 mt-6 pt-6 border-t border-line">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand to-brand-dark text-white flex items-center justify-center font-bold text-sm">
                        {t.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-ink">
                          {t.name}
                        </p>
                        <p className="text-xs text-ink-muted">{t.role}</p>
                      </div>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ============ CTA ============ */}
        <section className="pb-24 md:pb-32 px-4 md:px-6">
          <Reveal className="max-w-6xl mx-auto">
            <div className="relative rounded-[2rem] p-10 md:p-16 text-center bg-gradient-to-br from-brand via-brand-dark to-brand-deeper text-white overflow-hidden shadow-brand-lg">
              <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-amber-custom/30 blur-3xl pointer-events-none" />

              <div className="relative">
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-balance">
                  Ready to take your menu online?
                </h2>
                <p className="mt-4 text-white/80 max-w-lg mx-auto">
                  Join restaurants already growing with MenuFlow. Free for 14
                  days — no credit card required.
                </p>

                <div className="mt-9 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 max-w-sm sm:max-w-none mx-auto">
                  <Link
                    href="/auth/signup"
                    className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white text-brand-deeper font-semibold hover:bg-cream hover:-translate-y-0.5 active:translate-y-0 transition duration-300 shadow-xl"
                  >
                    Start free trial
                    <ArrowRight
                      size={18}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </Link>
                  <Link
                    href="/pricing"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white/10 border border-white/20 font-semibold hover:bg-white/20 transition-colors"
                  >
                    See pricing
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ============ FOOTER ============ */}
        <footer className="border-t border-line bg-surface py-12 px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10 mb-10">
              <div className="sm:col-span-2">
                <Link href="/" className="flex items-center gap-2.5 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center">
                    <ChefHat size={18} className="text-white" />
                  </div>
                  <span className="font-bold text-lg text-ink">MenuFlow</span>
                </Link>
                <p className="text-sm text-ink-muted max-w-xs">
                  Digital menus, QR ordering and analytics for modern
                  restaurants.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-sm text-ink mb-4">Product</h4>
                <ul className="space-y-2.5 text-sm text-ink-muted">
                  <li>
                    <a
                      href="#features"
                      className="hover:text-brand transition-colors"
                    >
                      Features
                    </a>
                  </li>
                  <li>
                    <Link
                      href="/pricing"
                      className="hover:text-brand transition-colors"
                    >
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/auth/signup"
                      className="hover:text-brand transition-colors"
                    >
                      Get started
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-sm text-ink mb-4">Company</h4>
                <ul className="space-y-2.5 text-sm text-ink-muted">
                  <li>
                    <a
                      href="mailto:hello@meinfina.com"
                      className="hover:text-brand transition-colors"
                    >
                      Contact
                    </a>
                  </li>
                  <li>
                    <Link
                      href="/auth/login"
                      className="hover:text-brand transition-colors"
                    >
                      Log in
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-8 border-t border-line flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-xs text-ink-muted">
                © {new Date().getFullYear()} MenuFlow. All rights reserved.
              </p>
              <p className="text-xs text-ink-muted flex items-center gap-1.5">
                <Lock size={12} /> Secure payments
                <span aria-hidden>·</span>
                <Clock size={12} /> Built for restaurants
              </p>
            </div>
          </div>
        </footer>
      </div>
    </MotionConfig>
  );
}
