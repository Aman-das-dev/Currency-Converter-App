import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, ToggleLeft, ToggleRight } from 'lucide-react';

const CRYPTOS = [
  { symbol: 'BTC', name: 'Bitcoin', price: 67842.50, change: 2.34, marketCap: '1.33T', volume: '28.4B', color: '#f59e0b', enabled: true, sparkline: [62000,63500,64000,65200,66100,65800,67000,67842] },
  { symbol: 'ETH', name: 'Ethereum', price: 3521.80, change: -1.12, marketCap: '423.1B', volume: '14.2B', color: '#6366f1', enabled: true, sparkline: [3200,3310,3280,3400,3350,3450,3500,3521] },
  { symbol: 'SOL', name: 'Solana', price: 178.42, change: 5.67, marketCap: '82.4B', volume: '3.8B', color: '#a855f7', enabled: true, sparkline: [150,158,162,170,165,172,175,178] },
  { symbol: 'BNB', name: 'Binance Coin', price: 412.30, change: 0.89, marketCap: '63.2B', volume: '1.9B', color: '#f59e0b', enabled: true, sparkline: [390,395,400,405,408,410,411,412] },
  { symbol: 'XRP', name: 'Ripple', price: 0.5842, change: -2.41, marketCap: '33.1B', volume: '2.1B', color: '#06b6d4', enabled: false, sparkline: [0.60,0.59,0.58,0.595,0.590,0.585,0.584,0.584] },
  { symbol: 'DOGE', name: 'Dogecoin', price: 0.1421, change: 3.21, marketCap: '20.7B', volume: '1.4B', color: '#eab308', enabled: true, sparkline: [0.13,0.132,0.135,0.140,0.138,0.141,0.142,0.142] },
];

// Simple inline SVG sparkline — no library needed
function MiniSparkline({ data, color, positive }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 120, h = 40;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  });
  const polyline = points.join(' ');
  // Close path for fill
  const fillPath = `M ${points[0]} L ${points.join(' L ')} L ${w},${h} L 0,${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: 40 }} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`fill-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fillPath} fill={`url(#fill-${color.replace('#','')})`} />
      <polyline points={polyline} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function AdminCrypto() {
  const [cryptos, setCryptos] = useState(CRYPTOS);

  const toggle = (symbol) => {
    setCryptos(prev => prev.map(c => c.symbol === symbol ? { ...c, enabled: !c.enabled } : c));
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-black text-slate-800 dark:text-white transition-colors duration-300">Crypto Management</h1>
        <p className="text-xs text-slate-500 mt-0.5">{cryptos.filter(c => c.enabled).length} active coins · Live simulated prices</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cryptos.map((coin, i) => (
          <motion.div
            key={coin.symbol}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`bg-white dark:bg-[#0d0f1e] border border-slate-100 dark:border-white/5 rounded-2xl p-5 shadow-sm transition-all duration-300 ${coin.enabled ? 'opacity-100' : 'opacity-60'}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shadow-md"
                  style={{ background: `${coin.color}22`, color: coin.color, border: `1px solid ${coin.color}33` }}
                >
                  {coin.symbol.slice(0, 2)}
                </div>
                <div>
                  <div className="text-sm font-black text-slate-800 dark:text-white">{coin.symbol}</div>
                  <div className="text-[10px] text-slate-550 dark:text-slate-500">{coin.name}</div>
                </div>
              </div>
              <button onClick={() => toggle(coin.symbol)} title={coin.enabled ? 'Disable' : 'Enable'}>
                {coin.enabled
                  ? <ToggleRight className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />
                  : <ToggleLeft className="w-6 h-6 text-slate-400 dark:text-slate-600" />}
              </button>
            </div>

            <div className="mb-2">
              <div className="text-xl font-black text-slate-800 dark:text-white">${coin.price.toLocaleString()}</div>
              <div className={`flex items-center gap-1 text-[11px] font-bold mt-0.5 ${coin.change >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {coin.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {coin.change >= 0 ? '+' : ''}{coin.change}% (24h)
              </div>
            </div>

            <MiniSparkline data={coin.sparkline} color={coin.color} positive={coin.change >= 0} />

            <div className="flex justify-between mt-2 pt-2 border-t border-slate-100 dark:border-white/5">
              <div>
                <div className="text-[9px] text-slate-455 dark:text-slate-600 uppercase font-bold">Market Cap</div>
                <div className="text-[11px] font-black text-slate-700 dark:text-slate-300">${coin.marketCap}</div>
              </div>
              <div className="text-right">
                <div className="text-[9px] text-slate-455 dark:text-slate-600 uppercase font-bold">Volume (24h)</div>
                <div className="text-[11px] font-black text-slate-700 dark:text-slate-300">${coin.volume}</div>
              </div>
            </div>

            <div className="mt-3">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${coin.enabled ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' : 'bg-slate-100 dark:bg-slate-700/30 text-slate-500 border-slate-200 dark:border-slate-700/30'}`}>
                {coin.enabled ? '● Live Trading' : '○ Disabled'}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
