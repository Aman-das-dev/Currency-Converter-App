import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Users, ArrowLeftRight, TrendingUp } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, Filler, Tooltip, Legend
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, Filler, Tooltip, Legend
);

const revenueData = {
  labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
  datasets: [
    {
      label: 'Revenue ($)',
      data: [4200,5100,4800,6200,7800,9100,10400,11200,12800,14100,15900,18200],
      borderColor: '#10b981',
      backgroundColor: 'rgba(16,185,129,0.12)',
      fill: true,
      tension: 0.4,
      pointRadius: 0,
      borderWidth: 2,
    },
    {
      label: 'Expenses ($)',
      data: [1800,2100,1900,2400,2800,3100,3400,3600,4000,4400,4800,5200],
      borderColor: '#ef4444',
      backgroundColor: 'rgba(239,68,68,0.08)',
      fill: true,
      tension: 0.4,
      pointRadius: 0,
      borderWidth: 2,
    },
  ],
};

const volumeData = {
  labels: ['Week 1','Week 2','Week 3','Week 4','Week 5','Week 6'],
  datasets: [
    { label: 'Forex', data: [42000,51000,39000,67000,82000,55000], backgroundColor: '#3b82f6', borderRadius: 4 },
    { label: 'Crypto', data: [12000,18000,21000,15000,28000,19000], backgroundColor: '#a855f7', borderRadius: 4 },
  ],
};

const geoData = [
  { country: 'India', users: 5420, pct: 29 },
  { country: 'USA', users: 3210, pct: 17 },
  { country: 'UK', users: 2180, pct: 12 },
  { country: 'Germany', users: 1540, pct: 8 },
  { country: 'Brazil', users: 1230, pct: 7 },
  { country: 'Others', users: 5062, pct: 27 },
];

const lineOptions = {
  plugins: {
    legend: { display: true, labels: { color: '#64748b', font: { size: 10 }, boxWidth: 12, padding: 14 } },
  },
  scales: {
    x: { grid: { color: 'rgba(100, 116, 139, 0.08)' }, ticks: { color: '#64748b', font: { size: 10 } }, border: { display: false } },
    y: { grid: { color: 'rgba(100, 116, 139, 0.08)' }, ticks: { color: '#64748b', font: { size: 10 } }, border: { display: false } },
  },
  maintainAspectRatio: false,
};

const barOptions = {
  plugins: {
    legend: { display: true, labels: { color: '#64748b', font: { size: 10 }, boxWidth: 12, padding: 14 } },
  },
  scales: {
    x: { grid: { color: 'rgba(100, 116, 139, 0.08)' }, ticks: { color: '#64748b', font: { size: 10 } }, border: { display: false } },
    y: { grid: { color: 'rgba(100, 116, 139, 0.08)' }, ticks: { color: '#64748b', font: { size: 10 } }, border: { display: false } },
  },
  maintainAspectRatio: false,
};

export default function AdminAnalytics() {
  const totalRevenue = revenueData.datasets[0].data.reduce((s, v) => s + v, 0);
  const totalExpenses = revenueData.datasets[1].data.reduce((s, v) => s + v, 0);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-black text-slate-800 dark:text-white transition-colors duration-300">Analytics & Revenue</h1>
        <p className="text-xs text-slate-500 mt-0.5">Full-year financial and traffic overview · 2026</p>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: <DollarSign className="w-5 h-5" />, label: 'Annual Revenue', value: `$${(totalRevenue / 1000).toFixed(1)}K`, sub: '+42% YoY', color: 'text-emerald-600 dark:text-emerald-400', bg: 'border-emerald-500/10 dark:border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/10' },
          { icon: <TrendingUp className="w-5 h-5" />, label: 'Profit Margin', value: `${(((totalRevenue - totalExpenses) / totalRevenue) * 100).toFixed(1)}%`, sub: 'After expenses', color: 'text-blue-600 dark:text-blue-400', bg: 'border-blue-500/10 dark:border-blue-500/20 bg-blue-500/5 dark:bg-blue-500/10' },
          { icon: <Users className="w-5 h-5" />, label: 'DAU', value: '3,218', sub: 'Daily active users', color: 'text-purple-600 dark:text-purple-400', bg: 'border-purple-500/10 dark:border-purple-500/20 bg-purple-500/5 dark:bg-purple-500/10' },
          { icon: <ArrowLeftRight className="w-5 h-5" />, label: 'Conversions/Day', value: '37,400', sub: 'Average daily', color: 'text-amber-605 dark:text-amber-400', bg: 'border-amber-500/10 dark:border-amber-500/20 bg-amber-500/5 dark:bg-amber-500/10' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className={`p-4 rounded-2xl border transition-colors duration-300 ${s.bg}`}>
            <div className={`${s.color} mb-2`}>{s.icon}</div>
            <div className="text-2xl font-black text-slate-805 dark:text-white">{s.value}</div>
            <div className="text-[10px] text-slate-550 dark:text-slate-500 font-semibold mt-0.5">{s.label}</div>
            <div className={`text-[10px] font-bold mt-1 ${s.color}`}>{s.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Revenue vs Expenses Line Chart */}
      <div className="bg-white dark:bg-[#0d0f1e] border border-slate-100 dark:border-white/5 rounded-2xl p-5 shadow-sm transition-colors duration-300">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-black text-slate-808 dark:text-white">Revenue vs Expenses · 2026</h3>
          <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg">
            Net: ${((totalRevenue - totalExpenses) / 1000).toFixed(1)}K
          </div>
        </div>
        <div style={{ height: 220 }}>
          <Line data={revenueData} options={lineOptions} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Volume by Type */}
        <div className="bg-white dark:bg-[#0d0f1e] border border-slate-100 dark:border-white/5 rounded-2xl p-5 shadow-sm transition-colors duration-300">
          <h3 className="text-sm font-black text-slate-800 dark:text-white mb-4">Conversion Volume by Type</h3>
          <div style={{ height: 200 }}>
            <Bar data={volumeData} options={barOptions} />
          </div>
        </div>

        {/* Geographic Distribution */}
        <div className="bg-white dark:bg-[#0d0f1e] border border-slate-100 dark:border-white/5 rounded-2xl p-5 shadow-sm transition-colors duration-300">
          <h3 className="text-sm font-black text-slate-800 dark:text-white mb-4">Geographic Distribution</h3>
          <div className="space-y-3">
            {geoData.map((g, i) => (
              <div key={i}>
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="font-semibold text-slate-600 dark:text-slate-400">{g.country}</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{g.users.toLocaleString()} ({g.pct}%)</span>
                </div>
                <div className="h-1.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${g.pct}%` }}
                    transition={{ delay: i * 0.1, duration: 0.6 }}
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
