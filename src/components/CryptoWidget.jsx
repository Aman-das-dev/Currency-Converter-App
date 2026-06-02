import React, { useState, useEffect } from 'react';
import { Coins, TrendingUp, TrendingDown, RefreshCcw } from 'lucide-react';
import { CRYPTO_LIST, CURRENCY_NAMES, CURRENCY_FLAGS } from '../services/rateApi';
import { motion } from 'framer-motion';

export default function CryptoWidget({ rates, onQuickSelect }) {
  const [fiatCurrency, setFiatCurrency] = useState('USD');
  const [cryptoAmount, setCryptoAmount] = useState(1);
  const [selectedCrypto, setSelectedCrypto] = useState('BTC');

  // Hardcoded real-time price trend indicators for visual delight
  const cryptoTrends = {
    BTC: { change: 2.45, direction: 'up' },
    ETH: { change: 1.82, direction: 'up' },
    DOGE: { change: -3.64, direction: 'down' },
    SOL: { change: 5.12, direction: 'up' },
    BNB: { change: -0.85, direction: 'down' },
    XRP: { change: 0.15, direction: 'up' }
  };

  const getCryptoPriceInFiat = (cryptoCode) => {
    // rates[cryptoCode] is value of 1 base in crypto.
    // E.g. if base is USD, rates['BTC'] = 0.000015
    // So 1 crypto in base = 1 / rates[cryptoCode]
    const usdRateOfCrypto = 1 / (rates[cryptoCode] || 1);
    const fiatRateOfUsd = rates[fiatCurrency] || 1;
    return usdRateOfCrypto * fiatRateOfUsd;
  };

  const currentCryptoPrice = getCryptoPriceInFiat(selectedCrypto);
  const totalFiatResult = cryptoAmount * currentCryptoPrice;

  const getIconUrl = (code) => {
    return `https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/32/color/${code.toLowerCase()}.png`;
  };

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden transition-all duration-300">
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Coins className="w-5 h-5 text-indigo-500 animate-spin-slow" />
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Crypto Dashboard</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Track and convert top institutional digital assets</p>
          </div>
        </div>

        {/* Local Fiat Target Selector */}
        <select
          value={fiatCurrency}
          onChange={(e) => setFiatCurrency(e.target.value)}
          className="bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 outline-none"
        >
          {['USD', 'EUR', 'INR', 'GBP', 'JPY', 'AUD'].map(f => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </div>

      {/* Crypto Prices Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {CRYPTO_LIST.map(code => {
          const price = getCryptoPriceInFiat(code);
          const trend = cryptoTrends[code] || { change: 0, direction: 'up' };

          return (
            <motion.div
              whileHover={{ scale: 1.02 }}
              onClick={() => {
                setSelectedCrypto(code);
                onQuickSelect(code, fiatCurrency);
              }}
              key={code}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                selectedCrypto === code
                  ? 'bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 border-indigo-500/40 glowing-indigo'
                  : 'bg-white/30 dark:bg-slate-800/30 border-slate-200/30 dark:border-slate-800/30 hover:bg-slate-100/30'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="flex items-center gap-1.5">
                  <img src={getIconUrl(code)} alt={code} className="w-5.5 h-5.5 rounded-full" />
                  <span className="font-extrabold text-xs text-slate-800 dark:text-white">{code}</span>
                </span>
                <span className={`text-[9px] font-bold flex items-center px-1 py-0.5 rounded-md ${
                  trend.direction === 'up' 
                    ? 'bg-emerald-500/10 text-emerald-500' 
                    : 'bg-rose-500/10 text-rose-500'
                }`}>
                  {trend.direction === 'up' ? <TrendingUp className="w-2.5 h-2.5 mr-0.5" /> : <TrendingDown className="w-2.5 h-2.5 mr-0.5" />}
                  {trend.change}%
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-450 dark:text-slate-500 font-semibold block uppercase">Price</span>
                <span className="text-xs sm:text-sm font-extrabold text-slate-850 dark:text-slate-150">
                  {fiatCurrency} {price.toLocaleString([], { maximumFractionDigits: fiatCurrency === 'INR' ? 2 : 4 })}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Embedded Crypto Converter */}
      <div className="p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-950/20 border border-slate-200/30 dark:border-slate-800/30 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        {/* Converter Input */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-wider">
            Convert {selectedCrypto}
          </label>
          <div className="relative">
            <input
              type="number"
              min="0.000001"
              step="0.0001"
              value={cryptoAmount}
              onChange={(e) => setCryptoAmount(Math.max(0, parseFloat(e.target.value) || 0))}
              className="w-full glass-input pr-12 text-xs font-bold text-slate-850 dark:text-white"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-extrabold text-slate-455">
              {selectedCrypto}
            </span>
          </div>
        </div>

        {/* Output */}
        <div className="text-center md:text-right">
          <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
            Total Fiat Value
          </span>
          <h3 className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
            {fiatCurrency} {totalFiatResult.toLocaleString([], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>
          <span className="text-[9px] text-slate-400 dark:text-slate-500 block mt-0.5">
            1 {selectedCrypto} = {currentCryptoPrice.toLocaleString([], { maximumFractionDigits: 2 })} {fiatCurrency}
          </span>
        </div>
      </div>
    </div>
  );
}
