import React from 'react';
import { motion } from 'framer-motion';
import { Brain, MessageSquare, Clock, TrendingUp } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement,
  ArcElement, Tooltip, Legend
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const topicData = {
  labels: ['Currency Tips', 'Travel Budget', 'Crypto Advice', 'Spending Habits', 'Investment', 'Tax Planning'],
  datasets: [{
    data: [1240, 980, 870, 650, 540, 320],
    backgroundColor: ['#a855f7','#3b82f6','#10b981','#f59e0b','#ef4444','#6366f1'],
    borderWidth: 0,
    hoverOffset: 6,
  }],
};

const weeklyUsageData = {
  labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
  datasets: [{
    label: 'Sessions',
    data: [320, 490, 380, 610, 740, 520, 290],
    backgroundColor: '#a855f7',
    borderRadius: 4,
  }],
};

const recentSessions = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  user: ['Aman Das', 'Emma Wilson', 'Rahul Sharma', 'Priya Mehta'][i % 4],
  messages: Math.floor(Math.random() * 20) + 3,
  duration: `${Math.floor(Math.random() * 15) + 1}m ${Math.floor(Math.random() * 59)}s`,
  topic: ['Currency Tips', 'Travel Budget', 'Crypto Advice', 'Spending Habits', 'Investment', 'Tax Planning'][i % 6],
  time: `${Math.floor(Math.random() * 12) + 1}h ago`,
}));

const barOptions = {
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { color: 'rgba(100, 116, 139, 0.08)' }, ticks: { color: '#64748b', font: { size: 10 } }, border: { display: false } },
    y: { grid: { color: 'rgba(100, 116, 139, 0.08)' }, ticks: { color: '#64748b', font: { size: 10 } }, border: { display: false } },
  },
  maintainAspectRatio: false,
};

const donutOptions = {
  plugins: { legend: { display: false } },
  cutout: '65%',
  maintainAspectRatio: false,
};

export default function AdminAiAdvisor() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-black text-slate-800 dark:text-white transition-colors duration-300">AI Advisor Analytics</h1>
        <p className="text-xs text-slate-500 mt-0.5">Usage statistics and conversation insights</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: <Brain className="w-5 h-5" />, label: 'Total AI Sessions', value: '24,810', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-500/5 dark:bg-purple-500/10 border-purple-500/10 dark:border-purple-500/20' },
          { icon: <MessageSquare className="w-5 h-5" />, label: 'Messages Exchanged', value: '187,420', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-500/5 dark:bg-blue-500/10 border-blue-500/10 dark:border-blue-500/20' },
          { icon: <Clock className="w-5 h-5" />, label: 'Avg Session Length', value: '6m 42s', color: 'text-emerald-605 dark:text-emerald-400', bg: 'bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/10 dark:border-emerald-500/20' },
          { icon: <TrendingUp className="w-5 h-5" />, label: 'Satisfaction Score', value: '4.7 / 5', color: 'text-amber-605 dark:text-amber-400', bg: 'bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/10 dark:border-amber-500/20' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className={`p-4 rounded-2xl border transition-colors duration-300 ${s.bg}`}>
            <div className={`${s.color} mb-2`}>{s.icon}</div>
            <div className="text-xl font-black text-slate-805 dark:text-white">{s.value}</div>
            <div className="text-[10px] text-slate-550 dark:text-slate-500 font-semibold mt-0.5">{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Weekly Usage */}
        <div className="bg-white dark:bg-[#0d0f1e] border border-slate-100 dark:border-white/5 rounded-2xl p-5 shadow-sm transition-colors duration-300">
          <h3 className="text-sm font-black text-slate-800 dark:text-white mb-4">Weekly Session Volume</h3>
          <div style={{ height: 200 }}>
            <Bar data={weeklyUsageData} options={barOptions} />
          </div>
        </div>

        {/* Topic Distribution */}
        <div className="bg-white dark:bg-[#0d0f1e] border border-slate-100 dark:border-white/5 rounded-2xl p-5 shadow-sm transition-colors duration-300">
          <h3 className="text-sm font-black text-slate-800 dark:text-white mb-4">Most Asked Topics</h3>
          <div className="flex gap-4 items-center">
            <div style={{ width: 140, height: 160, flexShrink: 0 }}>
              <Doughnut data={topicData} options={donutOptions} />
            </div>
            <div className="flex-1 space-y-2">
              {topicData.labels.map((t, i) => (
                <div key={i} className="flex items-center gap-2 text-[10px]">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: topicData.datasets[0].backgroundColor[i] }} />
                  <span className="text-slate-600 dark:text-slate-400 truncate">{t}</span>
                  <span className="text-slate-400 dark:text-slate-600 ml-auto font-bold">{topicData.datasets[0].data[i]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Sessions */}
      <div className="bg-white dark:bg-[#0d0f1e] border border-slate-100 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm transition-colors duration-300">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-transparent">
          <h3 className="text-sm font-black text-slate-805 dark:text-white">Recent AI Sessions</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 dark:border-white/5">
              {['User', 'Topic', 'Messages', 'Duration', 'Time'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/[0.03]">
            {recentSessions.map((s, i) => (
              <motion.tr key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors duration-300">
                <td className="px-4 py-3 text-[11px] font-bold text-slate-800 dark:text-white">{s.user}</td>
                <td className="px-4 py-3"><span className="text-[10px] font-bold text-purple-605 dark:text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">{s.topic}</span></td>
                <td className="px-4 py-3 text-[11px] text-slate-700 dark:text-slate-300">{s.messages}</td>
                <td className="px-4 py-3 text-[11px] text-slate-500 dark:text-slate-400">{s.duration}</td>
                <td className="px-4 py-3 text-[11px] text-slate-400 dark:text-slate-500">{s.time}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
