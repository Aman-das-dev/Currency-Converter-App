import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeftRight, Heart, Share2, Mic, MicOff, Volume2, Sparkles, Copy, Check 
} from 'lucide-react';
import { 
  CURRENCY_NAMES, CURRENCY_FLAGS, CRYPTO_LIST 
} from '../services/rateApi';
import { motion, AnimatePresence } from 'framer-motion';

export default function ConverterCard({ 
  rates, 
  baseCurrency, 
  setBaseCurrency, 
  targetCurrency, 
  setTargetCurrency, 
  amount, 
  setAmount, 
  onConvert, 
  favorites, 
  toggleFavorite,
  addHistoryLog,
  voiceTrigger
}) {
  const [searchFrom, setSearchFrom] = useState('');
  const [searchTo, setSearchTo] = useState('');
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [voiceError, setVoiceError] = useState('');
  
  const [copied, setCopied] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  const fromRef = useRef(null);
  const toRef = useRef(null);

  // Check speech recognition support
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
    }
  }, []);

  // Listen to remote voice triggers (clicked in Navbar)
  useEffect(() => {
    if (voiceTrigger > 0) {
      startListening();
    }
  }, [voiceTrigger]);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (fromRef.current && !fromRef.current.contains(event.target)) {
        setShowFromDropdown(false);
      }
      if (toRef.current && !toRef.current.contains(event.target)) {
        setShowToDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Standard Convert Value calculation
  const baseRate = rates[baseCurrency] || 1;
  const targetRate = rates[targetCurrency] || 1;
  const rawConverted = (amount / baseRate) * targetRate;
  const convertedValue = isNaN(rawConverted) ? 0 : rawConverted;

  // Render converted result text
  const resultText = `${Number(amount).toLocaleString([], { minimumFractionDigits: 2 })} ${baseCurrency} = ${convertedValue.toLocaleString([], { minimumFractionDigits: baseCurrency.includes('BTC') || targetCurrency.includes('BTC') ? 6 : 2 })} ${targetCurrency}`;

  // Log conversion history on target value change
  useEffect(() => {
    if (amount > 0 && rates[baseCurrency] && rates[targetCurrency]) {
      const timer = setTimeout(() => {
        addHistoryLog({
          amount: parseFloat(amount),
          from: baseCurrency,
          to: targetCurrency,
          result: convertedValue,
          rate: targetRate / baseRate,
          timestamp: new Date()
        });
      }, 1000); // Debounce to prevent heavy spamming while typing
      return () => clearTimeout(timer);
    }
  }, [amount, baseCurrency, targetCurrency, rates]);

  // Voice Command Parsing
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsListening(true);
    setVoiceError('');
    setVoiceTranscript('Listening...');

    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      setVoiceTranscript(speechToText);
      parseVoiceCommand(speechToText);
    };

    recognition.onerror = (event) => {
      console.error('Speech error', event);
      setVoiceError('Could not recognize voice. Try again.');
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const parseVoiceCommand = (text) => {
    const cleaned = text.toLowerCase();
    
    // Friendly Currency mappings
    const wordToCode = {
      'dollar': 'USD', 'dollars': 'USD', 'usd': 'USD',
      'rupee': 'INR', 'rupees': 'INR', 'inr': 'INR', 'indian rupees': 'INR',
      'euro': 'EUR', 'euros': 'EUR', 'eur': 'EUR',
      'pound': 'GBP', 'pounds': 'GBP', 'gbp': 'GBP', 'british pounds': 'GBP',
      'yen': 'JPY', 'jpy': 'JPY',
      'bitcoin': 'BTC', 'btc': 'BTC',
      'ethereum': 'ETH', 'eth': 'ETH',
      'solana': 'SOL', 'sol': 'SOL',
      'doge': 'DOGE', 'dogecoin': 'DOGE',
      'ripple': 'XRP', 'xrp': 'XRP',
      'binance': 'BNB', 'bnb': 'BNB',
      'australian dollar': 'AUD', 'aud': 'AUD',
      'canadian dollar': 'CAD', 'cad': 'CAD',
      'swiss franc': 'CHF', 'chf': 'CHF'
    };

    // Regex to match e.g. "convert 100 dollars to rupees" or "100 usd to eur" or "fifty dollars to yen"
    // Let's first search for numeric amount
    const amountMatch = cleaned.match(/(\d+(?:\.\d+)?)/);
    
    if (amountMatch) {
      const val = parseFloat(amountMatch[1]);
      setAmount(val);
      
      // Look for keywords: "to" or "in" to split From and To
      let baseWord = '';
      let targetWord = '';

      if (cleaned.includes(' to ')) {
        const parts = cleaned.split(' to ');
        baseWord = parts[0].replace(/.*convert\s+/, '').replace(/\d+/g, '').trim();
        targetWord = parts[1].trim();
      } else if (cleaned.includes(' in ')) {
        const parts = cleaned.split(' in ');
        baseWord = parts[0].replace(/.*convert\s+/, '').replace(/\d+/g, '').trim();
        targetWord = parts[1].trim();
      }

      // Check match with keys
      Object.keys(wordToCode).forEach(key => {
        if (baseWord.includes(key)) {
          setBaseCurrency(wordToCode[key]);
        }
        if (targetWord.includes(key)) {
          setTargetCurrency(wordToCode[key]);
        }
      });
    } else {
      setVoiceError("Could not find a number amount. Say 'Convert 100 dollars to rupees'.");
    }
  };

  const handleSwap = () => {
    const temp = baseCurrency;
    setBaseCurrency(targetCurrency);
    setTargetCurrency(temp);
  };

  const handleShare = () => {
    const textToShare = `📊 Real-time Conversion Result:\n${resultText}\nPowered by XChange Fintech Engine.`;
    navigator.clipboard.writeText(textToShare);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    if (navigator.share) {
      navigator.share({
        title: 'XChange Conversion Result',
        text: textToShare,
      }).catch(err => console.log('Share canceled', err));
    }
  };

  // Check if current pair is favorite
  const isFavorite = favorites.some(
    fav => fav.from === baseCurrency && fav.to === targetCurrency
  );

  // Filter currency codes
  const filteredFromList = Object.keys(CURRENCY_NAMES).filter(
    code => code.toLowerCase().includes(searchFrom.toLowerCase()) || 
            CURRENCY_NAMES[code].toLowerCase().includes(searchFrom.toLowerCase())
  );

  const filteredToList = Object.keys(CURRENCY_NAMES).filter(
    code => code.toLowerCase().includes(searchTo.toLowerCase()) || 
            CURRENCY_NAMES[code].toLowerCase().includes(searchTo.toLowerCase())
  );

  const getFlagUrl = (code) => {
    const flag = CURRENCY_FLAGS[code];
    if (!flag) return 'https://flagcdn.com/w40/un.png';
    // Cryptos flags override
    if (CRYPTO_LIST.includes(code)) {
      return `https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/32/color/${code.toLowerCase()}.png`;
    }
    return `https://flagcdn.com/w40/${flag}.png`;
  };

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden transition-all duration-300">
      {/* Dynamic Background Glows */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Card Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-500 animate-pulse" />
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Smart Converter</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleFavorite(baseCurrency, targetCurrency)}
            className={`p-2 rounded-xl transition-all duration-300 ${
              isFavorite 
                ? 'bg-rose-500/10 text-rose-500' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-500'
            }`}
            title="Favorite this Pair"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
            title="Share Result"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Converter Form */}
      <div className="space-y-5">
        {/* Amount Input */}
        <div>
          <label htmlFor="card-amount" className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
            Amount to Convert
          </label>
          <div className="relative">
            <input
              id="card-amount"
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(Math.max(0, parseFloat(e.target.value) || 0))}
              className="w-full glass-input pr-12 text-slate-900 dark:text-white font-bold text-lg"
              placeholder="0.00"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-extrabold text-slate-400 dark:text-slate-500">
              {baseCurrency}
            </span>
          </div>
        </div>

        {/* Currencies Dropdowns Block */}
        <div className="grid grid-cols-1 md:grid-cols-9 gap-4 items-center">
          {/* From Dropdown */}
          <div ref={fromRef} className="relative md:col-span-4">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
              From
            </label>
            <button
              onClick={() => setShowFromDropdown(!showFromDropdown)}
              className="w-full flex items-center justify-between glass-input py-2.5 text-left text-sm font-semibold text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-emerald-500"
            >
              <span className="flex items-center gap-2">
                <img 
                  src={getFlagUrl(baseCurrency)} 
                  alt={baseCurrency} 
                  className={`w-5 h-4 object-cover ${CRYPTO_LIST.includes(baseCurrency) ? 'rounded-full' : 'rounded-sm'}`} 
                />
                <span>{baseCurrency} - {CURRENCY_NAMES[baseCurrency]}</span>
              </span>
              <span className="text-slate-400 dark:text-slate-500 text-xs">▼</span>
            </button>

            {/* Filtered search dropdown menu */}
            <AnimatePresence>
              {showFromDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute z-30 left-0 right-0 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl max-h-60 overflow-y-auto"
                >
                  <input
                    type="text"
                    placeholder="Search currency..."
                    value={searchFrom}
                    onChange={(e) => setSearchFrom(e.target.value)}
                    className="w-full sticky top-0 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-3 py-2 text-xs text-slate-800 dark:text-slate-200 outline-none"
                  />
                  <div className="py-1">
                    {filteredFromList.map(code => (
                      <button
                        key={code}
                        onClick={() => {
                          setBaseCurrency(code);
                          setShowFromDropdown(false);
                          setSearchFrom('');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-left"
                      >
                        <img 
                          src={getFlagUrl(code)} 
                          alt={code} 
                          className={`w-4 h-3 object-cover ${CRYPTO_LIST.includes(code) ? 'rounded-full' : 'rounded-sm'}`} 
                        />
                        <span>{code} - {CURRENCY_NAMES[code]}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Swap Button Column */}
          <div className="flex justify-center md:col-span-1 pt-4 md:pt-0">
            <motion.button
              whileTap={{ scale: 0.9, rotate: 180 }}
              onClick={handleSwap}
              className="p-3.5 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 text-white shadow-lg hover:shadow-emerald-500/20 active:scale-95 transition-all"
              aria-label="Swap Currencies"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </motion.button>
          </div>

          {/* To Dropdown */}
          <div ref={toRef} className="relative md:col-span-4">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
              To
            </label>
            <button
              onClick={() => setShowToDropdown(!showToDropdown)}
              className="w-full flex items-center justify-between glass-input py-2.5 text-left text-sm font-semibold text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-emerald-500"
            >
              <span className="flex items-center gap-2">
                <img 
                  src={getFlagUrl(targetCurrency)} 
                  alt={targetCurrency} 
                  className={`w-5 h-4 object-cover ${CRYPTO_LIST.includes(targetCurrency) ? 'rounded-full' : 'rounded-sm'}`} 
                />
                <span>{targetCurrency} - {CURRENCY_NAMES[targetCurrency]}</span>
              </span>
              <span className="text-slate-400 dark:text-slate-500 text-xs">▼</span>
            </button>

            {/* Filtered search dropdown menu */}
            <AnimatePresence>
              {showToDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute z-30 left-0 right-0 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl max-h-60 overflow-y-auto"
                >
                  <input
                    type="text"
                    placeholder="Search currency..."
                    value={searchTo}
                    onChange={(e) => setSearchTo(e.target.value)}
                    className="w-full sticky top-0 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-3 py-2 text-xs text-slate-800 dark:text-slate-200 outline-none"
                  />
                  <div className="py-1">
                    {filteredToList.map(code => (
                      <button
                        key={code}
                        onClick={() => {
                          setTargetCurrency(code);
                          setShowToDropdown(false);
                          setSearchTo('');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-left"
                      >
                        <img 
                          src={getFlagUrl(code)} 
                          alt={code} 
                          className={`w-4 h-3 object-cover ${CRYPTO_LIST.includes(code) ? 'rounded-full' : 'rounded-sm'}`} 
                        />
                        <span>{code} - {CURRENCY_NAMES[code]}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Quick Amount Chips */}
        <div className="flex gap-2 flex-wrap items-center">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 mr-1">Quick:</span>
          {[10, 100, 500, 1000].map(val => (
            <button
              key={val}
              onClick={() => setAmount(val)}
              className="px-3 py-1 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-800 bg-white/20 dark:bg-slate-900/20 text-slate-600 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {val.toLocaleString()}
            </button>
          ))}
        </div>

        {/* Result Showcase Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-500/5 to-cyan-500/5 dark:from-emerald-500/10 dark:to-cyan-500/10 border border-emerald-500/10 dark:border-emerald-500/20 flex flex-col justify-center items-center text-center">
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Exchange Conversion</p>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mb-1.5 transition-all">
            {resultText}
          </h3>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-full flex items-center gap-1">
            <Volume2 className="w-3.5 h-3.5" /> 
            1 {baseCurrency} = {(targetRate / baseRate).toLocaleString([], { minimumFractionDigits: baseCurrency.includes('BTC') ? 6 : 4 })} {targetCurrency}
          </p>
        </div>

        {/* Voice Speech Assistant Bar */}
        {speechSupported && (
          <div className="border border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl p-4 flex flex-col gap-2 relative overflow-hidden transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Voice Assistant Converter</span>
              </div>
              <button
                onClick={startListening}
                disabled={isListening}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isListening 
                    ? 'bg-rose-500 text-white glowing-rose' 
                    : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'
                }`}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-3.5 h-3.5" /> Stop Listening
                  </>
                ) : (
                  <>
                    <Mic className="w-3.5 h-3.5" /> Talk Now
                  </>
                )}
              </button>
            </div>

            {/* Simulated soundwave */}
            {isListening && (
              <div className="flex justify-center items-center gap-1 h-6">
                <span className="wave-bar" style={{ animationDelay: '0.1s' }} />
                <span className="wave-bar" style={{ animationDelay: '0.3s' }} />
                <span className="wave-bar" style={{ animationDelay: '0.5s' }} />
                <span className="wave-bar" style={{ animationDelay: '0.2s' }} />
                <span className="wave-bar" style={{ animationDelay: '0.4s' }} />
              </div>
            )}

            {voiceTranscript && (
              <p className="text-[11px] font-medium text-slate-600 dark:text-slate-400 italic bg-white/40 dark:bg-slate-900/40 p-2 rounded-lg border border-slate-200/20">
                "{voiceTranscript}"
              </p>
            )}

            {voiceError && (
              <p className="text-[11px] font-bold text-rose-500">
                ⚠️ {voiceError}
              </p>
            )}
            
            <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight">
              *Try saying: "Convert 250 dollars to rupees" or "10 bitcoin to usd"*
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
