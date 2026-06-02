import React, { useState, useEffect } from 'react';
import { Plane, Calendar, Wallet, MapPin, AlertTriangle, CheckCircle, Sparkles } from 'lucide-react';
import { CURRENCY_NAMES, MOCK_RATES } from '../services/rateApi';

// Travel destinations list with native currency and average daily comfortable cost in USD
export const TRAVEL_DESTINATIONS = [
  { name: 'Japan', code: 'JP', currency: 'JPY', avgCostUsd: 120 },
  { name: 'United Kingdom', code: 'GB', currency: 'GBP', avgCostUsd: 160 },
  { name: 'France (Eurozone)', code: 'FR', currency: 'EUR', avgCostUsd: 140 },
  { name: 'Australia', code: 'AU', currency: 'AUD', avgCostUsd: 130 },
  { name: 'India', code: 'IN', currency: 'INR', avgCostUsd: 40 },
  { name: 'Brazil', code: 'BR', currency: 'BRL', avgCostUsd: 65 },
  { name: 'United Arab Emirates', code: 'AE', currency: 'AED', avgCostUsd: 180 },
  { name: 'Singapore', code: 'SG', currency: 'SGD', avgCostUsd: 150 },
  { name: 'South Korea', code: 'KR', currency: 'KRW', avgCostUsd: 110 }
];

export default function TravelBudget({ rates, baseCurrency, onTriggerAiAdvisor }) {
  const [selectedDest, setSelectedDest] = useState(TRAVEL_DESTINATIONS[0]);
  const [travelBudget, setTravelBudget] = useState(1500);
  const [days, setDays] = useState(10);
  const [convertedBudget, setConvertedBudget] = useState(0);
  const [convertedDaily, setConvertedDaily] = useState(0);

  // Conversion calculations
  const destCurrency = selectedDest.currency;
  const baseRate = rates[baseCurrency] || 1;
  const destRate = rates[destCurrency] || MOCK_RATES[destCurrency];

  useEffect(() => {
    // Total budget in destination currency
    const total = (travelBudget / baseRate) * destRate;
    setConvertedBudget(isNaN(total) ? 0 : total);
    // Daily budget in destination currency
    setConvertedDaily(isNaN(total) ? 0 : total / days);
  }, [selectedDest, travelBudget, days, baseCurrency, rates]);

  // Travel safety and cost limits check (compared in USD equivalent)
  const totalBudgetInUsd = travelBudget / (rates[baseCurrency] || 1);
  const dailyAllowanceInUsd = totalBudgetInUsd / days;
  const recommendedDaily = selectedDest.avgCostUsd;

  let safetyRating = 'Safe';
  let safetyColor = 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
  let safetyIcon = <CheckCircle className="w-5 h-5 text-emerald-500" />;
  let safetyMessage = 'Your budget is comfortable. You can easily cover accommodation, dining, and premium attractions!';

  if (dailyAllowanceInUsd < recommendedDaily * 0.5) {
    safetyRating = 'Budget Extreme (High Risk)';
    safetyColor = 'text-rose-500 bg-rose-500/10 border-rose-500/20';
    safetyIcon = <AlertTriangle className="w-5 h-5 text-rose-500" />;
    safetyMessage = `Warning: Average daily cost in ${selectedDest.name} is ~$${recommendedDaily}/day. Your allowance ($${dailyAllowanceInUsd.toFixed(2)}) is extremely tight. Focus heavily on hostels and street food.`;
  } else if (dailyAllowanceInUsd < recommendedDaily) {
    safetyRating = 'Budget Friendly (Moderate Risk)';
    safetyColor = 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    safetyIcon = <AlertTriangle className="w-5 h-5 text-amber-500" />;
    safetyMessage = `Note: Your daily budget (~$${dailyAllowanceInUsd.toFixed(2)}) is slightly below comfortable limits (~$${recommendedDaily}). You should monitor dining costs and choose cheap transport.`;
  }

  const handleConsultAi = () => {
    onTriggerAiAdvisor({
      budget: travelBudget,
      days,
      destination: selectedDest.name,
      currency: selectedDest.currency
    });
  };

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden transition-all duration-300">
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Plane className="w-5 h-5 text-emerald-500 animate-bounce" />
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Travel Budget Calculator</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Plan and optimize foreign vacation spending limits</p>
        </div>
      </div>

      {/* Form Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {/* Destination country select */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-rose-400" /> Destination
          </label>
          <select
            value={selectedDest.name}
            onChange={(e) => setSelectedDest(TRAVEL_DESTINATIONS.find(d => d.name === e.target.value))}
            className="w-full glass-input py-2.5 text-xs font-bold text-slate-850 dark:text-white"
          >
            {TRAVEL_DESTINATIONS.map(d => (
              <option key={d.name} value={d.name}>
                {d.name} ({d.currency})
              </option>
            ))}
          </select>
        </div>

        {/* Budget in Base Currency */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1">
            <Wallet className="w-3.5 h-3.5 text-emerald-400" /> Total Budget ({baseCurrency})
          </label>
          <input
            type="number"
            min="10"
            value={travelBudget}
            onChange={(e) => setTravelBudget(Math.max(1, parseFloat(e.target.value) || 0))}
            className="w-full glass-input py-2.5 text-xs font-bold text-slate-850 dark:text-white"
          />
        </div>

        {/* Days of trip */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" /> Duration (Days)
          </label>
          <input
            type="number"
            min="1"
            max="180"
            value={days}
            onChange={(e) => setDays(Math.max(1, parseInt(e.target.value) || 0))}
            className="w-full glass-input py-2.5 text-xs font-bold text-slate-850 dark:text-white"
          />
        </div>
      </div>

      {/* Calculations Showcase Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Destination total conversions */}
        <div className="p-4 rounded-2xl bg-white/20 dark:bg-slate-900/40 border border-slate-200/30 dark:border-slate-800/30 flex flex-col justify-center text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Travel Budget</span>
          <span className="text-xl sm:text-2xl font-extrabold text-slate-850 dark:text-white">
            {convertedBudget.toLocaleString([], { maximumFractionDigits: 2 })} {destCurrency}
          </span>
          <span className="text-[10px] text-slate-450 dark:text-slate-500 font-semibold mt-0.5">
            Equivalent of {travelBudget.toLocaleString()} {baseCurrency}
          </span>
        </div>

        {/* Destination daily allowance */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/5 to-cyan-500/5 dark:from-emerald-500/10 dark:to-cyan-500/10 border border-emerald-500/15 dark:border-emerald-500/20 flex flex-col justify-center text-center">
          <span className="text-[10px] font-bold text-emerald-500 dark:text-emerald-400 uppercase tracking-wider mb-1">Daily Spending Limit</span>
          <span className="text-xl sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {convertedDaily.toLocaleString([], { maximumFractionDigits: 2 })} {destCurrency}
          </span>
          <span className="text-[10px] text-slate-450 dark:text-slate-500 font-semibold mt-0.5">
            ~ ${(dailyAllowanceInUsd).toFixed(2)} USD / day
          </span>
        </div>
      </div>

      {/* Health Risk Alert Banner */}
      <div className={`p-4 rounded-2xl border flex gap-3 items-start text-xs ${safetyColor} transition-all duration-300 mb-6`}>
        {safetyIcon}
        <div>
          <span className="font-extrabold block mb-0.5">Assessment: {safetyRating}</span>
          <p className="font-semibold leading-relaxed opacity-90">{safetyMessage}</p>
        </div>
      </div>

      {/* Button to consult AI Spending Advisor */}
      <button
        onClick={handleConsultAi}
        className="w-full py-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs shadow-lg hover:shadow-black/10 hover:bg-slate-855 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
      >
        <Sparkles className="w-4 h-4 text-emerald-500 dark:text-emerald-400 animate-pulse" />
        Ask AI Spending Advisor for Vacation Plan
      </button>
    </div>
  );
}
