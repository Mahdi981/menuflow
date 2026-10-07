'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ScrollText,
  Search,
  Loader2,
  Shield,
  Clock,
  User,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

type AdminLog = {
  id: string;
  admin_user_id: string;
  admin_email: string;
  action: string;
  target_type: string | null;
  target_id: string | null;
  details: Record<string, any> | null;
  created_at: string;
};

const ACTION_COLORS: Record<string, string> = {
  update_plan: 'bg-amber-custom/10 text-amber-custom border-amber-custom/20',
  toggle_active: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  delete: 'bg-red-500/10 text-red-600 border-red-500/20',
  create: 'bg-green-500/10 text-green-600 border-green-500/20',
};

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('admin_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (!error) setLogs((data ?? []) as AdminLog[]);
      setLoading(false);
    };

    fetchLogs();
  }, []);

  const filtered = useMemo(() => {
    const q = searchTerm.toLowerCase();
    if (!q) return logs;
    return logs.filter(
      (l) =>
        l.action.toLowerCase().includes(q) ||
        l.admin_email.toLowerCase().includes(q) ||
        (l.target_id ?? '').toLowerCase().includes(q)
    );
  }, [logs, searchTerm]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-brand" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
            <ScrollText size={20} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-ink">
              Activity Log
            </h1>
            <p className="text-sm text-ink-muted">
              All admin actions ({logs.length})
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
        />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by action, email, or target..."
          className="w-full bg-surface border border-line rounded-xl py-3 pl-10 pr-4 text-sm text-ink placeholder:text-ink-muted/50 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-surface border border-line rounded-2xl shadow-soft">
          <div className="w-16 h-16 rounded-2xl bg-brand/10 mx-auto flex items-center justify-center mb-4">
            <ScrollText size={28} className="text-brand" />
          </div>
          <p className="text-ink-muted font-medium">No activity yet</p>
          <p className="text-sm text-ink-muted/70 mt-1">
            Admin actions will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((log, idx) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(idx * 0.02, 0.3) }}
              className="bg-surface border border-line rounded-2xl p-4 shadow-soft"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand/10 flex items-center justify-center text-brand shrink-0">
                  <Shield size={16} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                        ACTION_COLORS[log.action] ??
                        'bg-cream text-ink-muted border-line'
                      }`}
                    >
                      {log.action.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs text-ink-muted flex items-center gap-1">
                      <Clock size={10} />
                      {new Date(log.created_at).toLocaleString()}
                    </span>
                  </div>

                  <p className="text-sm text-ink mt-1.5 flex items-center gap-1.5">
                    <User size={12} className="text-ink-muted" />
                    <span className="font-mono text-xs">{log.admin_email}</span>
                  </p>

                  {log.target_id && (
                    <p className="text-xs text-ink-muted mt-1 font-mono">
                      Target: {log.target_type} / {log.target_id.slice(0, 8)}...
                    </p>
                  )}

                  {log.details && Object.keys(log.details).length > 0 && (
                    <details className="mt-2">
                      <summary className="text-xs text-brand cursor-pointer hover:underline">
                        Details
                      </summary>
                      <pre className="mt-2 p-2 bg-cream rounded-lg text-[10px] text-ink overflow-x-auto">
                        {JSON.stringify(log.details, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}