import React, { useState, useEffect } from 'react';
import { Layers, Plus, X, BarChart3, HelpCircle } from 'lucide-react';
import { CURRENCY_NAMES, CURRENCY_FLAGS, CRYPTO_LIST, MOCK_RATES } from '../services/rateApi';
import { motion, AnimatePresence } from 'framer-motion';

export default function MultiCompare({ rates, baseCurrency, amount }) {
  const [targets, setTargets] = useState(['INR', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD']);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  const addTarget = (code) => {
    if (!targets.includes(code)) {
      setTargets([...targets, code]);
    }
    setShowAddMenu(false);
    setSearchFilter('');
  };

  const removeTarget = (code) => {
    setTargets(targets.filter(t => t !== code));
  };

  // Find flag URLs
  const getFlagUrl = (code) => {
    const flag = CURRENCY_FLAGS[code];
    if (!flag) return 'https://flagcdn.com/w40/un.png';
    if (CRYPTO_LIST.includes(code)) {
      return `https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/32/color/${code.toLowerCase()}.png`;
    }
    return `https://flagcdn.com/w40/${flag}.png`;
  };

  // Calculate comparison values
  const baseRate = rates[baseCurrency] || 1;

  // Filter out currencies that are already in comparison target or is the base
  const availableCurrencies = Object.keys(CURRENCY_NAMES).filter(
    code => code !== baseCurrency && 
            !targets.includes(code) && 
            (code.toLowerCase().includes(searchFilter.toLowerCase()) || 
             CURRENCY_NAMES[code].toLowerCase().includes(searchFilter.toLowerCase()))
  );

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden transition-all duration-300">
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Layers className="w-5 h-5 text-cyan-500" />
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Multi Comparison</h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Compare <span className="font-bold">{amount.toLocaleString()} {baseCurrency}</span> with major global/crypto currencies
          </p>
        </div>

        {/* Add Currency Button */}
        <div className="relative">
          <button
            onClick={() => setShowAddMenu(!showAddMenu)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold text-xs shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" /> Add Target
          </button>

          {/* Add Dropdown */}
          <AnimatePresence>
            {showAddMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute z-20 right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl max-h-60 overflow-y-auto"
              >
                <input
                  type="text"
                  placeholder="Filter..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full sticky top-0 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-3 py-2 text-xs text-slate-850 dark:text-slate-200 outline-none"
                  autoFocus
                />
                <div className="py-1">
                  {availableCurrencies.length === 0 ? (
                    <p className="text-center text-[10px] text-slate-400 py-3">No targets available</p>
                  ) : (
                    availableCurrencies.map(code => (
                      <button
                        key={code}
                        onClick={() => addTarget(code)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-800 text-left"
                      >
                        <img 
                          src={getFlagUrl(code)} 
                          alt={code} 
                          className={`w-4 h-3 object-cover ${CRYPTO_LIST.includes(code) ? 'rounded-full' : 'rounded-sm'}`} 
                        />
                        <span>{code} - {CURRENCY_NAMES[code]}</span>
                      </button>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Targets Grid */}
      <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
        {targets.map(code => {
          const targetRate = rates[code] || MOCK_RATES[code];
          const rawConv = (amount / baseRate) * targetRate;
          const converted = isNaN(rawConv) ? 0 : rawConv;
          
          // Calculate strength bar based on currency order of magnitude (relative to 1 USD value)
          const fractionOfUsd = 1 / (rates[code] || 1);
          // Scale it for progress indicators (cap it for cryptos vs fiat)
          const barWidthPercent = Math.min(100, Math.max(3, (fractionOfUsd * 100)));

          return (
            <motion.div
              layout
              key={code}
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              className="p-4 rounded-2xl bg-white/30 dark:bg-slate-800/30 border border-slate-200/40 dark:border-slate-800/40 hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 shrink-0">
                <img 
                  src={getFlagUrl(code)} 
                  alt={code} 
                  className={`w-8 h-6 object-cover ${CRYPTO_LIST.includes(code) ? 'rounded-full' : 'rounded-lg'} shadow-sm`} 
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-sm text-slate-850 dark:text-white">{code}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">{CURRENCY_NAMES[code]}</span>
                  </div>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded-full inline-block mt-0.5">
                    1 {baseCurrency} = {(targetRate / baseRate).toLocaleString([], { minimumFractionDigits: CRYPTO_LIST.includes(code) ? 6 : 4 })} {code}
                  </span>
                </div>
              </div>

              {/* Progress/Ratio Bar & Final converted amount */}
              <div className="flex flex-col items-end gap-1.5 w-full max-w-[200px]">
                <span className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base">
                  {converted.toLocaleString([], { minimumFractionDigits: CRYPTO_LIST.includes(code) ? 6 : 2 })}
                </span>
                
                {/* Visual indicator bar */}
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500" 
                    style={{ width: `${barWidthPercent}%` }}
                  />
                </div>
              </div>

              {/* Remove button */}
              <button
                onClick={() => removeTarget(code)}
                className="p-1 rounded-lg text-slate-450 hover:text-rose-500 hover:bg-rose-500/10 transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}

        {targets.length === 0 && (
          <div className="text-center py-10">
            <BarChart3 className="w-10 h-10 text-slate-350 dark:text-slate-650 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-450">No comparison targets added</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Click the "Add Target" button at the top right to start comparing.</p>
          </div>
        )}
      </div>
    </div>
  );
}
