import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function AdminStatCard({ icon, label, value, trend, trendUp, color = 'purple', delay = 0 }) {
  const colorMap = {
    purple: 'from-purple-550/5 to-purple-650/5 dark:from-purple-500/20 dark:to-purple-600/10 border-purple-500/10 dark:border-purple-500/20 text-purple-600 dark:text-purple-400',
    blue: 'from-blue-550/5 to-blue-650/5 dark:from-blue-500/20 dark:to-blue-600/10 border-blue-500/10 dark:border-blue-500/20 text-blue-600 dark:text-blue-400',
    emerald: 'from-emerald-550/5 to-emerald-650/5 dark:from-emerald-500/20 dark:to-emerald-600/10 border-emerald-500/10 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400',
    rose: 'from-rose-550/5 to-rose-650/5 dark:from-rose-500/20 dark:to-rose-600/10 border-rose-500/10 dark:border-rose-500/20 text-rose-600 dark:text-rose-400',
    amber: 'from-amber-550/5 to-amber-650/5 dark:from-amber-500/20 dark:to-amber-600/10 border-amber-500/10 dark:border-amber-500/20 text-amber-600 dark:text-amber-400',
    cyan: 'from-cyan-550/5 to-cyan-650/5 dark:from-cyan-500/20 dark:to-cyan-600/10 border-cyan-500/10 dark:border-cyan-500/20 text-cyan-600 dark:text-cyan-400',
  };
  const iconBg = {
    purple: 'bg-purple-500/10 text-purple-605 dark:text-purple-400',
    blue: 'bg-blue-500/10 text-blue-605 dark:text-blue-400',
    emerald: 'bg-emerald-500/10 text-emerald-605 dark:text-emerald-400',
    rose: 'bg-rose-500/10 text-rose-605 dark:text-rose-400',
    amber: 'bg-amber-500/10 text-amber-605 dark:text-amber-400',
    cyan: 'bg-cyan-500/10 text-cyan-605 dark:text-cyan-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br p-5 shadow-lg backdrop-blur-sm transition-all duration-300 ${colorMap[color]}`}
    >
      {/* Background glow */}
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-current opacity-5 blur-2xl" />
      
      <div className="flex items-start justify-between">
        <div className={`p-2.5 rounded-xl ${iconBg[color]}`}>
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${trendUp ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'}`}>
            {trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trend}
          </div>
        )}
      </div>

      <div className="mt-4">
        <div className="text-2xl font-black text-slate-800 dark:text-white leading-tight">{value}</div>
        <div className="text-xs font-semibold text-slate-450 dark:text-slate-400 mt-0.5">{label}</div>
      </div>
    </motion.div>
  );
}
