import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Eye, EyeOff, Globe } from 'lucide-react';

const MOCK_NEWS = [
  { id: 1, title: 'Federal Reserve Holds Interest Rates Steady', category: 'Macro', status: 'Published', author: 'FinVerse Team', date: '2026-05-31', views: 2340 },
  { id: 2, title: 'Bitcoin Surges Past $70,000 — Analyst Predictions', category: 'Crypto', status: 'Published', author: 'Admin', date: '2026-05-30', views: 5810 },
  { id: 3, title: 'EUR/USD Hits 3-Month High Amid ECB Policy Shift', category: 'Forex', status: 'Draft', author: 'FinVerse Team', date: '2026-05-29', views: 0 },
  { id: 4, title: 'India Rupee Strengthens as FII Inflows Rise', category: 'Asia', status: 'Published', author: 'Admin', date: '2026-05-28', views: 1820 },
  { id: 5, title: 'Oil Prices Impact Currency Markets Globally', category: 'Macro', status: 'Published', author: 'FinVerse Team', date: '2026-05-27', views: 990 },
  { id: 6, title: 'Ethereum 2.0 Upgrade: What It Means for ETH Price', category: 'Crypto', status: 'Draft', author: 'Admin', date: '2026-05-26', views: 0 },
  { id: 7, title: 'G7 Summit: Currency Agreements and Market Impact', category: 'Macro', status: 'Published', author: 'FinVerse Team', date: '2026-05-25', views: 3200 },
  { id: 8, title: 'Top 5 Currency Pairs to Watch This Month', category: 'Forex', status: 'Published', author: 'Admin', date: '2026-05-24', views: 4100 },
];

const CATEGORY_COLOR = {
  Macro: 'text-blue-600 dark:text-blue-400 bg-blue-500/5 dark:bg-blue-500/10 border-blue-500/20',
  Crypto: 'text-amber-600 dark:text-amber-400 bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/20',
  Forex: 'text-purple-650 dark:text-purple-400 bg-purple-500/5 dark:bg-purple-500/10 border-purple-500/20',
  Asia: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20',
};

export default function AdminNews() {
  const [articles, setArticles] = useState(MOCK_NEWS);
  const [filter, setFilter] = useState('All');

  const toggleStatus = (id) => {
    setArticles(prev => prev.map(a => a.id === id ? { ...a, status: a.status === 'Published' ? 'Draft' : 'Published' } : a));
  };

  const deleteArticle = (id) => setArticles(prev => prev.filter(a => a.id !== id));

  const filtered = filter === 'All' ? articles : articles.filter(a => a.status === filter);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-805 dark:text-white transition-colors duration-300">News & Market Updates</h1>
          <p className="text-xs text-slate-500 mt-0.5">{articles.filter(a => a.status === 'Published').length} published · {articles.filter(a => a.status === 'Draft').length} drafts</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-xl text-xs font-bold text-purple-650 dark:text-purple-400 hover:bg-purple-500/20 transition-all">
          <Plus className="w-3.5 h-3.5" /> New Article
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {['All', 'Published', 'Draft'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all border ${filter === f ? 'bg-purple-100 border-purple-200 text-purple-750 dark:bg-purple-500/20 dark:border-purple-500/30 dark:text-purple-300' : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}>
            {f} {f === 'All' ? `(${articles.length})` : f === 'Published' ? `(${articles.filter(a => a.status === 'Published').length})` : `(${articles.filter(a => a.status === 'Draft').length})`}
          </button>
        ))}
      </div>

      {/* Articles Table */}
      <div className="bg-white dark:bg-[#0d0f1e] border border-slate-100 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm transition-colors duration-300">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-transparent">
              {['Title', 'Category', 'Author', 'Status', 'Views', 'Date', 'Actions'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/[0.03]">
            {filtered.map((a, i) => (
              <motion.tr key={a.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors duration-300">
                <td className="px-4 py-3 max-w-xs">
                  <div className="text-[11px] font-bold text-slate-800 dark:text-white truncate">{a.title}</div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${CATEGORY_COLOR[a.category] || 'text-slate-600 dark:text-slate-400 bg-slate-500/5 dark:bg-slate-500/10 border-slate-500/20'}`}>
                    {a.category}
                  </span>
                </td>
                <td className="px-4 py-3 text-[11px] text-slate-655 dark:text-slate-400">{a.author}</td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${a.status === 'Published' ? 'text-emerald-600 bg-emerald-500/5 border-emerald-500/20 dark:text-emerald-400 dark:bg-emerald-500/10 dark:border-emerald-500/20' : 'text-slate-600 bg-slate-500/5 border-slate-500/20 dark:text-slate-400 dark:bg-slate-500/10 dark:border-slate-500/20'}`}>
                    {a.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-400">
                    <Globe className="w-3 h-3 text-slate-400" /> {a.views.toLocaleString()}
                  </div>
                </td>
                <td className="px-4 py-3 text-[11px] text-slate-455 dark:text-slate-500">{a.date}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button onClick={() => toggleStatus(a.id)} className={`p-1.5 rounded-lg transition-all ${a.status === 'Published' ? 'hover:bg-amber-500/10 text-emerald-600 hover:text-amber-605 dark:text-emerald-400 dark:hover:text-amber-400' : 'hover:bg-emerald-500/10 text-slate-450 hover:text-emerald-605 dark:text-slate-500 dark:hover:text-emerald-400'}`} title={a.status === 'Published' ? 'Unpublish' : 'Publish'}>
                      {a.status === 'Published' ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-purple-500/10 text-slate-450 hover:text-purple-600 dark:text-slate-500 dark:hover:text-purple-400 transition-all">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => deleteArticle(a.id)} className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-455 hover:text-rose-600 dark:text-slate-500 dark:hover:text-rose-400 transition-all">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
