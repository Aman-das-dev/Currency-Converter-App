// Exchange Rate API Service

const PRIMARY_API =
  import.meta.env.VITE_RATE_API_PRIMARY || 'https://open.er-api.com/v6/latest';
const BACKUP_API =
  import.meta.env.VITE_RATE_API_BACKUP ||
  'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies';

// Comprehensive mock database for fallback / offline usage
export const MOCK_RATES = {
  USD: 1,
  INR: 83.45,
  EUR: 0.92,
  GBP: 0.78,
  JPY: 156.80,
  AUD: 1.51,
  CAD: 1.36,
  CHF: 0.90,
  CNY: 7.24,
  SGD: 1.35,
  NZD: 1.63,
  ZAR: 18.52,
  BRL: 5.15,
  AED: 3.67,
  HKD: 7.81,
  KRW: 1375.50,
  // Cryptos in terms of 1 USD
  BTC: 0.000015,  // ~67,000 USD
  ETH: 0.00028,   // ~3,500 USD
  DOGE: 6.25,     // ~0.16 USD
  SOL: 0.0062,    // ~160 USD
  BNB: 0.0017,    // ~590 USD
  XRP: 1.92,      // ~0.52 USD
};

// Full Currency Name Mapping
export const CURRENCY_NAMES = {
  USD: 'US Dollar',
  INR: 'Indian Rupee',
  EUR: 'Euro',
  GBP: 'British Pound',
  JPY: 'Japanese Yen',
  AUD: 'Australian Dollar',
  CAD: 'Canadian Dollar',
  CHF: 'Swiss Franc',
  CNY: 'Chinese Yuan',
  SGD: 'Singapore Dollar',
  NZD: 'New Zealand Dollar',
  ZAR: 'South African Rand',
  BRL: 'Brazilian Real',
  AED: 'UAE Dirham',
  HKD: 'Hong Kong Dollar',
  KRW: 'South Korean Won',
  BTC: 'Bitcoin',
  ETH: 'Ethereum',
  DOGE: 'Dogecoin',
  SOL: 'Solana',
  BNB: 'Binance Coin',
  XRP: 'Ripple'
};

// Flag Codes Mapping (FlagCDN codes)
export const CURRENCY_FLAGS = {
  USD: 'us',
  INR: 'in',
  EUR: 'eu',
  GBP: 'gb',
  JPY: 'jp',
  AUD: 'au',
  CAD: 'ca',
  CHF: 'ch',
  CNY: 'cn',
  SGD: 'sg',
  NZD: 'nz',
  ZAR: 'za',
  BRL: 'br',
  AED: 'ae',
  HKD: 'hk',
  KRW: 'kr',
  BTC: 'btc',
  ETH: 'eth',
  DOGE: 'doge',
  SOL: 'sol',
  BNB: 'bnb',
  XRP: 'xrp'
};

// Crypto List
export const CRYPTO_LIST = ['BTC', 'ETH', 'DOGE', 'SOL', 'BNB', 'XRP'];

// Live market status: NY, London, Tokyo, Mumbai timezones & open hours
export const getMarketStatus = () => {
  const getMarketTime = (offset) => {
    const d = new Date();
    const utc = d.getTime() + d.getTimezoneOffset() * 60000;
    return new Date(utc + 3600000 * offset);
  };

  const isMarketOpen = (time, openHour = 9, closeHour = 17) => {
    const hour = time.getHours();
    const day = time.getDay();
    // Weekend check
    if (day === 0 || day === 6) return false;
    return hour >= openHour && hour < closeHour;
  };

  // NY (UTC-4)
  const nyTime = getMarketTime(-4);
  // London (UTC+1)
  const londonTime = getMarketTime(1);
  // Tokyo (UTC+9)
  const tokyoTime = getMarketTime(9);
  // Mumbai (UTC+5.5)
  const mumbaiTime = getMarketTime(5.5);

  return [
    { name: 'New York (NYSE)', time: nyTime, open: isMarketOpen(nyTime, 9, 16) },
    { name: 'London (LSE)', time: londonTime, open: isMarketOpen(londonTime, 8, 16) },
    { name: 'Tokyo (TSE)', time: tokyoTime, open: isMarketOpen(tokyoTime, 9, 15) },
    { name: 'Mumbai (NSE)', time: mumbaiTime, open: isMarketOpen(mumbaiTime, 9, 15) },
  ];
};

export const fetchRates = async (baseCurrency = 'USD') => {
  try {
    const response = await fetch(`${PRIMARY_API}/${baseCurrency}`);
    if (!response.ok) throw new Error('Primary API fetch failed');
    const data = await response.json();
    
    // Mix cryptos into results from mock rates or relative conversions
    const rates = { ...data.rates };
    
    // Inject crypto rates relative to USD
    const usdToTargetRate = rates['USD'] || 1; // if base is different
    CRYPTO_LIST.forEach(crypto => {
      // MOCK_RATES has crypto value in terms of 1 USD (e.g. BTC: 0.000015)
      // So to convert 1 base to crypto: base -> USD -> crypto
      const rateInUsd = rates[crypto] || (1 / MOCK_RATES[crypto]);
      if (!rates[crypto]) {
        // If not in API, calculate based on mock USD rate
        const baseToUsd = baseCurrency === 'USD' ? 1 : rates['USD'] || (1 / MOCK_RATES[baseCurrency]);
        rates[crypto] = (1 / baseToUsd) * MOCK_RATES[crypto];
      }
    });

    return {
      rates,
      base: baseCurrency,
      time: data.time_last_update_utc || new Date().toUTCString(),
    };
  } catch (err) {
    console.warn('Primary exchange rates API failed, trying backup API...', err);
    try {
      const response = await fetch(`${BACKUP_API}/${baseCurrency.toLowerCase()}.json`);
      if (!response.ok) throw new Error('Backup API fetch failed');
      const data = await response.json();
      const rates = data[baseCurrency.toLowerCase()];
      
      // Normalize casing
      const normalizedRates = {};
      Object.keys(rates).forEach(key => {
        normalizedRates[key.toUpperCase()] = rates[key];
      });

      return {
        rates: { ...MOCK_RATES, ...normalizedRates },
        base: baseCurrency,
        time: new Date().toUTCString(),
      };
    } catch (backErr) {
      console.error('All rate APIs failed. Loading robust mock fallbacks.', backErr);
      
      // Calculate relative mock rates if base isn't USD
      const baseRateInUsd = MOCK_RATES[baseCurrency] || 1;
      const relativeRates = {};
      Object.keys(MOCK_RATES).forEach(key => {
        // value of 1 base in key = (value of 1 USD in key) / (value of 1 USD in base)
        relativeRates[key] = MOCK_RATES[key] / baseRateInUsd;
      });

      return {
        rates: relativeRates,
        base: baseCurrency,
        time: new Date().toUTCString(),
        isMock: true
      };
    }
  }
};

// Simulated Trend Data Generator
export const fetchHistoricalRates = (base, target, timeframe = '7D') => {
  let days = 7;
  if (timeframe === '1D') days = 1;
  else if (timeframe === '30D') days = 30;
  else if (timeframe === '1Y') days = 365;

  const mockBaseRates = MOCK_RATES[base] || 1;
  const mockTargetRates = MOCK_RATES[target] || 83;
  const currentRate = mockTargetRates / mockBaseRates;

  const data = [];
  const labels = [];
  const now = new Date();

  // For 1D timeframe, show hours
  if (timeframe === '1D') {
    for (let i = 24; i >= 0; i--) {
      const hourTime = new Date(now.getTime() - i * 3600 * 1000);
      labels.push(hourTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      // Slight fluctuation around current rate
      const fluctuation = (Math.random() - 0.5) * 0.005 * currentRate;
      data.push(currentRate + fluctuation);
    }
    return { labels, data };
  }

  // Daily timeframes
  for (let i = days; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 3600 * 1000);
    labels.push(date.toLocaleDateString([], { month: 'short', day: 'numeric' }));
    
    // Simulate stock-like brownian motion with minor trend
    // A daily walk with a standard deviation of 0.015
    const step = (Math.random() - 0.48) * 0.012 * currentRate; // slightly biased upward/downward sometimes
    const simulatedVal = currentRate * (1 + (Math.sin(i / 10) * 0.02) + (step * (days - i) * 0.1));
    data.push(simulatedVal);
  }

  return { labels, data };
};

// Hardcoded sample news to prevent rate limit blocks on financial feed APIs
export const fetchFinanceNews = () => {
  return [
    {
      id: 1,
      title: 'Global Inflation Relaxes as Central Banks Signal Upcoming Rate Cuts',
      summary: 'Markets rally globally as indicators show inflation cool down. The Federal Reserve and European Central Bank hint at joint policy easing.',
      source: 'Fintech Daily',
      time: '2 hours ago',
      category: 'Macroeconomy',
      url: '#'
    },
    {
      id: 2,
      title: 'Cryptocurrency Surge: Bitcoin Crosses $68K Amid Spot ETF Inflows',
      summary: 'Institutional demand fuels massive cryptocurrency recovery. Solana and Ethereum show strong breakout indicators.',
      source: 'CryptoPulse',
      time: '4 hours ago',
      category: 'Crypto',
      url: '#'
    },
    {
      id: 3,
      title: 'Rupee Holds Steady Against US Dollar Amid Foreign Inflows in Bonds',
      summary: 'The Indian Rupee traded in a narrow range supported by persistent foreign institutional buying in local debt markets.',
      source: 'Forex Times',
      time: '6 hours ago',
      category: 'Forex',
      url: '#'
    },
    {
      id: 4,
      title: 'Oil Prices Drop Below $80 a Barrel on Rising Global Stockpiles',
      summary: 'Crude oil futures fell as commercial crude stockpiles surpassed expectations, reducing immediate inflation fears.',
      source: 'Commodity World',
      time: '1 day ago',
      category: 'Energy',
      url: '#'
    }
  ];
};
