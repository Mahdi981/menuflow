'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { motion } from 'framer-motion';
import { ChefHat, Loader2 } from 'lucide-react';

export default function AuthCallback() {
  const router = useRouter();

  // ✅ الحل: lazy initialization بدل createClient() مباشرة
  const [supabase] = useState(() => createClient());

  const [status, setStatus] = useState('جاري تسجيل الدخول...');
  const [debug, setDebug] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          setDebug(error.message);
          throw error;
        }

        if (session) {
          setStatus('جاري التحويل...');
          router.push('/dashboard/setup');
        } else {
          // Retry مرة تانية (أحياناً الـ OAuth بياخد وقت)
          await new Promise((resolve) => setTimeout(resolve, 1000));
          const {
            data: { session: retrySession },
          } = await supabase.auth.getSession();

          if (retrySession) {
            router.push('/dashboard/setup');
          } else {
            setStatus('فشل التحقق. جاري التحويل...');
            setTimeout(
              () => router.push('/auth/login?error=no_session'),
              1500
            );
          }
        }
      } catch (err: any) {
        setStatus('فشل التحقق. جاري التحويل...');
        setDebug(err.message || 'Unknown error');
        setTimeout(
          () => router.push('/auth/login?error=callback_failed'),
          1500
        );
      }
    };

    handleCallback();
  }, [router, supabase]);

  return (
    <main className="min-h-screen bg-cream flex items-center justify-center p-4">
      {/* Decorative gradients */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-brand/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 -right-40 w-96 h-96 bg-amber-custom/20 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        {/* Logo */}
        <div className="w-20 h-20 bg-gradient-to-br from-brand to-brand-dark rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-brand">
          <ChefHat size={40} className="text-white" />
        </div>

        {/* Status */}
        <div className="flex items-center justify-center gap-3 mb-3">
          <Loader2 size={20} className="animate-spin text-brand" />
          <p className="text-lg font-semibold text-ink">{status}</p>
        </div>

        {/* Debug */}
        {debug && (
          <p className="text-xs text-red-500 mt-3 bg-red-500/10 rounded-lg p-2">
            {debug}
          </p>
        )}

        {/* Hint */}
        <p className="text-xs text-ink-muted mt-6">
          الرجاء الانتظار...
        </p>
      </motion.div>
    </main>
  );
}