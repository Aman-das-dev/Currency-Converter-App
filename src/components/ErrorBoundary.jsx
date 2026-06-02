import React from 'react';
import { ShieldAlert, RefreshCw, Home, HeartHandshake } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an active runtime telemetry exception:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    // Clear potentially corrupted workspace state variables
    try {
      localStorage.removeItem('currency_history');
      localStorage.removeItem('currency_favorites');
    } catch (e) {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const isDark = localStorage.getItem('currency_darkmode') === 'true';
      
      return (
        <div className={`min-h-screen flex items-center justify-center p-6 transition-colors duration-300 font-sans ${
          isDark ? 'bg-[#060813] text-white' : 'bg-slate-50 text-slate-800'
        }`}>
          {/* Ambient Glows */}
          <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-[40vw] h-[40vw] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

          <div className={`w-full max-w-xl p-8 rounded-[32px] border shadow-2xl relative overflow-hidden transition-all duration-300 ${
            isDark 
              ? 'border-white/10 bg-[#0a0f24]/80 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)]' 
              : 'border-slate-200 bg-white/90 backdrop-blur-xl shadow-xl shadow-purple-500/5'
          }`}>
            {/* Spinning Brand Logo in Corner */}
            <div className="absolute -top-6 -right-6 w-32 h-32 opacity-5 pointer-events-none">
              <svg viewBox="0 0 100 100" className="w-full h-full text-current">
                <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="currentColor" className="font-black text-[38px] select-none">$</text>
                <g stroke="currentColor" strokeWidth="7" fill="none">
                  <path d="M 22 40 A 32 32 0 0 1 78 30" />
                  <path d="M 78 60 A 32 32 0 0 1 22 70" />
                </g>
              </svg>
            </div>

            <div className="flex flex-col items-center text-center space-y-5">
              {/* Glowing Alert Emblem */}
              <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500 border border-rose-500/20 shadow-lg shadow-rose-500/5 animate-pulse">
                <ShieldAlert className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-black tracking-widest text-rose-500 uppercase">
                  Runtime Exception Intercepted
                </span>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                  FinVerse Safe Mode Active
                </h2>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'} max-w-md`}>
                  A localized scripting error was isolated inside the rendering tree to protect database telemetry.
                </p>
              </div>

              {/* Collapsible Error Technical Logs */}
              <div className={`w-full p-4 rounded-2xl border text-left text-[10px] font-mono leading-relaxed overflow-x-auto max-h-40 ${
                isDark 
                  ? 'bg-slate-950/60 border-white/5 text-rose-400' 
                  : 'bg-slate-50 border-slate-200 text-rose-600'
              }`}>
                <span className="font-extrabold block mb-1 uppercase tracking-wider text-[9px] opacity-75">Exception Telemetry:</span>
                {this.state.error && this.state.error.toString()}
              </div>

              {/* Option Recovery Buttons */}
              <div className="grid grid-cols-2 gap-3 w-full pt-3">
                <button
                  onClick={this.handleReset}
                  className="py-3 px-4 rounded-xl bg-gradient-to-r from-purple-650 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-extrabold text-xs shadow-lg shadow-purple-500/15 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Restore Session</span>
                </button>
                
                <button
                  onClick={() => window.location.href = '/'}
                  className={`py-3 px-4 rounded-xl font-extrabold text-xs border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isDark 
                      ? 'border-white/10 bg-white/5 hover:bg-white/10 text-slate-300' 
                      : 'border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Return Home</span>
                </button>
              </div>

              <div className={`flex items-center gap-1.5 text-[9px] font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                <HeartHandshake className="w-3.5 h-3.5 text-indigo-500" /> Secure Sandbox Environment Telemetry
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
