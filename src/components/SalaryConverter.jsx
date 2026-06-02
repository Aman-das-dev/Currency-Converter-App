import React, { useState } from 'react';
import { DollarSign, Landmark, Percent, Calendar, Hourglass, ShieldAlert } from 'lucide-react';
import { MOCK_RATES, CURRENCY_NAMES } from '../services/rateApi';

export default function SalaryConverter({ rates }) {
  const [inputSalary, setInputSalary] = useState(80000);
  const [salaryCurrency, setSalaryCurrency] = useState('USD');
  const [targetSalaryCurrency, setTargetSalaryCurrency] = useState('INR');
  const [taxRate, setTaxRate] = useState(25); // slider 0 to 50%

  // Resolve rates
  const baseRate = rates[salaryCurrency] || MOCK_RATES[salaryCurrency] || 1;
  const targetRate = rates[targetSalaryCurrency] || MOCK_RATES[targetSalaryCurrency] || 83;

  // Convert gross salary
  const grossSalaryInTarget = (inputSalary / baseRate) * targetRate;
  
  // Calculate Net salary after mock tax deduction
  const netSalaryInTarget = grossSalaryInTarget * (1 - taxRate / 100);

  // Breakdown calculations
  const calculateBreakdown = (val) => {
    return {
      annual: val,
      monthly: val / 12,
      weekly: val / 52,
      daily: val / 260, // 5-day week, 52 weeks
      hourly: val / 2080 // 40 hours per week, 52 weeks
    };
  };

  const grossBreakdown = calculateBreakdown(grossSalaryInTarget);
  const netBreakdown = calculateBreakdown(netSalaryInTarget);

  // Simulated Purchasing Power Parity (PPP) Index
  // PPP indices relative to USD = 1.0 (e.g. price level ratios)
  const PPP_MULTIPLIERS = {
    USD: 1.0,
    INR: 0.32,  // INR is much cheaper, so $1 goes as far as ~$3.12 in purchase power
    EUR: 0.95,
    GBP: 0.90,
    JPY: 0.70,
    AUD: 1.10,
    CAD: 1.02,
    CHF: 1.45,
    CNY: 0.40,
    SGD: 1.15
  };

  // PPP equivalent salary = InputSalary * (PPP of target / PPP of source)
  const sourcePpp = PPP_MULTIPLIERS[salaryCurrency] || 1.0;
  const targetPpp = PPP_MULTIPLIERS[targetSalaryCurrency] || 1.0;
  const pppEquivalentInTarget = grossSalaryInTarget * (sourcePpp / targetPpp);

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden transition-all duration-300">
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Landmark className="w-5 h-5 text-emerald-500" />
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Salary Converter & Tax Estimator</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Convert annual compensations, check gross/net splits, and calculate PPP indices</p>
        </div>
      </div>

      {/* Form Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {/* Gross Annual Input */}
        <div>
          <label className="block text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase mb-1.5 tracking-wider flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5" /> Gross Annual Salary
          </label>
          <input
            type="number"
            min="1"
            value={inputSalary}
            onChange={(e) => setInputSalary(Math.max(1, parseFloat(e.target.value) || 0))}
            className="w-full glass-input text-xs font-bold text-slate-850 dark:text-white py-2.5"
          />
        </div>

        {/* Source Currency */}
        <div>
          <label className="block text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase mb-1.5 tracking-wider">Salary Currency</label>
          <select
            value={salaryCurrency}
            onChange={(e) => setSalaryCurrency(e.target.value)}
            className="w-full glass-input text-xs font-bold text-slate-850 dark:text-white py-2.5"
          >
            {Object.keys(CURRENCY_NAMES).map(code => (
              <option key={code} value={code}>{code}</option>
            ))}
          </select>
        </div>

        {/* Target Currency */}
        <div>
          <label className="block text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase mb-1.5 tracking-wider">Convert To</label>
          <select
            value={targetSalaryCurrency}
            onChange={(e) => setTargetSalaryCurrency(e.target.value)}
            className="w-full glass-input text-xs font-bold text-slate-850 dark:text-white py-2.5"
          >
            {Object.keys(CURRENCY_NAMES).map(code => (
              <option key={code} value={code} disabled={code === salaryCurrency}>{code}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Interactive Tax Estimator Slider */}
      <div className="p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-950/20 border border-slate-200/30 dark:border-slate-800/30 mb-6 space-y-2">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="flex items-center gap-1 text-slate-550 dark:text-slate-400">
            <Percent className="w-4 h-4 text-emerald-500 animate-pulse" /> Estimated Deductions / Tax Rate
          </span>
          <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{taxRate}% DEDUCTION</span>
        </div>
        <input
          type="range"
          min="0"
          max="50"
          value={taxRate}
          onChange={(e) => setTaxRate(parseInt(e.target.value) || 0)}
          className="w-full h-1.5 bg-slate-200 dark:bg-slate-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
        />
      </div>

      {/* Purchasing Power Parity (PPP) Explanation Box */}
      <div className="p-4 rounded-2xl border border-indigo-500/15 dark:border-indigo-500/25 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 dark:from-indigo-500/10 dark:to-purple-500/10 mb-6 flex gap-3 text-xs">
        <ShieldAlert className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
        <div>
          <span className="font-extrabold block text-slate-900 dark:text-white">Purchasing Power Parity (PPP) Equivalency</span>
          <p className="font-semibold leading-relaxed opacity-95 text-slate-500 dark:text-slate-400 mt-1">
            Standard exchange rates value this salary at <span className="font-extrabold text-slate-850 dark:text-slate-200">{grossSalaryInTarget.toLocaleString([], { maximumFractionDigits: 0 })} {targetSalaryCurrency}</span>.
            However, adjusting for local costs, this equivalent provides the purchasing weight of **{pppEquivalentInTarget.toLocaleString([], { maximumFractionDigits: 0 })} {targetSalaryCurrency}** inside {targetSalaryCurrency} markets!
          </p>
        </div>
      </div>

      {/* Converted Gross vs Net Splits Period breakdown Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-semibold border-collapse">
          <thead>
            <tr className="border-b border-slate-200/50 dark:border-slate-800/50 text-[10px] text-slate-450 dark:text-slate-500 uppercase tracking-wider">
              <th className="py-2.5 font-extrabold">Frequency Period</th>
              <th className="py-2.5 font-extrabold text-slate-800 dark:text-white">Gross Amount ({targetSalaryCurrency})</th>
              <th className="py-2.5 font-extrabold text-emerald-600 dark:text-emerald-400">Net Take-Home ({targetSalaryCurrency})</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/20 dark:divide-slate-800/40">
            <tr className="hover:bg-slate-50/10 transition-colors">
              <td className="py-3 font-bold flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-slate-400" /> Annual salary</td>
              <td className="py-3 font-extrabold text-slate-800 dark:text-slate-300">{grossBreakdown.annual.toLocaleString([], { maximumFractionDigits: 0 })}</td>
              <td className="py-3 font-extrabold text-emerald-500">{netBreakdown.annual.toLocaleString([], { maximumFractionDigits: 0 })}</td>
            </tr>
            <tr className="hover:bg-slate-50/10 transition-colors">
              <td className="py-3 font-bold flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-slate-400" /> Monthly payout</td>
              <td className="py-3 font-extrabold text-slate-800 dark:text-slate-300">{grossBreakdown.monthly.toLocaleString([], { maximumFractionDigits: 0 })}</td>
              <td className="py-3 font-extrabold text-emerald-500">{netBreakdown.monthly.toLocaleString([], { maximumFractionDigits: 0 })}</td>
            </tr>
            <tr className="hover:bg-slate-50/10 transition-colors">
              <td className="py-3 font-bold flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-slate-400" /> Weekly payout</td>
              <td className="py-3 font-extrabold text-slate-800 dark:text-slate-300">{grossBreakdown.weekly.toLocaleString([], { maximumFractionDigits: 0 })}</td>
              <td className="py-3 font-extrabold text-emerald-500">{netBreakdown.weekly.toLocaleString([], { maximumFractionDigits: 0 })}</td>
            </tr>
            <tr className="hover:bg-slate-50/10 transition-colors">
              <td className="py-3 font-bold flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-slate-400" /> Daily payout</td>
              <td className="py-3 font-extrabold text-slate-800 dark:text-slate-300">{grossBreakdown.daily.toLocaleString([], { maximumFractionDigits: 0 })}</td>
              <td className="py-3 font-extrabold text-emerald-500">{netBreakdown.daily.toLocaleString([], { maximumFractionDigits: 0 })}</td>
            </tr>
            <tr className="hover:bg-slate-50/10 transition-colors">
              <td className="py-3 font-bold flex items-center gap-1"><Hourglass className="w-3.5 h-3.5 text-slate-400 animate-spin-slow" /> Hourly equivalent</td>
              <td className="py-3 font-extrabold text-slate-800 dark:text-slate-300">{grossBreakdown.hourly.toLocaleString([], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              <td className="py-3 font-extrabold text-emerald-500">{netBreakdown.hourly.toLocaleString([], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
