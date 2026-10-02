"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  QrCode,
  Download,
  Printer,
  Copy,
  Check,
  ExternalLink,
  Smartphone,
  Eye,
} from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

export default function QRPage() {
  const [copied, setCopied] = useState(false);
  const menuUrl = "https://menuflow.app/r/snack";

  const handleCopy = () => {
    navigator.clipboard.writeText(menuUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-6">
      {/* Header */}
      <motion.div variants={fadeInUp}>
        <h1 className="text-2xl md:text-3xl font-bold">QR Menu</h1>
        <p className="text-sm text-gray-400">Generate and share your restaurant's digital menu</p>
      </motion.div>

      {/* Main QR Card */}
      <motion.div
        variants={fadeInUp}
        className="bg-[#0F0F0F] rounded-3xl border border-white/10 p-6 md:p-10 text-center"
      >
        <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-4 py-2 rounded-full text-sm text-amber-400 mb-6">
          <QrCode size={16} />
          Scan to Order
        </div>

        <h2 className="text-3xl md:text-4xl font-bold mb-4">Snack</h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          Point your phone camera at the QR code to open the digital menu
        </p>

        {/* QR Placeholder */}
        <div className="w-64 h-64 mx-auto bg-white rounded-3xl p-4 flex items-center justify-center mb-8 shadow-2xl shadow-amber-500/20">
          <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl flex items-center justify-center">
            <div className="text-center">
              <QrCode size={80} className="text-white mx-auto mb-3" />
              <p className="text-xs text-gray-400">QR Code Preview</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <button className="bg-gradient-to-r from-red-600 to-amber-500 px-6 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition flex items-center gap-2">
            <Download size={16} />
            Download QR
          </button>
          <button className="bg-white/5 border border-white/10 px-6 py-3 rounded-xl text-sm font-semibold hover:bg-white/10 transition flex items-center gap-2">
            <Printer size={16} />
            Print QR
          </button>
          <button className="bg-white/5 border border-white/10 px-6 py-3 rounded-xl text-sm font-semibold hover:bg-white/10 transition flex items-center gap-2">
            <Eye size={16} />
            Preview Menu
          </button>
        </div>

        {/* URL Box */}
        <div className="max-w-md mx-auto">
          <p className="text-xs text-gray-500 mb-2 text-left">Menu Link</p>
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-3">
            <Smartphone size={16} className="text-amber-400 shrink-0" />
            <p className="text-xs text-gray-300 flex-1 truncate text-left">{menuUrl}</p>
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition shrink-0"
            >
              {copied ? (
                <Check size={14} className="text-emerald-400" />
              ) : (
                <Copy size={14} className="text-gray-400" />
              )}
            </button>
            <a
              href="#"
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition shrink-0"
            >
              <ExternalLink size={14} className="text-gray-400" />
            </a>
          </div>
        </div>
      </motion.div>

      {/* How it Works */}
      <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { num: "01", title: "Print QR", desc: "Download and print the QR code for your tables." },
          { num: "02", title: "Place on Table", desc: "Put the QR code on each table or at the entrance." },
          { num: "03", title: "Customers Scan", desc: "They scan, browse, and order instantly." },
        ].map((step) => (
          <div key={step.num} className="bg-[#0F0F0F] rounded-2xl border border-white/10 p-5">
            <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-red-500/60 to-transparent mb-3">
              {step.num}
            </div>
            <h3 className="font-bold mb-1">{step.title}</h3>
            <p className="text-xs text-gray-400">{step.desc}</p>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}