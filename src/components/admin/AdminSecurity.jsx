import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle, XCircle, Globe, Monitor } from 'lucide-react';

const generateLogs = () => Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  user: ['kumaraman.das2004@gmail.com', 'user2@example.com', 'user3@example.com', 'unknown@mail.ru', 'user5@example.com'][i % 5],
  ip: `${Math.floor(Math.random() * 200) + 50}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
  browser: ['Chrome 124 / Windows', 'Safari 17 / macOS', 'Firefox 125 / Linux', 'Chrome Mobile / Android', 'Edge 120 / Windows'][i % 5],
  country: ['India', 'USA', 'UK', 'Russia', 'Canada'][i % 5],
  status: i % 6 === 0 ? 'Failed' : i % 8 === 0 ? 'Blocked' : 'Success',
  time: `${Math.floor(Math.random() * 23)}:${String(Math.floor(Math.random() * 59)).padStart(2, '0')}`,
  date: `2026-05-${String(31 - Math.floor(i / 3)).padStart(2, '0')}`,
}));

const STATUS_ICON = {
  Success: <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />,
  Failed: <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />,
  Blocked: <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />,
};
const STATUS_COLOR = {
  Success: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20',
  Failed: 'text-rose-600 dark:text-rose-400 bg-rose-500/5 dark:bg-rose-500/10 border-rose-500/20',
  Blocked: 'text-amber-605 dark:text-amber-400 bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/20',
};

export default function AdminSecurity() {
  const [logs] = useState(generateLogs());
  const [filter, setFilter] = useState('All');

  const filtered = filter === 'All' ? logs : logs.filter(l => l.status === filter);

  const successCount = logs.filter(l => l.status === 'Success').length;
  const failedCount = logs.filter(l => l.status === 'Failed').length;
  const blockedCount = logs.filter(l => l.status === 'Blocked').length;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-black text-slate-805 dark:text-white transition-colors duration-300">Security & Login Activity</h1>
        <p className="text-xs text-slate-500 mt-0.5">Real-time authentication log monitoring</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl border border-emerald-500/10 dark:border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/10 text-center transition-colors duration-300">
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{successCount}</div>
          <div className="text-[10px] text-slate-550 dark:text-slate-500 font-semibold mt-1">Successful Logins</div>
        </div>
        <div className="p-4 rounded-2xl border border-rose-500/10 dark:border-rose-500/20 bg-rose-500/5 dark:bg-rose-500/10 text-center transition-colors duration-300">
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400">{failedCount}</div>
          <div className="text-[10px] text-slate-550 dark:text-slate-500 font-semibold mt-1">Failed Attempts</div>
        </div>
        <div className="p-4 rounded-2xl border border-amber-500/10 dark:border-amber-500/20 bg-amber-500/5 dark:bg-amber-500/10 text-center transition-colors duration-300">
          <div className="text-2xl font-black text-amber-605 dark:text-amber-400">{blockedCount}</div>
          <div className="text-[10px] text-slate-550 dark:text-slate-500 font-semibold mt-1">Blocked IPs</div>
        </div>
      </div>

      {/* Alert Banner */}
      {failedCount > 2 && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-3 bg-rose-500/5 dark:bg-rose-500/10 border border-rose-550/20 rounded-xl">
          <AlertTriangle className="w-4 h-4 text-rose-500 dark:text-rose-400 shrink-0" />
          <p className="text-xs font-bold text-rose-700 dark:text-rose-300">
            {failedCount} failed login attempts detected in the last 24 hours. Review suspicious activity below.
          </p>
        </motion.div>
      )}

      {/* Filters */}
      <div className="flex gap-2">
        {['All', 'Success', 'Failed', 'Blocked'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all border ${filter === f ? 'bg-purple-100 border-purple-200 text-purple-750 dark:bg-purple-500/20 dark:border-purple-500/30 dark:text-purple-300' : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Log Table */}
      <div className="bg-white dark:bg-[#0d0f1e] border border-slate-100 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm transition-colors duration-300">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-transparent">
                {['User / Email', 'IP Address', 'Browser & OS', 'Country', 'Status', 'Time'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/[0.03]">
              {filtered.map((log, i) => (
                <motion.tr
                  key={log.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className={`hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-all ${log.status === 'Failed' ? 'bg-rose-500/[0.01] dark:bg-rose-500/[0.02]' : log.status === 'Blocked' ? 'bg-amber-500/[0.01] dark:bg-amber-500/[0.02]' : ''}`}
                >
                  <td className="px-4 py-3 text-[11px] text-slate-805 dark:text-slate-300 font-semibold max-w-[200px] truncate">{log.user}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-400 font-mono">
                      <Globe className="w-3 h-3 text-slate-400 shrink-0" />
                      {log.ip}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-400">
                      <Monitor className="w-3 h-3 text-slate-400 shrink-0" />
                      {log.browser}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[11px] text-slate-600 dark:text-slate-400">{log.country}</td>
                  <td className="px-4 py-3">
                    <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border w-fit ${STATUS_COLOR[log.status]}`}>
                      {STATUS_ICON[log.status]}
                      {log.status}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-[11px] text-slate-400 dark:text-slate-500">{log.date}</div>
                    <div className="text-[10px] text-slate-455 dark:text-slate-600">{log.time}</div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
