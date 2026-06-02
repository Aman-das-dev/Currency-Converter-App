import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ConverterCard from './components/ConverterCard';
import TrendChart from './components/TrendChart';
import MultiCompare from './components/MultiCompare';
import TravelBudget from './components/TravelBudget';
import AiAdvisor from './components/AiAdvisor';
import CryptoWidget from './components/CryptoWidget';
import MarketHeatmap from './components/MarketHeatmap';
import RateAlerts from './components/RateAlerts';
import NewsSection from './components/NewsSection';
import CostOfLiving from './components/CostOfLiving';
import SalaryConverter from './components/SalaryConverter';
import Login from './components/Login';
import Profile from './components/Profile';
import LandingPage from './components/LandingPage';
import AdminPanel from './components/admin/AdminPanel';
import { supabase } from './services/supabase';
import { fetchRates } from './services/rateApi';
import { 
  ArrowLeftRight, Coins, Brain, Plane, Landmark, Receipt, Newspaper, Bell, BarChart3, 
  RefreshCw, Database, LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ADMIN_EMAIL = 'kumaraman.das2004@gmail.com';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('xchange_loggedin') === 'true';
  });
  const [userEmail, setUserEmail] = useState('');
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const [isLandingActive, setIsLandingActive] = useState(() => {
    const loggedIn = localStorage.getItem('xchange_loggedin') === 'true';
    return !loggedIn;
  });

  const [loginStartMode, setLoginStartMode] = useState('login');

  // Listen to live database auth changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const session = data?.session;
      if (session) {
        setIsLoggedIn(true);
        setUserEmail(session.user?.email || '');
        localStorage.setItem('xchange_loggedin', 'true');
      }
    });

    const authListener = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setIsLoggedIn(true);
        setUserEmail(session.user?.email || '');
        localStorage.setItem('xchange_loggedin', 'true');
      } else if (event === 'SIGNED_OUT') {
        setIsLoggedIn(false);
        setUserEmail('');
        localStorage.removeItem('xchange_loggedin');
      }
    });
    const subscription = authListener?.data?.subscription;

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const handleLogin = (email) => {
    localStorage.setItem('xchange_loggedin', 'true');
    setIsLoggedIn(true);
    if (email) {
      setUserEmail(email);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Sign out database call skipped:', e);
    }
    localStorage.removeItem('xchange_loggedin');
    setIsLoggedIn(false);
    setIsLandingActive(true);
  };

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('currency_darkmode') === 'true';
  });

  const [rates, setRates] = useState({});
  const [ratesTime, setRatesTime] = useState('');
  const [loadingRates, setLoadingRates] = useState(true);
  const [errorRates, setErrorRates] = useState('');
  const [isMock, setIsMock] = useState(false);

  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [targetCurrency, setTargetCurrency] = useState('INR');
  const [amount, setAmount] = useState(100);
  const [voiceTrigger, setVoiceTrigger] = useState(0);

  const handleStartVoice = () => {
    setVoiceTrigger(prev => prev + 1);
    setActiveWorkspace('converter'); // Automatically switch to converter workspace
  };

  // Active Workspace tab: converter, crypto, advisor, travel, col, salary, news, alerts, charts
  const [activeWorkspace, setActiveWorkspace] = useState('converter');

  const [history, setHistory] = useState(() => {
    return JSON.parse(localStorage.getItem('currency_history') || '[]');
  });

  const [favorites, setFavorites] = useState(() => {
    return JSON.parse(localStorage.getItem('currency_favorites') || '[]');
  });

  const [travelContext, setTravelContext] = useState(null);

  // Sync dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('currency_darkmode', darkMode);
  }, [darkMode]);

  // Fetch rates based on base currency
  useEffect(() => {
    const loadRates = async () => {
      setLoadingRates(true);
      setErrorRates('');
      try {
        const data = await fetchRates(baseCurrency);
        setRates(data.rates);
        setRatesTime(data.time);
        setIsMock(!!data.isMock);
      } catch (err) {
        setErrorRates(err.message || 'Failed to fetch rates.');
      } finally {
        setLoadingRates(false);
      }
    };

    loadRates();
  }, [baseCurrency]);

  // History & Favorites sync with Local Storage
  useEffect(() => {
    localStorage.setItem('currency_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('currency_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Sync state with Supabase database tables on login mount
  useEffect(() => {
    async function syncWithSupabase() {
      // 1. Sync Conversion History
      try {
        const { data: dbHistory, error: histError } = await supabase
          .from('conversion_history')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);
        
        if (!histError && dbHistory && dbHistory.length > 0) {
          const mappedHistory = dbHistory.map(item => ({
            id: item.id,
            from: item.from_currency || 'USD',
            to: item.to_currency || 'INR',
            amount: Number(item.amount || 100),
            result: Number(item.result || 0),
            timestamp: item.created_at || new Date().toISOString()
          }));
          setHistory(mappedHistory);
        }
      } catch (err) {
        console.warn('Working offline: conversion_history table sync skipped.', err);
      }

      // 2. Sync Favorites
      try {
        const { data: dbFavs, error: favsError } = await supabase
          .from('currency_favorites')
          .select('*');
        
        if (!favsError && dbFavs && dbFavs.length > 0) {
          const mappedFavs = dbFavs.map(item => ({
            from: item.from_currency,
            to: item.to_currency
          }));
          setFavorites(mappedFavs);
        }
      } catch (err) {
        console.warn('currency_favorites table sync skipped.', err);
      }
    }

    if (isLoggedIn) {
      syncWithSupabase();
    }
  }, [isLoggedIn]);

  const addHistoryLog = async (log) => {
    setHistory(prev => {
      if (prev.length > 0) {
        const last = prev[0];
        if (last.from === log.from && last.to === log.to && Math.abs(last.amount - log.amount) < 0.01) {
          return prev;
        }
      }
      return [log, ...prev.slice(0, 49)];
    });

    // Background Database insert
    try {
      await supabase.from('conversion_history').insert([{
        from_currency: log.from,
        to_currency: log.to,
        amount: log.amount,
        result: log.result,
        created_at: log.timestamp || new Date().toISOString()
      }]);
    } catch (err) {
      console.warn('Supabase background history insert skipped:', err);
    }
  };

  const clearHistory = async () => {
    setHistory([]);
    try {
      await supabase.from('conversion_history').delete().neq('id', 0);
    } catch (err) {
      console.warn('Supabase clear history skipped:', err);
    }
  };

  const toggleFavorite = async (from, to) => {
    const exists = favorites.some(f => f.from === from && f.to === to);
    
    setFavorites(prev => {
      if (exists) {
        return prev.filter(f => !(f.from === from && f.to === to));
      } else {
        return [...prev, { from, to }];
      }
    });

    try {
      if (exists) {
        await supabase
          .from('currency_favorites')
          .delete()
          .match({ from_currency: from, to_currency: to });
      } else {
        await supabase
          .from('currency_favorites')
          .insert([{ from_currency: from, to_currency: to }]);
      }
    } catch (err) {
      console.warn('Supabase toggle favorites write skipped:', err);
    }
  };

  const removeFavorite = async (from, to) => {
    setFavorites(prev => prev.filter(f => !(f.from === from && f.to === to)));
    try {
      await supabase
        .from('currency_favorites')
        .delete()
        .match({ from_currency: from, to_currency: to });
    } catch (err) {
      console.warn('Supabase remove favorite write skipped:', err);
    }
  };

  const loadFavoritePair = (from, to) => {
    setBaseCurrency(from);
    setTargetCurrency(to);
    setActiveWorkspace('converter');
  };

  const handleQuickCryptoSelect = (cryptoCode, fiatCode) => {
    setBaseCurrency(cryptoCode);
    setTargetCurrency(fiatCode);
    setActiveWorkspace('converter');
  };

  const handleTriggerAiAdvisor = (vacaContext) => {
    setTravelContext(vacaContext);
    setActiveWorkspace('advisor');
  };

  // Sidebar Menu Config
  const sidebarItems = [
    { id: 'converter', label: 'Currency Converter', icon: <ArrowLeftRight className="w-4 h-4" /> },
    { id: 'crypto', label: 'Crypto Converter', icon: <Coins className="w-4 h-4" /> },
    { id: 'advisor', label: 'AI Advisor', icon: <Brain className="w-4 h-4" /> },
    { id: 'travel', label: 'Travel Budget Planner', icon: <Plane className="w-4 h-4" /> },
    { id: 'col', label: 'Cost of Living', icon: <Landmark className="w-4 h-4" /> },
    { id: 'salary', label: 'Salary Converter', icon: <Receipt className="w-4 h-4" /> },
    { id: 'news', label: 'Currency News', icon: <Newspaper className="w-4 h-4" /> },
    { id: 'alerts', label: 'Exchange Rate Alerts', icon: <Bell className="w-4 h-4" /> },
    { id: 'charts', label: 'Charts Dashboard', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  if (isLandingActive) {
    return (
      <LandingPage 
        onLaunch={(startMode = 'login') => {
          setLoginStartMode(startMode);
          setIsLandingActive(false);
        }} 
        darkMode={darkMode} 
        setDarkMode={setDarkMode} 
      />
    );
  }

  if (!isLoggedIn) {
    return (
      <Login 
        onLogin={handleLogin} 
        onBackToHome={() => setIsLandingActive(true)}
        darkMode={darkMode} 
        setDarkMode={setDarkMode} 
        initialMode={loginStartMode} 
      />
    );
  }

  const isAdmin = userEmail === ADMIN_EMAIL;

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] text-slate-800 dark:text-slate-200 transition-colors duration-300">
      {/* Admin Panel Overlay */}
      {isAdminPanelOpen && (
        <AdminPanel
          userEmail={userEmail}
          onBack={() => setIsAdminPanelOpen(false)}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          adminName={localStorage.getItem('xchange_profile_name') || 'Aman Das'}
        />
      )}

      {/* Navbar marquee & options */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onStartVoice={handleStartVoice}
        onOpenProfile={() => setActiveWorkspace('profile')}
        onLogout={handleLogout}
        isAdmin={isAdmin}
        onOpenAdmin={() => setIsAdminPanelOpen(true)}
        mobileNavOpen={isMobileNavOpen}
        onToggleMobileNav={() => setIsMobileNavOpen(open => !open)}
      />

      {/* Mobile Drawer Navigation */}
      <div
        className={`md:hidden fixed inset-x-0 top-16 bottom-0 z-30 transition-all duration-300 ${
          isMobileNavOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden={!isMobileNavOpen}
      >
        <button
          type="button"
          aria-label="Close mobile navigation"
          onClick={() => setIsMobileNavOpen(false)}
          className={`absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300 ${
            isMobileNavOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <aside
          className={`relative ml-auto h-full w-[88vw] max-w-sm border-l border-slate-200/50 dark:border-slate-800/50 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md shadow-2xl p-4 flex flex-col gap-3 transition-transform duration-300 ${
            isMobileNavOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="px-2 py-1.5">
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500">
              Wealth Hub Modules
            </span>
          </div>

          <div className="flex-1 flex flex-col gap-2 overflow-y-auto">
            {sidebarItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveWorkspace(item.id);
                  setIsMobileNavOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                  activeWorkspace === item.id
                    ? 'bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 dark:from-emerald-500/15 dark:to-cyan-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/60 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <div className={`p-1.5 rounded-lg ${activeWorkspace === item.id ? 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-500' : 'text-slate-450 dark:text-slate-500'}`}>
                  {item.icon}
                </div>
                <span>{item.label}</span>
              </button>
            ))}

            <button
              onClick={() => {
                handleLogout();
                setIsMobileNavOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-rose-500 hover:bg-rose-500/10 hover:text-rose-600 transition-all mt-2 border border-transparent hover:border-rose-500/25"
            >
              <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500">
                <LogOut className="w-4 h-4" />
              </div>
              <span>Sign Out Session</span>
            </button>
          </div>
        </aside>
      </div>

      {/* Main Structural Columns with perfect Gaps */}
      <div className="w-full max-w-[100vw] px-6 py-6 flex gap-6">
        
        {/* DESKTOP SIDEBAR NAVIGATION (250px Width, sticky) */}
        <aside className="hidden md:flex flex-col w-64 shrink-0 h-[calc(100vh-6.5rem)] sticky top-24 border border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/40 backdrop-blur-md rounded-3xl p-4 gap-1.5 shadow-xl">
          <div className="px-3 py-2.5 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500">
              Wealth Hub Modules
            </span>
          </div>

          <div className="flex-1 flex flex-col gap-1 overflow-y-auto">
            {sidebarItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveWorkspace(item.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                  activeWorkspace === item.id
                    ? 'bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 dark:from-emerald-500/15 dark:to-cyan-500/15 text-emerald-600 dark:text-emerald-400 border-l-4 border-emerald-500 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <div className={`p-1.5 rounded-lg ${activeWorkspace === item.id ? 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-500' : 'text-slate-450 dark:text-slate-500'}`}>
                  {item.icon}
                </div>
                <span>{item.label}</span>
              </button>
            ))}

            {/* Log Out Platform Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-rose-500 hover:bg-rose-500/10 hover:text-rose-600 transition-all mt-2 border border-transparent hover:border-rose-500/25"
            >
              <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500">
                <LogOut className="w-4 h-4" />
              </div>
              <span>Sign Out Session</span>
            </button>
          </div>
        </aside>

        {/* WORKSPACE CONTENT SHELL */}
        <div className="flex-1 min-w-0 space-y-6">
          
          {/* Global Rate Update/Loading indicators */}
          {loadingRates && (
            <div className="flex items-center gap-2 p-2 px-3 bg-indigo-500/10 text-indigo-500 text-[10px] font-extrabold rounded-xl border border-indigo-500/10 w-fit">
              <RefreshCw className="w-3 h-3 animate-spin" /> Live Rates Refreshing...
            </div>
          )}

          {/* Dynamic Switch Workspace Wrapper */}
          <div className="w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeWorkspace}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                {/* 1. ConverterCard workspace */}
                {activeWorkspace === 'converter' && (
                  <div className="space-y-6">
                    <ConverterCard
                      rates={rates}
                      baseCurrency={baseCurrency}
                      setBaseCurrency={setBaseCurrency}
                      targetCurrency={targetCurrency}
                      setTargetCurrency={setTargetCurrency}
                      amount={amount}
                      setAmount={setAmount}
                      favorites={favorites}
                      toggleFavorite={toggleFavorite}
                      addHistoryLog={addHistoryLog}
                      voiceTrigger={voiceTrigger}
                    />
                    {/* MultiCompare placed alongside converter to show details together */}
                    <MultiCompare
                      rates={rates}
                      baseCurrency={baseCurrency}
                      amount={amount}
                    />
                  </div>
                )}

                {/* 2. Crypto widget workspace */}
                {activeWorkspace === 'crypto' && (
                  <div className="space-y-6">
                    <CryptoWidget 
                      rates={rates} 
                      onQuickSelect={handleQuickCryptoSelect} 
                    />
                    <MarketHeatmap rates={rates} />
                  </div>
                )}

                {/* 3. AI advisor workspace */}
                {activeWorkspace === 'advisor' && (
                  <AiAdvisor
                    travelContext={travelContext}
                    clearTravelContext={() => setTravelContext(null)}
                    rates={rates}
                    baseCurrency={baseCurrency}
                    targetCurrency={targetCurrency}
                    amount={amount}
                    history={history}
                  />
                )}

                {/* 4. Travel budget planner workspace */}
                {activeWorkspace === 'travel' && (
                  <TravelBudget
                    rates={rates}
                    baseCurrency={baseCurrency}
                    onTriggerAiAdvisor={handleTriggerAiAdvisor}
                  />
                )}

                {/* 5. Cost of Living comparison workspace */}
                {activeWorkspace === 'col' && (
                  <CostOfLiving
                    rates={rates}
                    baseCurrency={baseCurrency}
                  />
                )}

                {/* 6. Salary Converter workspace */}
                {activeWorkspace === 'salary' && (
                  <SalaryConverter rates={rates} />
                )}

                {/* 7. News & history feed workspace */}
                {activeWorkspace === 'news' && (
                  <NewsSection
                    history={history}
                    clearHistory={clearHistory}
                    favorites={favorites}
                    loadFavoritePair={loadFavoritePair}
                    removeFavorite={removeFavorite}
                  />
                )}

                {/* 8. Notifications alarms alerts workspace */}
                {activeWorkspace === 'alerts' && (
                  <RateAlerts rates={rates} />
                )}

                {/* 9. Historical Chart Analytics workspace */}
                {activeWorkspace === 'charts' && (
                  <TrendChart
                    baseCurrency={baseCurrency}
                    targetCurrency={targetCurrency}
                    darkMode={darkMode}
                  />
                )}

                {/* 10. Profile Settings workspace */}
                {activeWorkspace === 'profile' && (
                  <Profile
                    rates={rates}
                    baseCurrency={baseCurrency}
                    setBaseCurrency={setBaseCurrency}
                    userEmail={userEmail}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Compact Footer */}
          <footer className="text-center text-[9px] font-bold text-slate-400 dark:text-slate-500 pt-6 border-t border-slate-200/50 dark:border-slate-800/50">
            <p>© 2026 XChange Global Wealth Engine. All rights reserved.</p>
          </footer>

        </div>

      </div>
    </div>
  );
}
