import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, Globe, Coins, BarChart3, Bell,
  Brain, Newspaper, TrendingUp, MessageSquare, Shield,
  Settings, LogOut, ChevronLeft, ChevronRight, Zap
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'currencies', label: 'Currencies', icon: Globe },
  { id: 'crypto', label: 'Crypto', icon: Coins },
  { id: 'exchange-rates', label: 'Exchange Rates', icon: TrendingUp },
  { id: 'alerts', label: 'Rate Alerts', icon: Bell },
  { id: 'ai-advisor', label: 'AI Advisor', icon: Brain },
  { id: 'news', label: 'News', icon: Newspaper },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'feedback', label: 'Feedback', icon: MessageSquare },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function AdminSidebar({ active, onNavigate, onLogout }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{ width: collapsed ? 68 : 220 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="relative flex flex-col h-full bg-white dark:bg-[#0a0c1a] border-r border-slate-200/60 dark:border-white/5 shrink-0 overflow-visible z-10 transition-colors duration-300"
    >
      {/* Logo */}
      <div className={`flex items-center gap-2.5 h-16 border-b border-slate-100 dark:border-white/5 shrink-0 transition-colors duration-300 ${collapsed ? 'justify-center px-0' : 'px-4'}`}>
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center shrink-0 shadow-lg shadow-purple-500/20">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.18 }}
              className="min-w-0 overflow-hidden"
            >
              <div className="font-black text-[13px] text-slate-800 dark:text-white leading-none tracking-tight">FinVerse</div>
              <div className="text-[9px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest mt-0.5">Admin Panel</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav Section Label */}
      {!collapsed && (
        <div className="px-4 pt-4 pb-1">
          <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600">Navigation</span>
        </div>
      )}

      {/* Nav Items */}
      <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto overflow-x-hidden">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              title={collapsed ? item.label : ''}
              className={`relative w-full flex items-center gap-2.5 rounded-xl text-[11px] font-bold transition-all duration-200 group overflow-hidden
                ${collapsed ? 'justify-center px-0 h-10' : 'px-3 py-2.5'}
                ${isActive
                  ? 'bg-purple-50 dark:bg-purple-600/20 text-purple-600 dark:text-purple-300'
                  : 'text-slate-500 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/[0.04]'
                }`}
            >
              {/* Active left bar */}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-purple-600 dark:bg-purple-500 rounded-r-full" />
              )}
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-purple-600 dark:text-purple-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.12 }}
                    className="truncate"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className={`px-2 py-3 border-t border-slate-100 dark:border-white/5 shrink-0 transition-colors duration-300`}>
        <button
          onClick={onLogout}
          title={collapsed ? 'Back to App' : ''}
          className={`w-full flex items-center gap-2.5 rounded-xl text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all duration-200
            ${collapsed ? 'justify-center h-10 px-0' : 'px-3 py-2.5'}`}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                Back to App
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Collapse Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-[30px] w-6 h-6 rounded-full bg-white dark:bg-[#1a1d2e] border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-450 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:border-purple-500/20 dark:hover:border-purple-500/40 transition-all shadow-md z-20"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>
    </motion.aside>
  );
}
