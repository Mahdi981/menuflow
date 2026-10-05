'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  Copy,
  Check,
  Printer,
  ExternalLink,
  QrCode as QrIcon,
} from 'lucide-react';
import QRCode from 'react-qr-code';
import { useRestaurant } from '@/lib/hooks/useRestaurant';

export default function QRPage() {
  const { restaurant, loading } = useRestaurant();
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-cream p-8 text-center">
        <p className="text-red-500">No restaurant found</p>
      </div>
    );
  }

  const menuUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/r/${restaurant.slug}`
      : `https://meinfina.com/r/${restaurant.slug}`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(menuUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQR = async () => {
    if (!qrRef.current) return;
    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    const size = 1024;
    canvas.width = size;
    canvas.height = size;

    img.onload = () => {
      if (!ctx) return;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);
      const pngFile = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${restaurant.slug}-qr.png`;
      link.href = pngFile;
      link.click();
    };

    img.src =
      'data:image/svg+xml;base64,' +
      btoa(unescape(encodeURIComponent(svgData)));
  };

  const printQR = () => {
    if (!qrRef.current) return;
    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;

    const w = window.open('', '', 'width=800,height=800');
    if (!w) return;
    w.document.write(`
      <html><head><title>QR — ${restaurant.name}</title>
      <style>
        body { font-family: system-ui, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 40px; }
        h1 { font-size: 28px; margin: 0 0 8px; }
        p { color: #666; margin: 0 0 24px; }
        svg { width: 400px; height: 400px; }
      </style></head>
      <body>
        <h1>${restaurant.name_ar ?? restaurant.name}</h1>
        <p>Scan to view our menu</p>
        ${svg.outerHTML}
        <p style="margin-top: 24px; font-size: 14px; color: #999;">${menuUrl}</p>
      </body></html>
    `);
    w.document.close();
    w.onload = () => {
      w.focus();
      w.print();
    };
  };

  return (
    <div className="min-h-screen bg-cream p-4 md:p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center text-brand">
            <QrIcon size={20} />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-ink">QR Menu</h1>
        </div>
        <p className="text-sm text-ink-muted">
          Print this QR code and place it on your tables. Customers scan it to
          view your menu and order.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* QR */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface border border-line rounded-2xl p-6 md:p-8 shadow-soft"
        >
          <div className="bg-white rounded-2xl p-8 flex items-center justify-center border border-line">
            <div ref={qrRef}>
              <QRCode
                value={menuUrl}
                size={280}
                bgColor="#ffffff"
                fgColor="#1C7E84"
                level="H"
              />
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="font-semibold text-lg text-ink">
              {restaurant.name_ar ?? restaurant.name}
            </p>
            <p className="text-xs text-ink-muted mt-1">Scan to view menu</p>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <div className="bg-surface border border-line rounded-2xl p-6 shadow-soft">
            <h3 className="text-sm font-semibold text-ink-muted uppercase tracking-wider mb-3">
              Your Menu Link
            </h3>
            <div className="flex items-center gap-2 bg-cream rounded-xl p-3">
              <code className="flex-1 text-sm text-brand truncate">
                {menuUrl}
              </code>
              <button
                onClick={copyLink}
                className="p-2 rounded-lg hover:bg-brand/10 transition shrink-0 text-ink-muted"
              >
                {copied ? (
                  <Check size={18} className="text-green-600" />
                ) : (
                  <Copy size={18} />
                )}
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              <a
                href={menuUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cream hover:bg-brand/10 text-sm font-medium text-ink transition"
              >
                <ExternalLink size={16} />
                Open Menu
              </a>
              <button
                onClick={copyLink}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cream hover:bg-brand/10 text-sm font-medium text-ink transition"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>

          <div className="bg-surface border border-line rounded-2xl p-6 shadow-soft">
            <h3 className="text-sm font-semibold text-ink-muted uppercase tracking-wider mb-3">
              Actions
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={downloadQR}
                className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-brand hover:bg-brand-dark text-white font-semibold shadow-brand transition"
              >
                <Download size={18} />
                Download PNG
              </button>
              <button
                onClick={printQR}
                className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-cream hover:bg-brand/10 text-ink font-semibold transition"
              >
                <Printer size={18} />
                Print
              </button>
            </div>
          </div>

          <div className="bg-brand/5 border border-brand/20 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-brand mb-3">💡 Tips</h3>
            <ul className="space-y-2 text-sm text-ink-muted">
              <li>• اطبع QR وضعه على كل طاولة</li>
              <li>• استخدم Download PNG للطباعة عالية الجودة</li>
              <li>• QR بيوجه الزبون للمنيو مباشرة</li>
              <li>• الزبون يقدر يطلب بدون أي app</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}