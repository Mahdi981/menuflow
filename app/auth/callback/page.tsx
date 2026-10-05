"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { UtensilsCrossed, Loader2 } from "lucide-react";

export default function AuthCallback() {
  const router = useRouter();
  const supabase = createClient();
  const [status, setStatus] = useState("Signing you in...");
  const [debug, setDebug] = useState("");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          setDebug(error.message);
          throw error;
        }

        if (session) {
          setStatus("Redirecting to dashboard...");
          router.push("/dashboard/setup");
        } else {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          const { data: { session: retrySession } } = await supabase.auth.getSession();

          if (retrySession) {
            router.push("/dashboard/setup");
          } else {
            setStatus("Authentication failed. Redirecting...");
            setTimeout(() => router.push("/auth/login?error=no_session"), 1500);
          }
        }
      } catch (err: any) {
        setStatus("Authentication failed. Redirecting...");
        setDebug(err.message || "Unknown error");
        setTimeout(() => router.push("/auth/login?error=callback_failed"), 1500);
      }
    };

    handleCallback();
  }, [router, supabase]);

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center p-4">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-red-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 -right-40 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <UtensilsCrossed size={40} className="text-white" />
        </div>
        <div className="flex items-center justify-center gap-3 mb-3">
          <Loader2 size={20} className="animate-spin text-amber-400" />
          <p className="text-lg font-semibold">{status}</p>
        </div>
        {debug && <p className="text-xs text-red-400 mt-3">{debug}</p>}
      </motion.div>
    </main>
  );
}