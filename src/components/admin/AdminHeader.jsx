import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, Sun, Moon, X, CheckCircle2, AlertCircle, Info } from 'lucide-react';

const MOCK_NOTIFICATIONS = [
  { id: 1, type: 'alert', message: '3 new users registered today', time: '2m ago' },
  { id: 2, type: 'warning', message: 'API rate limit at 85%', time: '15m ago' },
  { id: 3, type: 'info', message: 'BTC price crossed $70,000', time: '1h ago' },
  { id: 4, type: 'success', message: 'Backup completed successfully', time: '3h ago' },
];

export default function AdminHeader({ darkMode, setDarkMode, adminName = 'Aman Das' }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [search, setSearch] = useState('');
  const unreadCount = MOCK_NOTIFICATIONS.length;

  const notifIcon = (type) => {
    if (type === 'alert') return <Bell className="w-3.5 h-3.5 text-amber-500" />;
    if (type === 'warning') return <AlertCircle className="w-3.5 h-3.5 text-rose-500" />;
    if (type === 'success') return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />;
    return <Info className="w-3.5 h-3.5 text-blue-500" />;
  };

  const initials = adminName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <header className="h-16 flex items-center gap-3 px-5 bg-white dark:bg-[#0a0c1a] border-b border-slate-100 dark:border-white/5 shrink-0 transition-colors duration-300">
      {/* Search Bar */}
      <div className="flex-1 max-w-md relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 dark:text-slate-650 pointer-events-none" />
        <input
          type="text"
          placeholder="Search users, currencies, alerts..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full h-9 bg-slate-50 dark:bg-white/[0.04] border border-slate-200/50 dark:border-white/[0.06] rounded-xl pl-9 pr-4 text-[12px] text-slate-800 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-600 outline-none focus:border-purple-500/40 focus:bg-white focus:dark:bg-white/[0.06] transition-all"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 ml-auto">
        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode && setDarkMode(!darkMode)}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200/50 dark:border-white/[0.06] text-slate-550 dark:text-slate-400 hover:text-slate-800 hover:dark:text-white hover:bg-slate-100 hover:dark:bg-white/[0.07] transition-all"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-purple-650" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 relative flex items-center justify-center rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200/50 dark:border-white/[0.06] text-slate-555 dark:text-slate-400 hover:text-slate-800 hover:dark:text-white hover:bg-slate-100 hover:dark:bg-white/[0.07] transition-all"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-600 rounded-full text-[9px] font-black text-white flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <>
                {/* Backdrop */}
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -5 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-11 w-72 bg-white dark:bg-[#12152a] border border-slate-150 dark:border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-white/5">
                    <span className="text-xs font-black text-slate-800 dark:text-white">Notifications</span>
                    <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-white transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                    {MOCK_NOTIFICATIONS.map(n => (
                      <div key={n.id} className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-all">
                        <div className="mt-0.5 shrink-0">{notifIcon(n.type)}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 leading-tight">{n.message}</p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-600 mt-0.5">{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2.5 border-t border-slate-100 dark:border-white/5 text-center">
                    <button className="text-[10px] font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors">
                      Mark all as read
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Admin Avatar */}
        <div className="flex items-center gap-2.5 h-9 bg-slate-50 dark:bg-white/[0.04] border border-slate-200/50 dark:border-white/[0.06] rounded-xl px-2.5 transition-colors duration-300">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center text-white font-black text-[10px] shadow shrink-0">
            {initials}
          </div>
          <div className="hidden sm:block pr-1">
            <div className="text-[11px] font-bold text-slate-800 dark:text-white leading-none">{adminName}</div>
            <div className="text-[9px] text-purple-600 dark:text-purple-400 font-semibold mt-0.5">Super Admin</div>
          </div>
        </div>
      </div>
    </header>
  );
}
