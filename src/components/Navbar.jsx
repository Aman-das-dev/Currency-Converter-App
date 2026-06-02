import React from 'react';
import { Sun, Moon, Mic, LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar({ darkMode, setDarkMode, onStartVoice, onOpenProfile, isAdmin, onOpenAdmin }) {
  const profileName = localStorage.getItem('xchange_profile_name') || 'Aman Das';
  const initials = profileName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/50 dark:border-slate-800/50 backdrop-blur-md">
      {/* Main Nav Header */}
      <div className="w-full px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
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
                <linearGradient id="nav-logo-grad" x1="0%" y1="100%" x2="100%" y2="0%">
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
                fill="url(#nav-logo-grad)"
                className="font-black text-[38px] select-none"
                style={{ 
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  animation: 'pulse 2s ease-in-out infinite',
                  fill: 'url(#nav-logo-grad)'
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
                  stroke="url(#nav-logo-grad)"
                  strokeWidth="7"
                  strokeLinecap="round"
                />
                {/* Top-Right Arrowhead */}
                <path
                  d="M 72 24 L 80 30 L 75 38"
                  fill="none"
                  stroke="url(#nav-logo-grad)"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Bottom-Left Arc */}
                <path
                  d="M 78 60 A 32 32 0 0 1 22 70"
                  fill="none"
                  stroke="url(#nav-logo-grad)"
                  strokeWidth="7"
                  strokeLinecap="round"
                />
                {/* Bottom-Left Arrowhead */}
                <path
                  d="M 28 76 L 20 70 L 25 62"
                  fill="none"
                  stroke="url(#nav-logo-grad)"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            </svg>
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
              FinVerse
            </span>
            <span className="font-medium text-[10px] block text-slate-500 dark:text-slate-400 -mt-1 uppercase tracking-wider font-bold">
              Currency Converter
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Clickable Voice Button Assistant */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStartVoice}
            className="hidden md:flex items-center bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 rounded-xl px-4 py-1.5 text-xs font-bold text-slate-655 dark:text-slate-300 gap-2 cursor-pointer hover:border-emerald-500/50 hover:dark:border-emerald-400/50 hover:bg-emerald-500/5 dark:hover:bg-emerald-500/10 transition-all duration-300 shadow-sm glowing-emerald"
          >
            <Mic className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            <span>Click 🎙️ to use Voice</span>
          </motion.button>

          {/* Admin Panel Button - visible only to admin */}
          {isAdmin && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 text-xs font-bold text-purple-400 hover:from-purple-600/30 hover:to-blue-600/30 transition-all duration-300 shadow-sm"
              title="Open Admin Panel"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Admin</span>
            </motion.button>
          )}

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 text-slate-700 dark:text-slate-350 hover:bg-slate-200/50 dark:hover:bg-slate-700/80 transition-all duration-300 cursor-pointer"
            aria-label="Toggle Theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
          </button>

          {/* User Profile Avatar Trigger */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenProfile}
            className="flex items-center gap-2 bg-slate-100/50 dark:bg-slate-850/50 border border-slate-200/50 dark:border-slate-700/50 rounded-xl p-1 pr-3 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer hover:border-cyan-500/50 transition-all duration-300"
            title="User Profile Settings"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-emerald-500 flex items-center justify-center text-white font-black shadow-sm">
              {initials}
            </div>
            <span className="hidden sm:inline">{profileName}</span>
          </motion.button>
        </div>
      </div>
    </header>
  );
}
