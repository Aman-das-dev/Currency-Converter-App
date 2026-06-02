import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';

import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import AdminDashboard from './AdminDashboard';
import AdminUsers from './AdminUsers';
import AdminCurrencies from './AdminCurrencies';
import AdminCrypto from './AdminCrypto';
import AdminExchangeRates from './AdminExchangeRates';
import AdminAlerts from './AdminAlerts';
import AdminAiAdvisor from './AdminAiAdvisor';
import AdminNews from './AdminNews';
import AdminAnalytics from './AdminAnalytics';
import AdminFeedback from './AdminFeedback';
import AdminSecurity from './AdminSecurity';
import AdminSettings from './AdminSettings';

const ADMIN_EMAIL = 'kumaraman.das2004@gmail.com';

const PAGE_MAP = {
  'dashboard': AdminDashboard,
  'users': AdminUsers,
  'currencies': AdminCurrencies,
  'crypto': AdminCrypto,
  'exchange-rates': AdminExchangeRates,
  'alerts': AdminAlerts,
  'ai-advisor': AdminAiAdvisor,
  'news': AdminNews,
  'analytics': AdminAnalytics,
  'feedback': AdminFeedback,
  'security': AdminSecurity,
  'settings': AdminSettings,
};

export default function AdminPanel({ userEmail, onBack, darkMode, setDarkMode, adminName }) {
  const [activePage, setActivePage] = useState('dashboard');
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Gate: verify admin email
    setTimeout(() => {
      if (userEmail === ADMIN_EMAIL) {
        setAuthorized(true);
      }
      setChecking(false);
    }, 400);
  }, [userEmail]);

  if (checking) {
    return (
      <div className="fixed inset-0 bg-slate-50 dark:bg-[#070b19] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="fixed inset-0 bg-slate-50 dark:bg-[#070b19] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-sm"
        >
          <div className="w-16 h-16 rounded-2xl bg-rose-550/10 border border-rose-500/20 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-8 h-8 text-rose-500 dark:text-rose-400" />
          </div>
          <h2 className="text-xl font-black text-slate-800 dark:text-white mb-2">Access Denied</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            This admin panel is restricted. Only authorized administrators may access this area.
          </p>
          <button
            onClick={onBack}
            className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-sm font-bold text-white shadow-lg hover:shadow-purple-500/20 transition-all"
          >
            Back to App
          </button>
        </motion.div>
      </div>
    );
  }

  const ActivePage = PAGE_MAP[activePage] || AdminDashboard;

  return (
    <div className="fixed inset-0 bg-[#f8fafc] dark:bg-[#080a18] flex overflow-hidden z-[100] transition-colors duration-300">
      {/* Sidebar */}
      <AdminSidebar
        active={activePage}
        onNavigate={setActivePage}
        onLogout={onBack}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <AdminHeader
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          adminName={adminName || 'Aman Das'}
        />

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 px-6 py-2 bg-slate-50 dark:bg-[#0a0c1a] border-b border-slate-100 dark:border-white/[0.04] shrink-0 transition-colors duration-300">
          <span className="text-[11px] font-bold text-purple-600 dark:text-purple-500">FinVerse Admin</span>
          <span className="text-[11px] text-slate-400 dark:text-slate-700">/</span>
          <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 capitalize">
            {activePage.replace(/-/g, ' ')}
          </span>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto bg-[#f8fafc] dark:bg-[#080a18] transition-colors duration-300" style={{ scrollbarWidth: 'none' }}>
          <div className="p-6 max-w-[1600px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.18 }}
              >
                <ActivePage />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
