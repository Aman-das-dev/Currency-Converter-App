import React, { useState, useEffect } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend, 
  Filler 
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { TrendingUp, Award } from 'lucide-react';
import { fetchHistoricalRates } from '../services/rateApi';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function TrendChart({ baseCurrency, targetCurrency, darkMode }) {
  const [timeframe, setTimeframe] = useState('7D');
  const [chartData, setChartData] = useState({ labels: [], data: [] });

  useEffect(() => {
    // Fetch historical rate data based on selected pair & timeframe
    const result = fetchHistoricalRates(baseCurrency, targetCurrency, timeframe);
    setChartData(result);
  }, [baseCurrency, targetCurrency, timeframe]);

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        fill: true,
        label: `${baseCurrency} to ${targetCurrency} Exchange Rate`,
        data: chartData.data,
        borderColor: '#10b981', // emerald-500
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return null;
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, 'rgba(16, 185, 129, 0.25)');
          gradient.addColorStop(1, 'rgba(16, 185, 129, 0.0)');
          return gradient;
        },
        borderWidth: 2.5,
        tension: 0.35,
        pointRadius: chartData.data.length > 50 ? 0 : 2,
        pointHoverRadius: 5,
        pointBackgroundColor: '#10b981',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: darkMode ? '#1e293b' : '#ffffff',
        titleColor: darkMode ? '#f8fafc' : '#0f172a',
        bodyColor: darkMode ? '#cbd5e1' : '#334155',
        borderColor: 'rgba(16, 185, 129, 0.2)',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 12,
        titleFont: { family: 'Plus Jakarta Sans', weight: 'bold' },
        bodyFont: { family: 'Plus Jakarta Sans' },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: darkMode ? '#64748b' : '#94a3b8',
          font: {
            size: 10,
            family: 'Plus Jakarta Sans',
          },
          maxTicksLimit: timeframe === '1Y' ? 6 : 8,
        },
      },
      y: {
        grid: {
          color: darkMode ? 'rgba(51, 65, 85, 0.2)' : 'rgba(226, 232, 240, 0.6)',
        },
        ticks: {
          color: darkMode ? '#64748b' : '#94a3b8',
          font: {
            size: 10,
            family: 'Plus Jakarta Sans',
          },
          callback: (value) => value.toLocaleString([], { minimumFractionDigits: 2, maximumFractionDigits: 4 }),
        },
      },
    },
  };

  // Calculate some simple rate summary details
  const rates = chartData.data;
  const currentRate = rates[rates.length - 1] || 0;
  const initialRate = rates[0] || 0;
  const difference = currentRate - initialRate;
  const percentChange = initialRate > 0 ? (difference / initialRate) * 100 : 0;

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden transition-all duration-300">
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Exchange Trend</h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Historical rate fluctuation for <span className="font-bold text-slate-700 dark:text-slate-200">{baseCurrency} to {targetCurrency}</span>
          </p>
        </div>

        {/* Timeframe selector */}
        <div className="flex bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-850 p-1 rounded-xl shrink-0 self-start">
          {['1D', '7D', '30D', '1Y'].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                timeframe === tf
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-md'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Rate Statistics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 mb-6 rounded-2xl bg-slate-50/50 dark:bg-slate-950/20 border border-slate-200/30 dark:border-slate-800/30">
        <div>
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider mb-0.5">Current Rate</span>
          <span className="text-sm font-extrabold text-slate-850 dark:text-white">
            {currentRate.toLocaleString([], { minimumFractionDigits: 4, maximumFractionDigits: 6 })}
          </span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider mb-0.5">Net Change</span>
          <span className={`text-sm font-extrabold flex items-center ${difference >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
            {difference >= 0 ? '+' : ''}{difference.toLocaleString([], { minimumFractionDigits: 4, maximumFractionDigits: 6 })}
          </span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider mb-0.5">Percentage</span>
          <span className={`text-sm font-extrabold ${percentChange >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
            {percentChange >= 0 ? '+' : ''}{percentChange.toFixed(2)}%
          </span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider mb-0.5">Volatility</span>
          <span className="text-sm font-extrabold text-indigo-500 flex items-center gap-0.5">
            <Award className="w-3.5 h-3.5" /> Stable
          </span>
        </div>
      </div>

      {/* Chart Wrapper */}
      <div className="h-64 sm:h-72 w-full">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
