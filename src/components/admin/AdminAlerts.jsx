import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Search, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react';

const MOCK_ALERTS = Array.from({ length: 15 }, (_, i) => ({
  id: `mock-${i + 1}`,
  user: ['Priya Mehta', 'Rahul Sharma', 'Emma Wilson', 'Carlos Rivera'][i % 4],
  email: `user${i + 1}@example.com`,
  from: ['USD', 'EUR', 'GBP', 'BTC', 'ETH'][i % 5],
  to: ['INR', 'USD', 'EUR', 'USD', 'INR'][i % 5],
  targetRate: (Math.random() * 100 + 1).toFixed(4),
  currentRate: (Math.random() * 100 + 1).toFixed(4),
  status: ['Active', 'Triggered', 'Expired'][i % 3],
  created: `2026-05-${String(31 - (i % 5)).padStart(2, '0')}`,
}));

const STATUS_CONFIG = {
  Active: { color: 'text-blue-600 dark:text-blue-400 bg-blue-500/5 dark:bg-blue-500/10 border-blue-500/20', icon: <Clock className="w-3 h-3" /> },
  Triggered: { color: 'text-emerald-650 dark:text-emerald-400 bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20', icon: <CheckCircle className="w-3 h-3" /> },
  Expired: { color: 'text-slate-600 dark:text-slate-400 bg-slate-500/5 dark:bg-slate-500/10 border-slate-500/20', icon: <XCircle className="w-3 h-3" /> },
};

export default function AdminAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const syncAlerts = () => {
    try {
      const savedAlerts = JSON.parse(localStorage.getItem('currency_alerts') || '[]');
      const realAlerts = savedAlerts.map(a => ({
        id: a.id,
        user: 'Aman Kumar Das (Admin)',
        email: 'kumaraman.das2004@gmail.com',
        from: a.base,
        to: a.target,
        targetRate: Number(a.value).toFixed(4),
        currentRate: (Number(a.value) * (0.98 + Math.random() * 0.04)).toFixed(4),
        status: a.active ? 'Active' : 'Triggered',
        created: a.createdAt || new Date().toLocaleDateString(),
      }));

      // Merge together, placing real alerts at the top
      setAlerts([...realAlerts, ...MOCK_ALERTS]);
    } catch (e) {
      console.warn('Real alerts sync failed:', e);
      setAlerts(MOCK_ALERTS);
    }
  };

  useEffect(() => {
    syncAlerts();
  }, []);

  const deleteAlert = (id) => {
    // If it's a real alert, delete from localStorage as well
    if (typeof id === 'number') {
      try {
        const savedAlerts = JSON.parse(localStorage.getItem('currency_alerts') || '[]');
        const updated = savedAlerts.filter(a => a.id !== id);
        localStorage.setItem('currency_alerts', JSON.stringify(updated));
      } catch (e) {
        console.warn('Local storage alert delete failed:', e);
      }
    }
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const triggerAlert = (id) => {
    if (typeof id === 'number') {
      try {
        const savedAlerts = JSON.parse(localStorage.getItem('currency_alerts') || '[]');
        const updated = savedAlerts.map(a => a.id === id ? { ...a, active: false } : a);
        localStorage.setItem('currency_alerts', JSON.stringify(updated));
      } catch (e) {
        console.warn('Local storage alert trigger failed:', e);
      }
    }
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'Triggered' } : a));
  };

  const filtered = alerts.filter(a => {
    const ms = search.toLowerCase();
    return (a.user.toLowerCase().includes(ms) || a.from.toLowerCase().includes(ms) || a.to.toLowerCase().includes(ms)) &&
      (statusFilter === 'All' || a.status === statusFilter);
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-805 dark:text-white transition-colors duration-300">Rate Alert Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">{alerts.filter(a => a.status === 'Active').length} active alerts across all users</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {['Active', 'Triggered', 'Expired'].map(s => (
          <div key={s} className={`p-4 rounded-2xl border text-center transition-colors duration-300 ${STATUS_CONFIG[s].color}`}>
            <div className="text-xl font-black">{alerts.filter(a => a.status === s).length}</div>
            <div className="text-[10px] font-semibold mt-1">{s} Alerts</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            placeholder="Search user, currency pair..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white dark:bg-white/5 border border-slate-200/50 dark:border-white/5 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-805 dark:text-slate-300 placeholder-slate-405 dark:placeholder-slate-600 outline-none focus:border-purple-500/50 transition-all"
          />
        </div>
        <div className="flex gap-2">
          {['All', 'Active', 'Triggered', 'Expired'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all border ${statusFilter === s ? 'bg-purple-100 border-purple-200 text-purple-750 dark:bg-purple-500/20 dark:border-purple-500/30 dark:text-purple-300' : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-[#0d0f1e] border border-slate-100 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm transition-colors duration-300">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-transparent">
              {['User', 'Pair', 'Target Rate', 'Current Rate', 'Status', 'Created', 'Actions'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/[0.03]">
            {filtered.map((alert, i) => {
              const sc = STATUS_CONFIG[alert.status];
              return (
                <motion.tr key={alert.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-all">
                  <td className="px-4 py-3">
                    <div className="text-[11px] font-bold text-slate-800 dark:text-white">{alert.user}</div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500">{alert.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-black text-slate-800 dark:text-white">{alert.from}</span>
                      <Bell className="w-2.5 h-2.5 text-slate-400" />
                      <span className="text-[11px] font-black text-slate-800 dark:text-white">{alert.to}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[11px] font-bold text-amber-600 dark:text-amber-400">{alert.targetRate}</td>
                  <td className="px-4 py-3 text-[11px] text-slate-700 dark:text-slate-300">{alert.currentRate}</td>
                  <td className="px-4 py-3">
                    <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border w-fit ${sc.color}`}>
                      {sc.icon} {alert.status}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[11px] text-slate-400 dark:text-slate-500">{alert.created}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {alert.status === 'Active' && (
                        <button onClick={() => triggerAlert(alert.id)} className="p-1.5 rounded-lg hover:bg-emerald-500/10 text-slate-450 hover:text-emerald-650 dark:text-slate-500 dark:hover:text-emerald-400 transition-all" title="Trigger">
                          <CheckCircle className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button onClick={() => deleteAlert(alert.id)} className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-455 hover:text-rose-650 dark:text-slate-500 dark:hover:text-rose-400 transition-all" title="Delete">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
