import React, { useState, useEffect } from 'react';
import { 
  DollarSign, ArrowRight, Brain, Globe, Zap, Cpu, Sun, Moon, 
  TrendingUp, Bot, Bell, ShieldCheck, Play, ArrowLeftRight, Star, 
  Coins, Plane, Landmark, Receipt, Newspaper, BarChart3, X, Check,
  Briefcase, HeartHandshake, ShieldAlert, ChevronDown, MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LandingPage({ onLaunch, darkMode, setDarkMode }) {
  const [activeNav, setActiveNav] = useState('Home');
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [flash, setFlash] = useState({});

  // Feedback form states
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('UI Suggestion');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [feedbacks, setFeedbacks] = useState(() => {
    const stored = localStorage.getItem('finverse_feedbacks');
    let list = [];
    if (stored) {
      try {
        list = JSON.parse(stored);
      } catch (err) {}
    }
    if (!list || list.length === 0) {
      list = [
        { id: 1, name: 'Emma Wilson', rating: 5, subject: 'UI Suggestion', message: 'The interface is stunning and the dark mode looks extremely premium! It is faster than any converter I have used.', date: '2026-05-30' },
        { id: 2, name: 'Priya Mehta', rating: 5, subject: 'Feature Request', message: 'I absolutely love the real-time AI spending advisor recommendations. It helps me monitor conversion budgets perfectly!', date: '2026-05-29' },
        { id: 3, name: 'Arjun Das', rating: 4, subject: 'App feedback', message: 'Very reliable and simple exchange ratios. Accurate calculations and native alerts synchronized smoothly.', date: '2026-05-28' }
      ];
    }
    // Filter out Jane Smith and duplicates to satisfy user request
    list = list.filter(fb => fb.name && !fb.name.includes('Jane Smith') && !fb.name.includes('JaneSmith'));
    list = list.filter((fb, index, self) => self.findIndex(t => t.message === fb.message && t.name === fb.name) === index);
    localStorage.setItem('finverse_feedbacks', JSON.stringify(list));
    return list;
  });

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    const newFeedback = {
      id: Date.now(),
      name,
      email,
      subject,
      message,
      rating,
      status: 'New',
      date: new Date().toISOString().split('T')[0]
    };

    const stored = localStorage.getItem('finverse_feedbacks');
    let feedbacksList = [];
    if (stored) {
      try {
        feedbacksList = JSON.parse(stored);
      } catch (err) {}
    }
    feedbacksList.unshift(newFeedback);
    // Filter out Jane Smith and duplicates to satisfy user request perfectly
    feedbacksList = feedbacksList.filter(fb => fb.name && !fb.name.includes('Jane Smith') && !fb.name.includes('JaneSmith'));
    feedbacksList = feedbacksList.filter((fb, index, self) => self.findIndex(t => t.message === fb.message && t.name === fb.name) === index);
    localStorage.setItem('finverse_feedbacks', JSON.stringify(feedbacksList));
    setFeedbacks(feedbacksList);

    setSubmitted(true);
    setName('');
    setEmail('');
    setTimeout(() => {
      setSubmitted(false);
      setMessage('');
      setRating(5);
    }, 3000);
  };

  // Dynamic live simulated crypto rates
  const [cryptoPrices, setCryptoPrices] = useState({
    btc: { USD: 67420.50, EUR: 62100.20, INR: 5620800.00, change: 2.84 },
    eth: { USD: 3485.20, EUR: 3210.60, INR: 290680.00, change: 1.95 },
    sol: { USD: 164.50, EUR: 151.70, INR: 13720.00, change: 5.12 },
    xrp: { USD: 0.5240, EUR: 0.4820, INR: 43.70, change: -1.24 }
  });

  // Minor rate jitter to simulate live ticker updates
  useEffect(() => {
    const interval = setInterval(() => {
      const coins = ['btc', 'eth', 'sol', 'xrp'];
      const targetCoin = coins[Math.floor(Math.random() * coins.length)];
      const direction = Math.random() > 0.45 ? 'up' : 'down';
      const jitterFactor = 1 + (direction === 'up' ? 0.0008 : -0.0008);

      setCryptoPrices(prev => {
        const coinData = prev[targetCoin];
        const nextUSD = parseFloat((coinData.USD * jitterFactor).toFixed(targetCoin === 'xrp' ? 4 : 2));
        const nextEUR = parseFloat((coinData.EUR * jitterFactor).toFixed(targetCoin === 'xrp' ? 4 : 2));
        const nextINR = parseFloat((coinData.INR * jitterFactor).toFixed(2));
        const nextChange = parseFloat((coinData.change + (direction === 'up' ? 0.05 : -0.05)).toFixed(2));

        return {
          ...prev,
          [targetCoin]: {
            USD: nextUSD,
            EUR: nextEUR,
            INR: nextINR,
            change: nextChange
          }
        };
      });

      // Flashing animation state handler
      setFlash(prev => ({ ...prev, [targetCoin]: direction }));
      setTimeout(() => {
        setFlash(prev => ({ ...prev, [targetCoin]: null }));
      }, 800);

    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Sync body background color dynamically with the active landing page theme color
  useEffect(() => {
    if (darkMode) {
      document.body.style.backgroundColor = '#070b19';
    } else {
      document.body.style.backgroundColor = '#f8fafc';
    }
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, [darkMode]);

  const navItems = ['Home', 'Features', 'Crypto', 'Charts', 'About', 'Pricing'];

  const sparklines = {
    green: "M 0 15 Q 10 5, 20 18 T 40 8 T 60 12 T 80 4 T 100 10",
    red: "M 0 10 Q 10 18, 20 8 T 40 16 T 60 14 T 80 18 T 100 15",
    purple: "M 0 20 Q 15 5, 30 25 T 60 10 T 90 15 T 120 5",
    blue: "M 0 15 Q 20 30, 40 10 T 80 20 T 120 8"
  };

  const handleNavClick = (item) => {
    setActiveNav(item);
    if (item === 'Home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (item === 'Features') {
      document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' });
    } else if (item === 'Crypto') {
      document.getElementById('crypto-pulse-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (item === 'Charts') {
      document.getElementById('charts-card')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (item === 'About') {
      document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth' });
    } else if (item === 'Pricing') {
      setShowPricingModal(true);
    }
  };

  const formatPrice = (value, coin) => {
    const symbols = { USD: '$', EUR: '€', INR: '₹' };
    const prefix = symbols[selectedCurrency] || '';
    if (coin === 'xrp') {
      return `${prefix}${value.toFixed(4)}`;
    }
    return `${prefix}${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const cryptoList = [
    {
      id: 'btc',
      name: 'Bitcoin',
      symbol: 'BTC',
      icon: '₿',
      bgClass: 'bg-gradient-to-tr from-amber-600 to-amber-400 shadow-amber-500/25',
      glowClass: 'bg-amber-500',
      sparkline: 'M 0 20 Q 20 10, 40 22 T 80 5 T 120 12',
    },
    {
      id: 'eth',
      name: 'Ethereum',
      symbol: 'ETH',
      icon: 'Ξ',
      bgClass: 'bg-gradient-to-tr from-purple-650 to-purple-400 shadow-purple-500/25',
      glowClass: 'bg-purple-500',
      sparkline: 'M 0 15 Q 15 25, 30 10 T 70 18 T 120 6',
    },
    {
      id: 'sol',
      name: 'Solana',
      symbol: 'SOL',
      icon: 'S',
      bgClass: 'bg-gradient-to-tr from-cyan-600 to-emerald-400 shadow-cyan-500/25',
      glowClass: 'bg-cyan-500',
      sparkline: 'M 0 25 Q 20 5, 45 28 T 90 8 T 120 15',
    },
    {
      id: 'xrp',
      name: 'Ripple',
      symbol: 'XRP',
      icon: 'X',
      bgClass: 'bg-gradient-to-tr from-blue-600 to-blue-450 shadow-blue-500/25',
      glowClass: 'bg-blue-500',
      sparkline: 'M 0 10 Q 15 22, 40 8 T 80 18 T 120 15',
    }
  ];

  const powerfulFeatures = [
    {
      id: "converter-card",
      icon: <ArrowLeftRight className="w-5 h-5 text-emerald-500" />,
      title: "Currency Converter",
      description: "Convert 150+ currencies with real-time rates.",
      sparkline: sparklines.green,
      color: "text-emerald-500"
    },
    {
      id: "crypto-card",
      icon: <Coins className="w-5 h-5 text-purple-500" />,
      title: "Crypto Converter",
      description: "Buy, sell & convert cryptocurrencies.",
      sparkline: sparklines.purple,
      color: "text-purple-500"
    },
    {
      id: "ai-card",
      icon: <Brain className="w-5 h-5 text-indigo-500" />,
      title: "AI Spending Advisor",
      description: "Get AI-powered insights for smart spending.",
      sparkline: sparklines.blue,
      color: "text-indigo-500"
    },
    {
      id: "travel-card",
      icon: <Plane className="w-5 h-5 text-blue-500" />,
      title: "Travel Budget",
      description: "Plan your trip and estimate your daily budget.",
      sparkline: sparklines.purple,
      color: "text-blue-500"
    },
    {
      id: "alerts-card",
      icon: <Bell className="w-5 h-5 text-rose-500" />,
      title: "Rate Alerts",
      description: "Set alerts & get notified for rate changes.",
      sparkline: sparklines.red,
      color: "text-rose-500"
    },
    {
      id: "charts-card",
      icon: <BarChart3 className="w-5 h-5 text-emerald-500" />,
      title: "Charts & Analytics",
      description: "Analyze trends with powerful charts.",
      sparkline: sparklines.green,
      color: "text-emerald-500"
    },
    {
      id: "heatmap-card",
      icon: <Landmark className="w-5 h-5 text-orange-500" />,
      title: "Heatmap Dashboard",
      description: "Track top gainers & losers in real-time.",
      sparkline: sparklines.red,
      color: "text-orange-500"
    },
    {
      id: "news-card",
      icon: <Newspaper className="w-5 h-5 text-blue-500" />,
      title: "News & Insights",
      description: "Stay updated with latest finance news.",
      sparkline: sparklines.blue,
      color: "text-blue-500"
    }
  ];

  return (
    <div className={`min-h-screen flex flex-col justify-between transition-colors duration-300 overflow-x-hidden font-sans relative selection:bg-purple-500/30 ${
      darkMode ? 'bg-[#070b19] text-white' : 'bg-[#f8fafc] text-slate-900'
    }`}>
      
      {/* Ambient Meshes */}
      {darkMode && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.07)_0%,transparent_70%)] transform-gpu" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.07)_0%,transparent_70%)] transform-gpu" />
        </div>
      )}

      {/* Main Content Body Wrapper */}
      <div className="flex-grow flex flex-col w-full">

      {/* 1. DYNAMIC NAVIGATION HEADER */}
      <header className={`sticky top-0 z-50 w-full backdrop-blur-md border-b px-6 lg:px-16 h-20 flex items-center justify-between transition-all ${
        darkMode ? 'bg-[#070b19]/60 border-white/5' : 'bg-white/80 border-slate-200/80'
      }`}>
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 flex items-center justify-center">
            {/* Rotating background gradient glow */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-600 to-blue-500 opacity-20 blur-[4px] animate-pulse" />
            
            {/* High-fidelity SVG logo with custom inline animations */}
            <svg 
              viewBox="0 0 100 100" 
              preserveAspectRatio="xMidYMid meet"
              className="w-10 h-10 relative z-10 drop-shadow-[0_2px_8px_rgba(147,51,234,0.3)]"
            >
              <defs>
                <linearGradient id="nav-logo-grad-landing" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
              
              {/* Central Dollar Sign - pulsing gently */}
              <text
                x="50%"
                y="55%"
                dominantBaseline="middle"
                textAnchor="middle"
                fill="url(#nav-logo-grad-landing)"
                className="font-black text-[38px] select-none"
                style={{ 
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  animation: 'pulse 2s ease-in-out infinite',
                  fill: 'url(#nav-logo-grad-landing)'
                }}
              >
                $
              </text>
              
              {/* Rotating arrows group - slowly spinning clockwise */}
              <g 
                style={{ 
                  animation: 'spin 12s linear infinite', 
                  transformOrigin: 'center' 
                }}
              >
                {/* Top-Right Arc */}
                <path
                  d="M 22 40 A 32 32 0 0 1 78 30"
                  fill="none"
                  stroke="url(#nav-logo-grad-landing)"
                  strokeWidth="7"
                  strokeLinecap="round"
                />
                {/* Top-Right Arrowhead */}
                <path
                  d="M 72 24 L 80 30 L 75 38"
                  fill="none"
                  stroke="url(#nav-logo-grad-landing)"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Bottom-Left Arc */}
                <path
                  d="M 78 60 A 32 32 0 0 1 22 70"
                  fill="none"
                  stroke="url(#nav-logo-grad-landing)"
                  strokeWidth="7"
                  strokeLinecap="round"
                />
                {/* Bottom-Left Arrowhead */}
                <path
                  d="M 28 76 L 20 70 L 25 62"
                  fill="none"
                  stroke="url(#nav-logo-grad-landing)"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            </svg>
          </div>
          <div>
            <span className={`font-extrabold text-lg tracking-tight block -mb-0.5 ${
              darkMode ? 'bg-gradient-to-r from-white to-slate-355 bg-clip-text text-transparent' : 'text-slate-900'
            }`}>
              FinVerse
            </span>
            <span className={`font-semibold text-[9px] block uppercase tracking-widest font-bold ${
              darkMode ? 'text-purple-400' : 'text-purple-650'
            }`}>
              Currency Converter
            </span>
          </div>
        </div>

        {/* Center Nav Menu Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => handleNavClick(item)}
              className={`text-xs font-bold transition-all relative py-2 cursor-pointer ${
                darkMode 
                  ? (activeNav === item ? 'text-white' : 'text-slate-400 hover:text-white')
                  : (activeNav === item ? 'text-purple-650 font-black' : 'text-slate-500 hover:text-slate-855')
              }`}
            >
              <span>{item}</span>
              {activeNav === item && (
                <motion.div 
                  layoutId="activeNavIndicator"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                />
              )}
            </button>
          ))}
        </nav>

        {/* Right Action Trigger Box */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              darkMode ? 'bg-white/5 border-white/5 text-slate-400 hover:text-white' : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
            title="Toggle Theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-purple-600" />}
          </button>

          <button
            onClick={() => onLaunch('login')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              darkMode 
                ? 'text-slate-300 bg-white/[0.02] border-white/5 hover:bg-white/[0.07]' 
                : 'text-slate-700 bg-white border-slate-200/80 hover:bg-slate-50 shadow-sm'
            }`}
          >
            Sign In
          </button>

          <button
            onClick={() => onLaunch('signup')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 text-white text-xs font-bold shadow-lg shadow-purple-500/15 hover:shadow-purple-500/25 hover:scale-105 transition-all cursor-pointer"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* 2. HERO SPLIT SECTION */}
      <section className="relative px-6 lg:px-20 pt-1 pb-1 max-w-[95%] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-center">
        
        {/* Left Column: Copy & Actions */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            Convert. Compare. <br />
            <span className="bg-gradient-to-r from-purple-550 via-indigo-500 to-blue-500 bg-clip-text text-transparent animate-pulse">Conquer.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`text-sm sm:text-base font-semibold leading-relaxed max-w-md ${
              darkMode ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            Your all-in-one finance companion for currency conversion, crypto tracking, smart spending & global insights.
          </motion.p>

          <div className="flex flex-col sm:flex-row gap-3 w-full pt-1">
            <button
              onClick={() => onLaunch('signup')}
              className="px-7 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-500 text-white font-extrabold text-xs shadow-xl shadow-purple-500/10 hover:shadow-purple-500/25 hover:scale-103 transition-all duration-350 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleNavClick('Features')}
              className={`px-7 py-4 rounded-2xl border font-extrabold text-xs transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                darkMode 
                  ? 'bg-white/[0.02] border-white/5 hover:bg-white/[0.07] text-slate-300' 
                  : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm'
              }`}
            >
              <span>Explore Features</span>
            </button>
          </div>
        </div>

        {/* Right Column: Angled Dashboard Mockup */}
        <div className="lg:col-span-7 flex justify-center relative">
          <div className="absolute w-[80%] h-[80%] bg-purple-500/5 blur-[80px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

          <motion.div 
            initial={{ opacity: 0, x: 50, rotateY: -10 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ type: 'spring', duration: 0.8 }}
            className={`w-full border rounded-[30px] shadow-2xl p-5 overflow-hidden flex flex-col justify-center relative select-none ${
              darkMode ? 'bg-[#0a0f24] border-white/10' : 'bg-white border-slate-200/80 shadow-2xl shadow-purple-500/5'
            }`}
          >
            <div className="relative w-full h-72 flex items-center justify-center overflow-hidden py-10 rounded-2xl bg-slate-100/30 dark:bg-slate-950/20 border border-slate-200/50 dark:border-white/5">
              
              <div className="absolute left-6 bottom-12 flex items-end gap-2.5 z-20">
                <div className="w-4 h-16 bg-gradient-to-t from-cyan-500 to-cyan-300 rounded-full shadow-lg shadow-cyan-500/20 animate-pulse" />
                <div className="w-4 h-24 bg-gradient-to-t from-blue-600 to-blue-400 rounded-full shadow-lg shadow-blue-550/20" style={{ animationDelay: '0.5s' }} />
                <div className="w-4 h-12 bg-gradient-to-t from-emerald-500 to-emerald-350 rounded-full shadow-lg shadow-emerald-500/20 animate-bounce" />
              </div>

              <div className="absolute w-28 h-28 bg-gradient-to-tr from-blue-600 via-indigo-650 to-purple-500 rounded-full shadow-xl shadow-purple-500/10 flex items-center justify-center z-10 transform-gpu">
                <Globe className="w-14 h-14 text-white/20 animate-spin transform-gpu" style={{ animationDuration: '20s' }} />
              </div>

              <div className="absolute w-48 h-48 border border-slate-350 dark:border-white/10 rounded-full animate-spin pointer-events-none transform-gpu" style={{ animationDuration: '6s' }} />
              <div className="absolute w-56 h-28 border border-purple-500/20 rounded-full animate-pulse pointer-events-none rotate-45 transform-gpu" />

              <motion.div 
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
                className="absolute top-6 left-16 w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center font-bold text-emerald-600 text-xs shadow-md transform-gpu"
              >
                $
              </motion.div>
              <motion.div 
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute top-10 right-20 w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center font-bold text-indigo-500 text-xs shadow-md transform-gpu"
              >
                €
              </motion.div>
              <motion.div 
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                className="absolute bottom-8 right-28 w-8 h-8 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center font-bold text-purple-600 text-xs shadow-md transform-gpu"
              >
                £
              </motion.div>
              <motion.div 
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                className="absolute bottom-16 right-6 w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center font-bold text-amber-600 text-xs shadow-md transform-gpu"
              >
                ¥
              </motion.div>

              <div className={`absolute bottom-4 right-4 z-30 border rounded-2xl p-4 shadow-xl flex flex-col gap-2.5 w-64 ${
                darkMode ? 'bg-slate-900/90 border-white/10' : 'bg-white/95 border-slate-250 shadow-purple-500/5'
              }`}>
                <div className="bg-slate-50 dark:bg-slate-950/40 p-2 rounded-xl border border-slate-200/50 dark:border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-[7px] text-slate-500 block uppercase font-bold">You send</span>
                    <span className="text-[10px] font-black">1,000</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-700 dark:text-slate-300">
                    <span>🇺🇸 USD</span>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950/40 p-2 rounded-xl border border-slate-200/50 dark:border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-[7px] text-slate-500 block uppercase font-bold">You receive</span>
                    <span className="text-[10px] font-black">83,425.00</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-700 dark:text-slate-300">
                    <span>🇮🇳 INR</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[7px] text-slate-500 font-bold border-t border-slate-100 dark:border-white/5 pt-2">
                  <span>1 USD = 83.425 INR</span>
                  <span className="text-emerald-600 flex items-center gap-0.5 font-extrabold">
                    <TrendingUp className="w-2.5 h-2.5" /> +0.45%
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. DYNAMIC CRYPTO PULSE TICKER MODULE */}
      <section 
        id="crypto-pulse-section"
        className="px-6 lg:px-20 pt-2 pb-6 max-w-[95%] mx-auto"
      >
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="text-center space-y-2 flex flex-col items-center">
            <div className="flex items-center gap-1.5 mb-1 justify-center">
              <Coins className="w-3.5 h-3.5 text-purple-500 animate-spin" style={{ animationDuration: '4s' }} />
              <span className="text-[9px] font-black tracking-widest text-purple-600 dark:text-purple-400 uppercase block">Live Web3 Telemetry</span>
            </div>
            <h2 className={`text-2xl sm:text-4xl font-extrabold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Decentralized Market Pulse
            </h2>
            <p className={`text-xs sm:text-sm font-semibold ${darkMode ? 'text-slate-450' : 'text-slate-500'} max-w-2xl mx-auto`}>
              Track real-time pricing and variations across major cryptocurrencies.
            </p>
            
            <div className="flex bg-slate-100 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 p-1 rounded-xl w-fit mt-3 shadow-inner">
              {['USD', 'EUR', 'INR'].map((cur) => (
                <button
                  key={cur}
                  onClick={() => setSelectedCurrency(cur)}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                    selectedCurrency === cur
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-350'
                  }`}
                >
                  {cur}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cryptoList.map((coin) => {
              const priceInfo = cryptoPrices[coin.id];
              const displayPrice = priceInfo ? priceInfo[selectedCurrency] : 0;
              const changeVal = priceInfo ? priceInfo.change : 0;
              const isFlashUp = flash[coin.id] === 'up';
              const isFlashDown = flash[coin.id] === 'down';

              return (
                <motion.div
                  key={coin.id}
                  whileHover={{ y: -5 }}
                  className={`relative border rounded-[24px] p-5 overflow-hidden transition-all duration-300 shadow-sm flex flex-col justify-between h-[250px] ${
                    darkMode
                      ? 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04] hover:border-purple-500/20'
                      : 'bg-white border-slate-200 hover:border-purple-500/30 hover:shadow-lg'
                  }`}
                >
                  {/* Visual Ambient Glow */}
                  <div className={`absolute -top-16 -right-16 w-32 h-32 rounded-full blur-3xl opacity-[0.04] pointer-events-none ${coin.glowClass}`} />

                  <div>
                    <div className="flex items-center justify-between mb-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-white shadow-md text-sm ${coin.bgClass}`}>
                          {coin.icon}
                        </div>
                        <div>
                          <h4 className={`text-xs font-black leading-none ${darkMode ? 'text-white' : 'text-slate-800'}`}>{coin.name}</h4>
                          <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-0.5 block">{coin.symbol}</span>
                        </div>
                      </div>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border transition-colors ${
                        changeVal >= 0 
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' 
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                      }`}>
                        {changeVal >= 0 ? '+' : ''}{changeVal}%
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">Index Exchange Price</span>
                      <div className={`text-lg font-black tracking-tight transition-all duration-300 ${
                        isFlashUp ? 'text-emerald-500 scale-105 font-extrabold' : isFlashDown ? 'text-rose-500 scale-105 font-extrabold' : (darkMode ? 'text-white' : 'text-slate-850')
                      }`}>
                        {formatPrice(displayPrice, coin.id)}
                      </div>
                    </div>
                  </div>

                  {/* Micro trendsparkline graphic */}
                  <div className="h-8 w-full overflow-hidden mt-3">
                    <svg className="w-full h-full text-current fill-none stroke-2" viewBox="0 0 100 30">
                      <path d={coin.sparkline} className={changeVal >= 0 ? 'text-emerald-500' : 'text-rose-550'} />
                    </svg>
                  </div>

                  <button
                    onClick={() => onLaunch('login')}
                    className="w-full py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 text-[10px] font-black text-slate-700 dark:text-slate-350 hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-3"
                  >
                    <span>Trade {coin.symbol}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. CORE FEATURES GRID OVERVIEW SECTION */}
      <section 
        id="features-section"
        className={`px-6 lg:px-20 py-6 border-t ${
          darkMode ? 'border-white/5 bg-slate-950/20' : 'border-slate-250 bg-slate-50/50'
        }`}
      >
        <div className="max-w-[95%] mx-auto space-y-8">
          
          <div className="text-center space-y-2">
            <h2 className={`text-2xl sm:text-4xl font-extrabold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Powerful Features for Smart Finance
            </h2>
            <p className={`text-xs sm:text-sm font-semibold ${darkMode ? 'text-slate-450' : 'text-slate-500'}`}>
              Everything you need to manage your money globally
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {powerfulFeatures.map((feat, i) => {
              const colorClass = feat.color.replace('text-', '');
              return (
                <motion.div
                  key={i}
                  id={feat.id}
                  whileHover={{ 
                    y: -8, 
                    scale: 1.02,
                    boxShadow: darkMode 
                      ? "0 20px 40px -20px rgba(139, 92, 246, 0.35)" 
                      : "0 20px 40px -20px rgba(99, 102, 241, 0.15)",
                    borderColor: darkMode ? "rgba(168, 85, 247, 0.4)" : "rgba(139, 92, 246, 0.35)"
                  }}
                  transition={{ type: "spring", stiffness: 350, damping: 20 }}
                  className={`group border rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between h-48 transition-all duration-300 shadow-sm ${
                    darkMode 
                      ? 'bg-gradient-to-b from-[#0b1021] to-[#050813] border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]' 
                      : 'bg-white border-slate-200 hover:shadow-md'
                  }`}
                >
                  {/* Premium visual ambient hover glow */}
                  <div className={`absolute -top-16 -right-16 w-32 h-32 rounded-full blur-3xl opacity-[0.04] dark:opacity-[0.09] pointer-events-none transition-all duration-300 group-hover:scale-125 bg-${colorClass}`} />

                  <div className="space-y-3 relative z-10">
                    <div className={`p-2.5 bg-slate-100 dark:bg-white/[0.05] border border-slate-200/50 dark:border-white/10 rounded-xl w-fit ${feat.color}`}>
                      {feat.icon}
                    </div>
                    <div>
                      <h4 className={`text-xs font-black ${darkMode ? 'text-white' : 'text-slate-800'}`}>{feat.title}</h4>
                      <p className={`text-[10px] font-semibold leading-relaxed mt-1 ${darkMode ? 'text-slate-300' : 'text-slate-500'}`}>{feat.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2 mt-auto relative z-10">
                    <button 
                      onClick={() => onLaunch('login')}
                      className={`text-[9px] font-black cursor-pointer flex items-center gap-0.5 transition-colors ${
                        darkMode ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-850'
                      }`}
                    >
                      <span>Try Now</span>
                      <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                    
                    <svg className="w-16 h-5 text-current fill-none stroke-1" viewBox="0 0 100 20">
                      <path d={feat.sparkline} className={`${darkMode ? 'text-purple-400/80' : feat.color}`} />
                    </svg>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 5. SOLID BLUE METRICS BANNER */}
      <section className="px-6 lg:px-16 pb-3">
        <div className="max-w-7xl mx-auto bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-[32px] p-5 sm:p-6 shadow-xl relative overflow-hidden grid grid-cols-2 lg:grid-cols-4 gap-4 text-center text-white">
          
          <div className="space-y-1">
            <div className="p-3 bg-white/10 rounded-full w-fit mx-auto text-white">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black">150+</h3>
            <span className="text-[10px] font-bold text-slate-200 uppercase tracking-wider block">Currencies</span>
          </div>

          <div className="space-y-1">
            <div className="p-3 bg-white/10 rounded-full w-fit mx-auto text-white">
              <Coins className="w-5 h-5" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black">50+</h3>
            <span className="text-[10px] font-bold text-slate-200 uppercase tracking-wider block">Cryptocurrencies</span>
          </div>

          <div className="space-y-1">
            <div className="p-3 bg-white/10 rounded-full w-fit mx-auto text-white">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black">1M+</h3>
            <span className="text-[10px] font-bold text-slate-200 uppercase tracking-wider block">Conversions</span>
          </div>

          <div className="space-y-1">
            <div className="p-3 bg-white/10 rounded-full w-fit mx-auto text-white">
              <Plane className="w-5 h-5" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black">200+</h3>
            <span className="text-[10px] font-bold text-slate-200 uppercase tracking-wider block">Nations Covered</span>
          </div>

        </div>
      </section>
            {/* 5.5 PREMIUM USER FEEDBACK & RATING SYSTEM */}
      <section className="px-4 sm:px-6 py-3 max-w-4xl mx-auto space-y-2">
        <div className={`max-w-3xl mx-auto p-3.5 sm:p-4 rounded-[22px] border relative overflow-hidden transition-all duration-300 ${
          darkMode
            ? 'border-white/10 bg-gradient-to-r from-[#1d4ed8] via-[#1e3a8a] to-[#020a22] shadow-[0_20px_60px_-30px_rgba(30,64,175,0.75)]'
            : 'border-slate-200 bg-gradient-to-r from-sky-50 via-indigo-50 to-blue-100 shadow-[0_16px_50px_-30px_rgba(59,130,246,0.45)]'
        }`}>
          <div className="absolute -top-10 -left-10 w-28 h-28 bg-violet-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-28 h-28 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-[95%] xl:max-w-6xl mx-auto space-y-4 relative z-10">

          <div className="flex flex-col items-center justify-center space-y-1.5 mb-3">
            <div className="relative w-7 h-7 flex items-center justify-center">
              {/* Rotating background gradient glow */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-600 to-blue-500 opacity-20 blur-[3px] animate-pulse" />
              
              {/* High-fidelity SVG logo with custom inline animations */}
              <svg 
                viewBox="0 0 100 100" 
                preserveAspectRatio="xMidYMid meet"
                className="w-7 h-7 relative z-10 drop-shadow-[0_2px_8px_rgba(147,51,234,0.3)]"
              >
                <defs>
                  <linearGradient id="nav-logo-grad-feedback" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
                
                {/* Central Dollar Sign - pulsing gently */}
                <text
                  x="50%"
                  y="55%"
                  dominantBaseline="middle"
                  textAnchor="middle"
                  fill="url(#nav-logo-grad-feedback)"
                  className="font-black text-[38px] select-none"
                  style={{ 
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    animation: 'pulse 2s ease-in-out infinite',
                    fill: 'url(#nav-logo-grad-feedback)'
                  }}
                >
                  $
                </text>
                
                {/* Rotating arrows group - slowly spinning clockwise */}
                <g 
                  style={{ 
                    animation: 'spin 12s linear infinite', 
                    transformOrigin: 'center' 
                  }}
                >
                  {/* Top-Right Arc */}
                  <path
                    d="M 22 40 A 32 32 0 0 1 78 30"
                    fill="none"
                    stroke="url(#nav-logo-grad-feedback)"
                    strokeWidth="7"
                    strokeLinecap="round"
                  />
                  {/* Top-Right Arrowhead */}
                  <path
                    d="M 72 24 L 80 30 L 75 38"
                    fill="none"
                    stroke="url(#nav-logo-grad-feedback)"
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Bottom-Left Arc */}
                  <path
                    d="M 78 60 A 32 32 0 0 1 22 70"
                    fill="none"
                    stroke="url(#nav-logo-grad-feedback)"
                    strokeWidth="7"
                    strokeLinecap="round"
                  />
                  {/* Bottom-Left Arrowhead */}
                  <path
                    d="M 28 76 L 20 70 L 25 62"
                    fill="none"
                    stroke="url(#nav-logo-grad-feedback)"
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </svg>
            </div>
            <h3 className={`text-xs sm:text-sm font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Share Your Feedback & Suggestions</h3>
            <p className={`text-[9px] ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Help us improve FinVerse with quick suggestions.</p>
          </div>

          {submitted ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-10 space-y-3 text-center"
            >
              <div className="w-14 h-14 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 animate-pulse">
                <Check className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-bold text-slate-800 dark:text-white">Thank You for Your Feedback!</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">Your ratings and recommendations have been transmitted to the Administrator Dashboard logs in real-time.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleFeedbackSubmit} className="space-y-3">
              <div className="flex flex-col items-center gap-1">
                <span className={`text-[11px] font-bold uppercase tracking-wider ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Your Rating</span>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star 
                        className={`w-6 h-6 transition-all ${
                          star <= (hoverRating || rating) 
                            ? 'fill-yellow-400 text-yellow-400 filter drop-shadow-[0_0_6px_rgba(250,204,21,0.45)]' 
                            : (darkMode ? 'text-slate-500' : 'text-slate-300')
                        }`} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                <div>
                  <label className={`block text-[11px] font-bold mb-1.5 uppercase tracking-wider ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className={`w-full rounded-xl text-xs font-semibold px-3 py-2.5 outline-none focus:border-blue-400/60 focus:ring-2 focus:ring-blue-500/20 ${
                      darkMode
                        ? 'border border-white/10 bg-[#0b1a3a] text-slate-100 placeholder:text-slate-400/80'
                        : 'border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-[11px] font-bold mb-1.5 uppercase tracking-wider ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className={`w-full rounded-xl text-xs font-semibold px-3 py-2.5 outline-none focus:border-blue-400/60 focus:ring-2 focus:ring-blue-500/20 ${
                      darkMode
                        ? 'border border-white/10 bg-[#0b1a3a] text-slate-100 placeholder:text-slate-400/80'
                        : 'border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr_auto] gap-2.5 items-end">
                <div>
                <label className={`block text-[11px] font-bold mb-1.5 uppercase tracking-wider ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Topic / Category</label>
                <div className="relative flex items-center">
                  {/* Small spinning brand logo prefix */}
                  <div className="absolute left-3 w-4 h-4 flex items-center justify-center pointer-events-none z-20">
                    <svg viewBox="0 0 100 100" className="w-3.5 h-3.5 text-purple-500 animate-spin" style={{ animationDuration: '8s' }}>
                      <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="currentColor" className="font-black text-[38px] select-none">$</text>
                      <g stroke="currentColor" strokeWidth="7" fill="none">
                        <path d="M 22 40 A 32 32 0 0 1 78 30" />
                        <path d="M 78 60 A 32 32 0 0 1 22 70" />
                      </g>
                    </svg>
                  </div>
                  
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className={`w-full rounded-xl text-xs font-semibold pl-9 pr-8 py-2.5 outline-none focus:border-blue-400/60 focus:ring-2 focus:ring-blue-500/20 appearance-none cursor-pointer relative z-10 ${
                      darkMode
                        ? 'border border-white/10 bg-[#0b1a3a] text-slate-100'
                        : 'border border-slate-200 bg-white text-slate-800'
                    }`}
                  >
                    <option value="App feedback" className={darkMode ? 'bg-slate-905 text-white' : 'bg-white text-slate-800'}>✨ General Feedback</option>
                    <option value="Rate Alert issue" className={darkMode ? 'bg-slate-905 text-white' : 'bg-white text-slate-800'}>🔔 Rate Alerts Telemetry</option>
                    <option value="Bug Report" className={darkMode ? 'bg-slate-905 text-white' : 'bg-white text-slate-800'}>🐛 Critical Bug Report</option>
                    <option value="Feature Request" className={darkMode ? 'bg-slate-905 text-white' : 'bg-white text-slate-800'}>🚀 Feature Request</option>
                    <option value="UI Suggestion" className={darkMode ? 'bg-slate-905 text-white' : 'bg-white text-slate-800'}>🎨 UI/UX Suggestion</option>
                  </select>

                  {/* Dropdown Chevron indicator */}
                  <div className="absolute right-3 pointer-events-none text-slate-400 z-20">
                    <ChevronDown className="w-3.5 h-3.5" />
                  </div>
                </div>
                </div>
                <div>
                <label className={`block text-[11px] font-bold mb-1.5 uppercase tracking-wider ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Your Suggestions</label>
                <input
                  type="text"
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what you like..."
                  className={`w-full rounded-xl text-xs font-semibold px-3 py-2.5 outline-none focus:border-blue-400/60 focus:ring-2 focus:ring-blue-500/20 ${
                    darkMode
                      ? 'border border-white/10 bg-[#0b1a3a] text-slate-100 placeholder:text-slate-400/80'
                      : 'border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400'
                  }`}
                />
                </div>
                <button
                type="submit"
                className="w-full lg:w-auto lg:min-w-[170px] py-2.5 px-4 rounded-xl bg-gradient-to-r from-fuchsia-600 to-blue-500 text-white font-extrabold text-xs shadow-lg shadow-blue-500/20 active:scale-[0.98] hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Submit Feedback</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              </div>
            </form>
          )}

          {/* DYNAMIC LIVE FEEDBACKS STREAM */}
          <div className="mt-5 pt-3.5 border-t border-slate-200/50 dark:border-white/5 space-y-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-3.5 h-3.5 text-indigo-500 animate-bounce" />
              <h4 className={`text-[10px] font-black uppercase tracking-wider ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                Live User Suggestions & Telemetry
              </h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {feedbacks.slice(0, 3).map((fb, idx) => {
                const initials = fb.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
                return (
                  <motion.div
                    key={fb.id || idx}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ 
                      y: -4, 
                      scale: 1.015,
                      boxShadow: "0 15px 30px -12px rgba(99, 102, 241, 0.15)",
                      borderColor: "rgba(168, 85, 247, 0.3)"
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={`p-3 rounded-xl border transition-all relative overflow-hidden flex flex-col justify-between h-34 ${
                      darkMode 
                        ? 'bg-slate-950/40 border-white/5 hover:bg-slate-900/60' 
                        : 'bg-white/80 border-slate-200/60 hover:bg-white shadow-sm'
                    }`}
                  >
                    {/* Corner Logo Watermark */}
                    <div className="absolute top-2 right-2 w-6 h-6 opacity-10 pointer-events-none">
                      <svg viewBox="0 0 100 100" className="w-full h-full text-current">
                        <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="currentColor" className="font-black text-[38px]">$</text>
                        <g stroke="currentColor" strokeWidth="7" fill="none">
                          <path d="M 22 40 A 32 32 0 0 1 78 30" />
                          <path d="M 78 60 A 32 32 0 0 1 22 70" />
                        </g>
                      </svg>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-[9px] font-black text-white shadow-sm">
                            {initials}
                          </div>
                          <div>
                            <h5 className={`text-[10px] font-extrabold leading-none ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>{fb.name}</h5>
                            <span className="text-[7px] text-slate-400 font-bold block mt-0.5">{fb.subject}</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star 
                              key={s} 
                              className={`w-2.5 h-2.5 ${
                                s <= fb.rating 
                                  ? 'fill-yellow-400 text-yellow-400 filter drop-shadow-[0_0_2px_rgba(250,204,21,0.5)]' 
                                  : 'text-slate-300 dark:text-slate-650'
                              }`} 
                            />
                          ))}
                        </div>
                      </div>
                      
                      <p className={`text-[9px] font-semibold leading-relaxed line-clamp-3 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        "{fb.message}"
                      </p>
                    </div>
                    
                    <div className="flex justify-between items-center text-[7px] text-slate-400 font-bold border-t border-slate-100 dark:border-white/5 pt-2 mt-2">
                      <span>Telemetry Verified</span>
                      <span>{fb.date}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
        </div>

      </section>

      </div>

      <footer
        id="about-section"
        className={`w-full pt-6 pb-2 px-4 sm:px-6 lg:px-12 bg-transparent text-[10px] font-bold ${
          darkMode ? 'text-slate-400' : 'text-slate-500'
        }`}
      >
        <div className="max-w-full mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 FinVerse Currency Converter.</p>
          <div className={`flex items-center gap-4 text-[10px] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            <span className="flex items-center gap-1"><Cpu className="w-3.5 h-3.5 text-purple-500" /> 256-bit Encryption</span>
            <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-500" /> Privacy Protected</span>
          </div>
        </div>
      </footer>

      {/* GLASS PRICING MODAL */}
      <AnimatePresence>
        {showPricingModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPricingModal(false)}
              className="absolute inset-0 bg-[#070b19]/60 backdrop-blur-md cursor-pointer"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[32px] p-8 shadow-2xl overflow-hidden text-slate-800 dark:text-white"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-tr from-purple-500 to-blue-500 blur-xl opacity-20 pointer-events-none" />

              <button
                onClick={() => setShowPricingModal(false)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center space-y-2 mb-6">
                <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto text-purple-650 animate-bounce">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black">FinVerse Launch Special 🚀</h3>
                <span className="text-[10px] font-black tracking-wider uppercase text-purple-650 bg-purple-500/10 px-3 py-1 rounded-full inline-block">
                  100% Free Access
                </span>
              </div>

              <div className="space-y-4 text-xs font-semibold leading-relaxed text-slate-500 dark:text-slate-355 text-center">
                <p>
                  Experience institutional foreign exchange rates, real-time AI spending analytics, and crypto conversion tools at **absolutely zero cost** during our global platform launch.
                </p>
                <p className="text-slate-400 dark:text-slate-455 font-bold">
                  No credit card required. No hidden fees. Cancel anytime.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3.5 my-6 max-w-sm mx-auto">
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-700 dark:text-slate-200">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>150+ Fiat Exchange</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-700 dark:text-slate-200">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>50+ Crypto Swaps</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-700 dark:text-slate-200">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>AI Spending Advisor</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-700 dark:text-slate-200">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Live Exchange Rates</span>
                </div>
              </div>

              <button
                onClick={() => { setShowPricingModal(false); onLaunch('signup'); }}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-500 text-white font-extrabold text-xs shadow-lg shadow-purple-500/15 hover:shadow-purple-500/25 hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                <span>Unlock Full Access Free</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}


