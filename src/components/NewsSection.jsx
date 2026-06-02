import React, { useState, useEffect } from 'react';
import { History, Heart, Newspaper, Trash2, Download, ArrowRight, ExternalLink } from 'lucide-react';
import { fetchFinanceNews, CURRENCY_NAMES } from '../services/rateApi';
import { motion, AnimatePresence } from 'framer-motion'; // Wait, let's make sure it's 'framer-motion'

export default function NewsSection({ 
  history, 
  clearHistory, 
  favorites, 
  loadFavoritePair, 
  removeFavorite 
}) {
  const [activeTab, setActiveTab] = useState('history');
  const [news, setNews] = useState([]);

  useEffect(() => {
    setNews(fetchFinanceNews());
  }, []);

  // Export history list to CSV file download
  const handleExportCSV = () => {
    if (history.length === 0) return;

    // CSV Headers
    const headers = ['Timestamp', 'Amount', 'From Currency', 'Target Currency', 'Converted Result', 'Exchange Rate'];
    
    // CSV Rows
    const rows = history.map(log => [
      new Date(log.timestamp).toLocaleString(),
      log.amount,
      log.from,
      log.to,
      log.result,
      log.rate
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `currency_conversion_history_${Date.now()}.csv`);
    document.body.appendChild(link); // Required for FF
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden transition-all duration-300">
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Tabs Selector Header */}
      <div className="flex border-b border-slate-200/50 dark:border-slate-800/50 pb-3 mb-6 overflow-x-auto scrollbar-none gap-2">
        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'history'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          <History className="w-4 h-4" /> Conversion History
        </button>

        <button
          onClick={() => setActiveTab('favorites')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'favorites'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          <Heart className="w-4 h-4" /> Favorites Pairs
        </button>

        <button
          onClick={() => setActiveTab('news')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'news'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          <Newspaper className="w-4 h-4" /> Market News
        </button>
      </div>

      {/* Dynamic Tab Body */}
      <div>
        {/* HISTORY TAB */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                Tracking last {history.length} operations
              </span>
              
              {history.length > 0 && (
                <div className="flex gap-2">
                  <button
                    onClick={handleExportCSV}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Export to CSV"
                  >
                    <Download className="w-3.5 h-3.5" /> CSV
                  </button>
                  <button
                    onClick={clearHistory}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-500 text-[10px] font-bold hover:bg-rose-500/20 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Clear
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {history.map((log, idx) => (
                <div 
                  key={idx}
                  className="p-3 rounded-2xl bg-white/25 dark:bg-slate-800/25 border border-slate-200/20 dark:border-slate-800/40 hover:bg-white/40 dark:hover:bg-slate-800/40 transition-colors flex items-center justify-between gap-4"
                >
                  <div>
                    <span className="font-extrabold text-xs text-slate-800 dark:text-white block">
                      {log.amount.toLocaleString([], { minimumFractionDigits: 2 })} {log.from} → {log.result.toLocaleString([], { minimumFractionDigits: log.from.includes('BTC') || log.to.includes('BTC') ? 6 : 2 })} {log.to}
                    </span>
                    <span className="text-[9px] text-slate-450 dark:text-slate-500 font-semibold block mt-0.5">
                      Rate: {log.rate.toLocaleString([], { minimumFractionDigits: 4 })} • {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <button
                    onClick={() => loadFavoritePair(log.from, log.to)}
                    className="p-1.5 rounded-lg text-slate-450 hover:text-emerald-500 hover:bg-emerald-500/10 transition-colors shrink-0"
                    title="Load conversion pair"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {history.length === 0 && (
                <div className="text-center py-10">
                  <History className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-450">No conversion history yet</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-550 mt-1">Conversions are logged persistently in local storage.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* FAVORITES TAB */}
        {activeTab === 'favorites' && (
          <div className="space-y-4">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-2">
              Saved Favorite currency pairs
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-60 overflow-y-auto pr-1">
              {favorites.map((fav, idx) => (
                <div 
                  key={idx}
                  className="p-3 rounded-2xl bg-white/25 dark:bg-slate-800/25 border border-slate-200/20 dark:border-slate-800/40 hover:border-emerald-500/20 transition-all flex items-center justify-between gap-2"
                >
                  <button
                    onClick={() => loadFavoritePair(fav.from, fav.to)}
                    className="text-left font-extrabold text-xs text-slate-850 dark:text-slate-200 hover:text-emerald-500 transition-colors"
                  >
                    {fav.from} ↔ {fav.to}
                  </button>
                  <button
                    onClick={() => removeFavorite(fav.from, fav.to)}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors shrink-0"
                    title="Remove Favorite"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {favorites.length === 0 && (
                <div className="text-center py-10 col-span-3">
                  <Heart className="w-10 h-10 text-slate-300 dark:text-slate-750 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-450">No favorite pairs saved</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-550 mt-1">Toggle the heart icon in the converter to save custom pairs.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* NEWS TAB */}
        {activeTab === 'news' && (
          <div className="space-y-4 max-h-[280px] overflow-y-auto pr-1">
            {news.map(item => (
              <div 
                key={item.id}
                className="p-4 rounded-2xl bg-white/20 dark:bg-slate-800/20 border border-slate-200/20 dark:border-slate-800/40 hover:bg-white/40 dark:hover:bg-slate-800/40 transition-colors flex flex-col gap-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[9px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-2 py-0.5 rounded-full">
                    {item.category}
                  </span>
                  <span className="text-[9px] text-slate-400 dark:text-slate-550 font-bold">
                    {item.time}
                  </span>
                </div>
                <h4 className="text-xs font-extrabold text-slate-850 dark:text-white hover:text-cyan-500 transition-colors leading-snug">
                  {item.title}
                </h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  {item.summary}
                </p>
                <div className="flex items-center justify-between text-[9px] text-slate-400 dark:text-slate-500 font-bold border-t border-slate-200/10 pt-2 mt-1">
                  <span>Source: {item.source}</span>
                  <a href={item.url} className="hover:text-emerald-500 transition-colors flex items-center gap-0.5">
                    Read article <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
