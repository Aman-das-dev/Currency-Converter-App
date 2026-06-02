import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Send, Brain, Activity } from 'lucide-react';
import { getGeminiAdvice } from '../services/gemini';
import { motion, AnimatePresence } from 'framer-motion';

// Simple lightweight markdown parser for clean text formatting
const renderMarkdown = (text) => {
  if (!text) return null;
  
  const lines = text.split('\n');
  return lines.map((line, index) => {
    let cleanLine = line.trim();
    
    // Heading 3
    if (cleanLine.startsWith('### ')) {
      return (
        <h4 key={index} className="text-base font-extrabold text-slate-850 dark:text-white mt-4 mb-2 flex items-center gap-1.5 border-b border-slate-200/40 dark:border-slate-800/40 pb-1">
          {cleanLine.replace('### ', '')}
        </h4>
      );
    }
    // Heading 4
    if (cleanLine.startsWith('#### ')) {
      return (
        <h5 key={index} className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-3 mb-1.5">
          {cleanLine.replace('#### ', '')}
        </h5>
      );
    }
    // Bullet points
    if (cleanLine.startsWith('* ') || cleanLine.startsWith('- ')) {
      const bulletContent = cleanLine.replace(/^[\*\-]\s+/, '');
      return (
        <li key={index} className="ml-4 list-disc text-xs font-semibold text-slate-600 dark:text-slate-350 leading-relaxed py-0.5">
          {parseInlineFormatting(bulletContent)}
        </li>
      );
    }
    // Numbered list
    if (/^\d+\.\s+/.test(cleanLine)) {
      const numContent = cleanLine.replace(/^\d+\.\s+/, '');
      return (
        <li key={index} className="ml-4 list-decimal text-xs font-semibold text-slate-600 dark:text-slate-350 leading-relaxed py-0.5">
          {parseInlineFormatting(numContent)}
        </li>
      );
    }
    // Empty line
    if (cleanLine === '') {
      return <div key={index} className="h-2" />;
    }
    
    // Warning block alerts
    if (cleanLine.startsWith('> ')) {
      return (
        <div key={index} className="p-3 my-2 border-l-4 border-amber-500 bg-amber-500/5 text-xs text-amber-600 dark:text-amber-400 rounded-r-xl font-semibold italic">
          {cleanLine.replace('> ', '')}
        </div>
      );
    }

    // Normal paragraph
    return (
      <p key={index} className="text-xs font-semibold text-slate-600 dark:text-slate-350 leading-relaxed py-0.5">
        {parseInlineFormatting(cleanLine)}
      </p>
    );
  });
};

// Parse bold markdown "**text**" into JSX elements
const parseInlineFormatting = (text) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-extrabold text-slate-900 dark:text-white">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

export default function AiAdvisor({ 
  travelContext, 
  clearTravelContext,
  rates = {},
  baseCurrency = 'USD',
  targetCurrency = 'INR',
  amount = 100,
  history = []
}) {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Telemetry toggler
  const [useTelemetry, setUseTelemetry] = useState(true);

  const responseEndRef = useRef(null);

  // Automatically trigger when travel budget request comes from parent
  useEffect(() => {
    if (travelContext) {
      const travelPrompt = `Create a detailed daily travel budget and spending recommendations for a trip to ${travelContext.destination}. The duration is ${travelContext.days} days and the total budget is $${travelContext.budget} USD equivalent (~${travelContext.currency}). List average expenses for hotel, transit, food, and emergency tips.`;
      setPrompt(travelPrompt);
      handleGenerate(travelPrompt, travelContext);
      clearTravelContext(); // clear trigger
    }
  }, [travelContext]);

  const handleGenerate = async (customPrompt = prompt, context = {}) => {
    const activePrompt = customPrompt || prompt;
    if (!activePrompt.trim()) return;

    setLoading(true);
    setResponse('');

    // Pre-pack rich workspace telemetry context
    const recentConversions = history.slice(0, 5).map(h => 
      `${h.amount} ${h.from} to ${h.result.toFixed(2)} ${h.to}`
    ).join(', ');

    const telemetryContext = useTelemetry ? {
      budget: amount,
      currency: targetCurrency,
      destination: `Selected pair: ${baseCurrency} to ${targetCurrency}`,
      days: 30, // monthly frequency context
      ratesData: `Active rate: 1 ${baseCurrency} = ${(rates[targetCurrency] || 1).toFixed(4)} ${targetCurrency}`,
      historyData: recentConversions ? `Recent queries: ${recentConversions}` : 'No history yet'
    } : {};

    // Combine custom prompts with telemetry preambles for maximum AI power
    const enrichedPrompt = useTelemetry 
      ? `System context: Active User Amount is ${amount} ${baseCurrency}, Target conversion is ${targetCurrency} at rate ${(rates[targetCurrency] || 1).toFixed(4)}. Conversions log: ${recentConversions || 'None'}.\n\nUser Question: ${activePrompt}`
      : activePrompt;

    const result = await getGeminiAdvice(enrichedPrompt, { ...context, ...telemetryContext });
    setResponse(result);
    setLoading(false);
  };

  // Scroll to response
  useEffect(() => {
    if (responseEndRef.current) {
      responseEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [response, loading]);

  const presetQueries = [
    { 
      label: '50/30/20 Monthly Allocation', 
      text: `Break down my active target savings amount (${amount} ${targetCurrency}) using the standard 50/30/20 budgeting rule. What specific monthly allocations do you recommend?` 
    },
    { 
      label: 'Optimal Exchange Strategy', 
      text: `Based on my current active target pair (${baseCurrency} to ${targetCurrency}), how should I optimize large exchanges of currency? What indicators should I look out for?` 
    },
    { 
      label: 'Risk & Inflation Hedging', 
      text: `Provide a detailed wealth shield strategy to protect my holdings in ${baseCurrency} against currency inflation and purchasing power decay.` 
    }
  ];

  return (
    <div className="space-y-6">
      {/* 1. POWERFUL TELEMETRY & API CARD */}
      <div className="glass-panel p-5 rounded-3xl grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        
        {/* Backend AI Security Panel */}
        <div className="space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
            <Brain className="w-3.5 h-3.5 text-emerald-500" /> API Security
          </span>
          <div className="w-full bg-slate-100/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-700 dark:text-slate-300 font-bold">
            Gemini requests are secured server-side. No client API keys are stored.
          </div>
          <p className="text-[9px] text-slate-400 dark:text-slate-500 leading-tight">
            *This frontend now uses backend-only API credentials for improved security.
          </p>
        </div>

        {/* Telemetry Panel */}
        <div className="p-4 rounded-2xl bg-white/20 dark:bg-slate-900/30 border border-slate-200/20 dark:border-slate-800/40 flex flex-col justify-between h-full gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-500" /> Active Workspace Telemetry
            </span>
            <button
              onClick={() => setUseTelemetry(!useTelemetry)}
              className={`text-[9px] font-bold px-2 py-0.5 rounded-full transition-all ${
                useTelemetry 
                  ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
              }`}
            >
              {useTelemetry ? 'Telemetry Sync: ON' : 'Telemetry Sync: OFF'}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs font-extrabold">
            <div className="p-2 rounded-xl bg-slate-100/50 dark:bg-slate-950/40">
              <p className="text-[9px] font-bold text-slate-400 uppercase">Amt</p>
              <p className="text-emerald-500 mt-0.5">{amount.toLocaleString()} {baseCurrency}</p>
            </div>
            <div className="p-2 rounded-xl bg-slate-100/50 dark:bg-slate-950/40">
              <p className="text-[9px] font-bold text-slate-400 uppercase">Pair</p>
              <p className="text-cyan-500 mt-0.5">{baseCurrency} ➡️ {targetCurrency}</p>
            </div>
            <div className="p-2 rounded-xl bg-slate-100/50 dark:bg-slate-950/40">
              <p className="text-[9px] font-bold text-slate-400 uppercase">Hist Logs</p>
              <p className="text-indigo-500 mt-0.5">{history.length} Saved</p>
            </div>
          </div>
        </div>

      </div>

      {/* 2. CHAT & QUERY ADVISOR PANEL */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden transition-all duration-300">
        
        {/* Title */}
        <div className="flex items-center gap-2.5 mb-6">
          <div className="p-2.5 bg-gradient-to-tr from-emerald-500 to-cyan-500 rounded-2xl text-white shadow-md shadow-emerald-500/10">
            <Brain className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">AI Spending Advisor</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Ask Gemini for smart travel audits, budget optimization, and savings tips</p>
          </div>
        </div>

        {/* Main Container */}
        <div className="space-y-4">
          {/* Preset chips */}
          <div className="flex gap-2 flex-wrap items-center">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mr-1">Guides:</span>
            {presetQueries.map((q, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setPrompt(q.text);
                  handleGenerate(q.text);
                }}
                className="px-2.5 py-1 rounded-lg text-[10px] font-semibold border border-slate-200 dark:border-slate-800 bg-white/20 dark:bg-slate-900/20 text-slate-500 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {q.label}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="relative flex gap-2">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask AI spending adviser: 'Is my active budget allocation safe?' or 'Create a financial roadmap for my active amount'..."
              className="w-full glass-input pr-12 text-xs font-bold text-slate-850 dark:text-white min-h-[70px] resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleGenerate();
                }
              }}
            />
            <button
              onClick={() => handleGenerate()}
              disabled={loading || !prompt.trim()}
              className="px-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center hover:bg-slate-800 dark:hover:bg-slate-100 disabled:opacity-50 transition-all self-stretch shadow-md shrink-0 cursor-pointer"
              title="Send Prompt"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          {/* Response Showcase */}
          <div className="relative min-h-[140px] border border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl p-5 overflow-y-auto max-h-[300px]">
            {loading && (
              <div className="flex flex-col justify-center items-center gap-3 py-10">
                <div className="flex justify-center items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
                </div>
                <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest animate-pulse">AI is thinking...</p>
              </div>
            )}

            {!loading && !response && (
              <div className="flex flex-col justify-center items-center text-center py-8">
                <Sparkles className="w-8 h-8 text-slate-300 dark:text-slate-750 mb-2 animate-pulse" />
                <p className="text-xs font-bold text-slate-450 dark:text-slate-550">Consult the AI Spending Advisor</p>
                <p className="text-[10px] text-slate-405 dark:text-slate-500 mt-1 max-w-xs leading-relaxed">
                  Type in your custom financial query or click a presets chip above to start.
                </p>
              </div>
            )}

            {!loading && response && (
              <div className="space-y-2.5 pr-1">
                {renderMarkdown(response)}
                <div ref={responseEndRef} />
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
