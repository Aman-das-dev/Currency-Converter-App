import React, { useState } from 'react';
import { Landmark, Home, ShoppingCart, Train, Wifi, ArrowRightLeft } from 'lucide-react';
import { MOCK_RATES, CURRENCY_NAMES } from '../services/rateApi';
import { motion } from 'framer-motion';

// High-fidelity city data: cost values in USD monthly averages
const CITY_COSTS = {
  'New York (USA)': { rent: 3200, food: 600, transit: 130, bills: 250, currency: 'USD' },
  'London (UK)': { rent: 2400, food: 450, transit: 180, bills: 220, currency: 'GBP' },
  'Tokyo (Japan)': { rent: 1100, food: 350, transit: 100, bills: 150, currency: 'JPY' },
  'Paris (France)': { rent: 1500, food: 400, transit: 90, bills: 160, currency: 'EUR' },
  'Mumbai (India)': { rent: 550, food: 180, transit: 25, bills: 60, currency: 'INR' },
  'Sydney (Australia)': { rent: 1800, food: 420, transit: 120, bills: 180, currency: 'AUD' },
  'Dubai (UAE)': { rent: 2100, food: 320, transit: 85, bills: 200, currency: 'AED' },
  'Singapore': { rent: 2800, food: 480, transit: 95, bills: 170, currency: 'SGD' },
  'Seoul (S. Korea)': { rent: 950, food: 380, transit: 75, bills: 110, currency: 'KRW' },
  'São Paulo (Brazil)': { rent: 700, food: 220, transit: 60, bills: 90, currency: 'BRL' }
};

export default function CostOfLiving({ rates, baseCurrency }) {
  const [cityA, setCityA] = useState('New York (USA)');
  const [cityB, setCityB] = useState('Mumbai (India)');

  const dataA = CITY_COSTS[cityA];
  const dataB = CITY_COSTS[cityB];

  // Convert USD costs into selected baseCurrency in the main dashboard
  const baseRate = rates[baseCurrency] || MOCK_RATES[baseCurrency] || 1;

  const convertCost = (costInUsd) => {
    // 1 USD = baseRate baseCurrency. So cost * baseRate
    return costInUsd * baseRate;
  };

  const totalA_Usd = dataA.rent + dataA.food + dataA.transit + dataA.bills;
  const totalB_Usd = dataB.rent + dataB.food + dataB.transit + dataB.bills;

  const totalA_Converted = convertCost(totalA_Usd);
  const totalB_Converted = convertCost(totalB_Usd);

  const differencePercent = ((Math.abs(totalA_Usd - totalB_Usd) / Math.max(totalA_Usd, totalB_Usd)) * 100).toFixed(0);
  const cheaperCity = totalA_Usd < totalB_Usd ? cityA : cityB;
  const pricierCity = totalA_Usd > totalB_Usd ? cityA : cityB;

  const costItems = [
    { label: 'Apartment Rent (1 BHK)', key: 'rent', icon: <Home className="w-4 h-4 text-emerald-500" /> },
    { label: 'Groceries & Dining', key: 'food', icon: <ShoppingCart className="w-4 h-4 text-amber-500" /> },
    { label: 'Public Transit Pass', key: 'transit', icon: <Train className="w-4 h-4 text-cyan-500" /> },
    { label: 'Utilities & Gigabit Internet', key: 'bills', icon: <Wifi className="w-4 h-4 text-indigo-500" /> }
  ];

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden transition-all duration-300">
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Landmark className="w-5 h-5 text-emerald-500" />
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Cost of Living Comparison</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Compare monthly indexes and itemized averages between global hubs</p>
        </div>
      </div>

      {/* Select selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-9 gap-4 items-center mb-6">
        <div className="sm:col-span-4">
          <label className="block text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase mb-1.5 tracking-wider">City A</label>
          <select
            value={cityA}
            onChange={(e) => setCityA(e.target.value)}
            className="w-full glass-input text-xs font-bold text-slate-850 dark:text-white py-2.5"
          >
            {Object.keys(CITY_COSTS).map(c => (
              <option key={c} value={c} disabled={c === cityB}>{c}</option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-1 flex justify-center pt-3 sm:pt-0">
          <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 text-slate-400">
            <ArrowRightLeft className="w-4 h-4" />
          </div>
        </div>

        <div className="sm:col-span-4">
          <label className="block text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase mb-1.5 tracking-wider">City B</label>
          <select
            value={cityB}
            onChange={(e) => setCityB(e.target.value)}
            className="w-full glass-input text-xs font-bold text-slate-850 dark:text-white py-2.5"
          >
            {Object.keys(CITY_COSTS).map(c => (
              <option key={c} value={c} disabled={c === cityA}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Overall Index Summary */}
      <motion.div 
        whileHover={{ scale: 1.02, y: -2 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="p-5 rounded-2xl border border-emerald-500/15 dark:border-emerald-500/25 bg-gradient-to-r from-emerald-500/5 to-cyan-500/5 dark:from-emerald-500/10 dark:to-cyan-500/10 mb-6 text-center shadow-sm cursor-pointer"
      >
        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">Index Analysis</span>
        <h3 className="text-base sm:text-lg font-extrabold text-slate-855 dark:text-white">
          🎉 <span className="text-emerald-500 dark:text-emerald-400">{cheaperCity}</span> is <span className="font-extrabold underline">{differencePercent}% cheaper</span> than {pricierCity}!
        </h3>
        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mt-1">
          Total Month Average: {cheaperCity === cityA ? totalA_Converted.toLocaleString([], { maximumFractionDigits: 0 }) : totalB_Converted.toLocaleString([], { maximumFractionDigits: 0 })} {baseCurrency} vs {cheaperCity === cityA ? totalB_Converted.toLocaleString([], { maximumFractionDigits: 0 }) : totalA_Converted.toLocaleString([], { maximumFractionDigits: 0 })} {baseCurrency}
        </p>
      </motion.div>

      {/* Itemized Grid List */}
      <div className="space-y-4">
        {costItems.map((item, index) => {
          const costA = convertCost(dataA[item.key]);
          const costB = convertCost(dataB[item.key]);
          const maxVal = Math.max(costA, costB);
          
          const pctA = (costA / maxVal) * 100;
          const pctB = (costB / maxVal) * 100;

          return (
            <motion.div 
              key={item.key}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.3 }}
              whileHover={{ x: 4 }}
              className="p-4 rounded-2xl bg-white/20 dark:bg-slate-800/30 border border-slate-200/20 dark:border-slate-800/40 space-y-3 shadow-sm"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-1.5 text-xs font-bold text-slate-850 dark:text-slate-200">
                  {item.icon} {item.label}
                </span>
                
                {/* Side-by-side cost labels */}
                <div className="flex gap-4 text-xs font-extrabold shrink-0">
                  <span className="text-emerald-600 dark:text-emerald-400">{costA.toLocaleString([], { maximumFractionDigits: 0 })} {baseCurrency}</span>
                  <span className="text-slate-400">|</span>
                  <span className="text-cyan-600 dark:text-cyan-400">{costB.toLocaleString([], { maximumFractionDigits: 0 })} {baseCurrency}</span>
                </div>
              </div>

              {/* Progress Gauges */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[9px] font-bold text-slate-400 dark:text-slate-500">
                  <span>{cityA}</span>
                  <span>{cityB}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  {/* City A Bar */}
                  <div className="h-2 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden flex justify-end">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${pctA}%` }}
                      transition={{ delay: 0.1 + index * 0.08, duration: 0.8, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-l from-emerald-500 to-teal-400 rounded-full" 
                    />
                  </div>
                  
                  {/* City B Bar */}
                  <div className="h-2 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${pctB}%` }}
                      transition={{ delay: 0.1 + index * 0.08, duration: 0.8, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-cyan-500 to-indigo-400 rounded-full" 
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
