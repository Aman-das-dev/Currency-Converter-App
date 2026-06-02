import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit2, Trash2, ToggleLeft, ToggleRight, X } from 'lucide-react';

const ALL_CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸', enabled: true },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺', enabled: true },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧', enabled: true },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳', enabled: true },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵', enabled: true },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺', enabled: true },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦', enabled: true },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr', flag: '🇨🇭', enabled: true },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳', enabled: true },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬', enabled: true },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', flag: '🇭🇰', enabled: true },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', flag: '🇳🇿', enabled: true },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', flag: '🇰🇷', enabled: false },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷', enabled: true },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$', flag: '🇲🇽', enabled: true },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', flag: '🇸🇪', enabled: true },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', flag: '🇳🇴', enabled: false },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr', flag: '🇩🇰', enabled: true },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', flag: '🇿🇦', enabled: true },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', flag: '🇦🇪', enabled: true },
  { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼', flag: '🇸🇦', enabled: true },
  { code: 'THB', name: 'Thai Baht', symbol: '฿', flag: '🇹🇭', enabled: true },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', flag: '🇲🇾', enabled: true },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', flag: '🇮🇩', enabled: false },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱', flag: '🇵🇭', enabled: true },
];

export default function AdminCurrencies() {
  const [currencies, setCurrencies] = useState(ALL_CURRENCIES);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newCurrency, setNewCurrency] = useState({ code: '', name: '', symbol: '', flag: '' });

  const filtered = currencies.filter(c =>
    c.code.toLowerCase().includes(search.toLowerCase()) ||
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleEnabled = (code) => {
    setCurrencies(prev => prev.map(c => c.code === code ? { ...c, enabled: !c.enabled } : c));
  };

  const deleteCurrency = (code) => {
    setCurrencies(prev => prev.filter(c => c.code !== code));
  };

  const addCurrency = () => {
    if (!newCurrency.code || !newCurrency.name) return;
    setCurrencies(prev => [...prev, { ...newCurrency, enabled: true }]);
    setNewCurrency({ code: '', name: '', symbol: '', flag: '' });
    setShowModal(false);
  };

  const enabledCount = currencies.filter(c => c.enabled).length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-800 dark:text-white transition-colors duration-300">Currency Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">{enabledCount} active · {currencies.length - enabledCount} disabled</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-xl text-xs font-bold text-purple-650 dark:text-purple-400 hover:bg-purple-500/20 transition-all"
        >
          <Plus className="w-3.5 h-3.5" /> Add Currency
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white dark:bg-[#0d0f1e] border border-slate-100 dark:border-white/5 rounded-2xl p-4 text-center shadow-sm transition-colors duration-300">
          <div className="text-2xl font-black text-slate-800 dark:text-white">{currencies.length}</div>
          <div className="text-[10px] text-slate-550 dark:text-slate-500 font-semibold mt-1">Total Currencies</div>
        </div>
        <div className="bg-white dark:bg-[#0d0f1e] border border-slate-100 dark:border-white/5 rounded-2xl p-4 text-center shadow-sm transition-colors duration-300">
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{enabledCount}</div>
          <div className="text-[10px] text-slate-550 dark:text-slate-500 font-semibold mt-1">Active</div>
        </div>
        <div className="bg-white dark:bg-[#0d0f1e] border border-slate-100 dark:border-white/5 rounded-2xl p-4 text-center shadow-sm transition-colors duration-300">
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400">{currencies.length - enabledCount}</div>
          <div className="text-[10px] text-slate-550 dark:text-slate-500 font-semibold mt-1">Disabled</div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
        <input
          type="text"
          placeholder="Search currency code or name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-white dark:bg-white/5 border border-slate-200/50 dark:border-white/5 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 dark:text-slate-300 placeholder-slate-405 dark:placeholder-slate-600 outline-none focus:border-purple-500/50 transition-all"
        />
      </div>

      {/* Currency Table */}
      <div className="bg-white dark:bg-[#0d0f1e] border border-slate-100 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm transition-colors duration-300">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-transparent">
              {['Flag', 'Code', 'Name', 'Symbol', 'Status', 'Actions'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/[0.03]">
            {filtered.map((c, i) => (
              <motion.tr key={c.code} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-all">
                <td className="px-4 py-2.5 text-lg">{c.flag}</td>
                <td className="px-4 py-2.5 text-[11px] font-black text-slate-800 dark:text-white">{c.code}</td>
                <td className="px-4 py-2.5 text-[11px] text-slate-600 dark:text-slate-400">{c.name}</td>
                <td className="px-4 py-2.5 text-[11px] font-bold text-slate-700 dark:text-slate-300">{c.symbol}</td>
                <td className="px-4 py-2.5">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${c.enabled ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'}`}>
                    {c.enabled ? 'Active' : 'Disabled'}
                  </span>
                </td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-1">
                    <button onClick={() => toggleEnabled(c.code)} className={`p-1.5 rounded-lg transition-all ${c.enabled ? 'hover:bg-rose-500/10 text-emerald-600 hover:text-rose-605 dark:text-emerald-400 dark:hover:text-rose-400' : 'hover:bg-emerald-500/10 text-slate-450 hover:text-emerald-605 dark:text-slate-500 dark:hover:text-emerald-400'}`}>
                      {c.enabled ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-purple-500/10 text-slate-450 hover:text-purple-600 dark:text-slate-500 dark:hover:text-purple-400 transition-all">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => deleteCurrency(c.code)} className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-455 hover:text-rose-600 dark:text-slate-500 dark:hover:text-rose-400 transition-all">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Currency Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative bg-white dark:bg-[#13162a] border border-slate-200 dark:border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl transition-colors duration-300">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-black text-slate-800 dark:text-white">Add New Currency</h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-white"><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-3">
                {[
                  { key: 'code', label: 'Currency Code (e.g. USD)', placeholder: 'USD' },
                  { key: 'name', label: 'Full Name', placeholder: 'US Dollar' },
                  { key: 'symbol', label: 'Symbol', placeholder: '$' },
                  { key: 'flag', label: 'Flag Emoji', placeholder: '🇺🇸' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">{f.label}</label>
                    <input
                      value={newCurrency[f.key]}
                      onChange={e => setNewCurrency(prev => ({ ...prev, [f.key]: e.target.value }))}
                      placeholder={f.placeholder}
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-205/50 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-850 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 outline-none focus:border-purple-500/50 transition-all"
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-5">
                <button onClick={() => setShowModal(false)} className="flex-1 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-all">Cancel</button>
                <button onClick={addCurrency} className="flex-1 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-xs font-black text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all">Add Currency</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
