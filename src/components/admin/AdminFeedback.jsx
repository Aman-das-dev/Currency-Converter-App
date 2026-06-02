import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Star, Trash2, CheckCircle, X, Mail } from 'lucide-react';

const MOCK_FEEDBACK = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  name: ['Aman Das', 'Emma Wilson', 'Priya Mehta', 'Rahul Sharma', 'Carlos Rivera',
    'Yuki Tanaka', 'Sofia Martinez', 'Liam Chen', 'Fatima Hassan', 'Arjun Patel'][i % 10],
  email: `user${i + 1}@example.com`,
  subject: ['App feedback', 'Rate Alert issue', 'Feature Request', 'Bug Report', 'General Inquiry',
    'Great Product!', 'Currency Missing', 'Login Problem', 'AI Advisor Feedback', 'UI Suggestion'][i % 10],
  message: 'Thank you for building such an amazing platform. I have been using FinVerse for a month and the currency converter is incredibly accurate and fast. One small request — can you add more South Asian currencies?',
  rating: Math.floor(Math.random() * 2) + 4,
  status: ['New', 'Read', 'Resolved'][i % 3],
  date: `2026-0${(i % 5) + 1}-${String((i % 28) + 1).padStart(2, '0')}`,
}));

const STATUS_COLOR = {
  New: 'text-blue-600 dark:text-blue-400 bg-blue-500/5 dark:bg-blue-500/10 border-blue-500/20',
  Read: 'text-slate-600 dark:text-slate-400 bg-slate-500/5 dark:bg-slate-500/10 border-slate-500/20',
  Resolved: 'text-emerald-605 dark:text-emerald-400 bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20',
};

const getStoredFeedbacks = () => {
  const stored = localStorage.getItem('finverse_feedbacks');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return MOCK_FEEDBACK;
    }
  }
  localStorage.setItem('finverse_feedbacks', JSON.stringify(MOCK_FEEDBACK));
  return MOCK_FEEDBACK;
};

export default function AdminFeedback() {
  const [feedbacks, setFeedbacks] = useState(getStoredFeedbacks);
  const [filter, setFilter] = useState('All');
  const [selectedMsg, setSelectedMsg] = useState(null);

  const filtered = filter === 'All' ? feedbacks : feedbacks.filter(f => f.status === filter);

  const markResolved = (id) => {
    const updated = feedbacks.map(f => f.id === id ? { ...f, status: 'Resolved' } : f);
    setFeedbacks(updated);
    localStorage.setItem('finverse_feedbacks', JSON.stringify(updated));
    setSelectedMsg(null);
  };
  const deleteFeedback = (id) => {
    const updated = feedbacks.filter(f => f.id !== id);
    setFeedbacks(updated);
    localStorage.setItem('finverse_feedbacks', JSON.stringify(updated));
    setSelectedMsg(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-805 dark:text-white transition-colors duration-300">Feedback & Messages</h1>
          <p className="text-xs text-slate-500 mt-0.5">{feedbacks.filter(f => f.status === 'New').length} new messages unread</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: 'New', count: feedbacks.filter(f => f.status === 'New').length, color: 'text-blue-600 dark:text-blue-400 border-blue-500/10 dark:border-blue-500/20 bg-blue-500/5 dark:bg-blue-500/10' },
          { label: 'Read', count: feedbacks.filter(f => f.status === 'Read').length, color: 'text-slate-600 dark:text-slate-400 border-slate-500/10 dark:border-slate-500/20 bg-slate-500/5 dark:bg-slate-500/10' },
          { label: 'Resolved', count: feedbacks.filter(f => f.status === 'Resolved').length, color: 'text-emerald-605 dark:text-emerald-400 border-emerald-500/10 dark:border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/10' },
        ].map(s => (
          <div key={s.label} className={`p-4 rounded-2xl border text-center transition-colors duration-300 ${s.color}`}>
            <div className="text-2xl font-black">{s.count}</div>
            <div className="text-[10px] font-semibold mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {['All', 'New', 'Read', 'Resolved'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all border ${filter === f ? 'bg-purple-100 border-purple-200 text-purple-750 dark:bg-purple-500/20 dark:border-purple-500/30 dark:text-purple-300' : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#0d0f1e] border border-slate-100 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm transition-colors duration-300">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-transparent">
              {['Sender', 'Subject', 'Rating', 'Status', 'Date', 'Actions'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/[0.03]">
            {filtered.map((fb, i) => (
              <motion.tr key={fb.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors duration-300">
                <td className="px-4 py-3">
                  <div className="text-[11px] font-bold text-slate-800 dark:text-white">{fb.name}</div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500">{fb.email}</div>
                </td>
                <td className="px-4 py-3 text-[11px] text-slate-700 dark:text-slate-300 max-w-xs truncate">{fb.subject}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className={`w-3 h-3 ${j < fb.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200 dark:text-slate-700'}`} />
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_COLOR[fb.status]}`}>
                    {fb.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-[11px] text-slate-400 dark:text-slate-500">{fb.date}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button onClick={() => setSelectedMsg(fb)} className="p-1.5 rounded-lg hover:bg-blue-500/10 text-slate-450 hover:text-blue-600 dark:text-slate-500 dark:hover:text-blue-400 transition-all" title="View">
                      <MessageSquare className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => markResolved(fb.id)} className="p-1.5 rounded-lg hover:bg-emerald-500/10 text-slate-455 hover:text-emerald-600 dark:text-slate-500 dark:hover:text-emerald-400 transition-all" title="Resolve">
                      <CheckCircle className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => deleteFeedback(fb.id)} className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-455 hover:text-rose-600 dark:text-slate-500 dark:hover:text-rose-400 transition-all" title="Delete">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Message Detail Modal */}
      <AnimatePresence>
        {selectedMsg && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedMsg(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative bg-white dark:bg-[#13162a] border border-slate-250 dark:border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl transition-colors duration-300">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-black text-slate-800 dark:text-white">{selectedMsg.name}</h3>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">{selectedMsg.email} · {selectedMsg.date}</p>
                </div>
                <button onClick={() => setSelectedMsg(null)} className="text-slate-405 hover:text-slate-700 dark:text-slate-500 dark:hover:text-white"><X className="w-4 h-4" /></button>
              </div>
              <div className="mb-3">
                <p className="text-[11px] font-bold text-purple-650 dark:text-purple-400">{selectedMsg.subject}</p>
              </div>
              <div className="bg-slate-50 dark:bg-white/5 border border-slate-200/50 dark:border-none rounded-xl p-3 text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                {selectedMsg.message}
              </div>
              <div className="flex gap-2 mt-4">
                <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-500/10 border border-blue-500/20 rounded-xl text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 transition-all">
                  <Mail className="w-3.5 h-3.5" /> Reply
                </button>
                <button onClick={() => markResolved(selectedMsg.id)} className="flex-1 flex items-center justify-center gap-2 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-all">
                  <CheckCircle className="w-3.5 h-3.5" /> Mark Resolved
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
