import React, { useState, useEffect } from 'react';
import { Flame, TrendingUp, TrendingDown, RefreshCcw } from 'lucide-react';
import { MOCK_RATES } from '../services/rateApi';

export default function MarketHeatmap({ rates }) {
  const [pairsData, setPairsData] = useState([]);
  const [lastUpdated, setLastUpdated] = useState('');

  // Daily mock percentage shifts to demonstrate heatmap trends (gainers vs losers)
  const initialHeatmapData = [
    { base: 'EUR', target: 'USD', change: 0.38, customRate: 1.0850 },
    { base: 'GBP', target: 'USD', change: 0.12, customRate: 1.2720 },
    { base: 'USD', target: 'INR', change: 0.05, customRate: 83.450 },
    { base: 'USD', target: 'JPY', change: -0.42, customRate: 156.80 },
    { base: 'AUD', target: 'USD', change: 0.74, customRate: 0.6650 },
    { base: 'USD', target: 'CAD', change: -0.18, customRate: 1.3620 },
    { base: 'BTC', target: 'USD', change: 2.45, customRate: 67120.00 },
    { base: 'ETH', target: 'USD', change: 1.82, customRate: 3512.00 }
  ];

  useEffect(() => {
    // Generate fresh rates based on live or fallback API state
    const compiled = initialHeatmapData.map(pair => {
      let finalRate = pair.customRate;
      
      // Attempt dynamic rate lookup
      if (rates[pair.base] && rates[pair.target]) {
        // value of 1 base in target = rates[target] / rates[base]
        finalRate = rates[pair.target] / rates[pair.base];
      } else if (pair.base === 'BTC' || pair.base === 'ETH') {
        const cryptoRateInUsd = 1 / (rates[pair.base] || MOCK_RATES[pair.base]);
        finalRate = cryptoRateInUsd * (rates[pair.target] || 1);
      }

      return {
        ...pair,
        rate: finalRate
      };
    });

    setPairsData(compiled);
    setLastUpdated(new Date().toLocaleTimeString());
  }, [rates]);

  // Sort them: Gainers first
  const gainers = [...pairsData].filter(p => p.change >= 0).sort((a, b) => b.change - a.change);
  const losers = [...pairsData].filter(p => p.change < 0).sort((a, b) => a.change - b.change);

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden transition-all duration-300">
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Flame className="w-5 h-5 text-amber-500 animate-pulse" />
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Forex Heatmap</h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Top market gainers and losers in major currency/crypto trading pairs
          </p>
        </div>

        {/* Update timestamp */}
        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-850 px-2.5 py-1.5 rounded-xl self-start sm:self-center shrink-0">
          Updated: {lastUpdated}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gainers Column */}
        <div>
          <h3 className="text-xs font-extrabold uppercase text-emerald-500 tracking-wider mb-3 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 glowing-emerald" /> Top Gainers
          </h3>
          <div className="space-y-3">
            {gainers.map((p, idx) => (
              <div 
                key={idx}
                className="p-3 rounded-2xl bg-white/20 dark:bg-slate-800/20 border border-slate-250/20 dark:border-slate-800/40 hover:border-emerald-500/35 transition-all glowing-emerald flex items-center justify-between"
              >
                <div>
                  <span className="font-extrabold text-xs text-slate-800 dark:text-white block">{p.base}/{p.target}</span>
                  <span className="text-[10px] text-slate-450 dark:text-slate-500 font-semibold block mt-0.5">
                    {p.rate.toLocaleString([], { minimumFractionDigits: p.base === 'BTC' || p.base === 'ETH' ? 2 : 4, maximumFractionDigits: p.base === 'BTC' || p.base === 'ETH' ? 2 : 4 })}
                  </span>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-bold text-emerald-500 bg-emerald-500/10">
                    +{p.change}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Losers Column */}
        <div>
          <h3 className="text-xs font-extrabold uppercase text-rose-505 tracking-wider mb-3 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 glowing-rose" /> Top Losers
          </h3>
          <div className="space-y-3">
            {losers.map((p, idx) => (
              <div 
                key={idx}
                className="p-3 rounded-2xl bg-white/20 dark:bg-slate-800/20 border border-slate-250/20 dark:border-slate-800/40 hover:border-rose-500/35 transition-all glowing-rose flex items-center justify-between"
              >
                <div>
                  <span className="font-extrabold text-xs text-slate-800 dark:text-white block">{p.base}/{p.target}</span>
                  <span className="text-[10px] text-slate-450 dark:text-slate-500 font-semibold block mt-0.5">
                    {p.rate.toLocaleString([], { minimumFractionDigits: p.base === 'BTC' || p.base === 'ETH' ? 2 : 4, maximumFractionDigits: p.base === 'BTC' || p.base === 'ETH' ? 2 : 4 })}
                  </span>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-bold text-rose-500 bg-rose-500/10">
                    {p.change}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
