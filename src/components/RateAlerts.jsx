import React, { useState, useEffect } from 'react';
import { Bell, BellRing, Plus, Trash2, ShieldCheck, AlertCircle } from 'lucide-react';
import { CURRENCY_NAMES } from '../services/rateApi';
import { motion, AnimatePresence } from 'framer-motion';

export default function RateAlerts({ rates }) {
  const [alerts, setAlerts] = useState([]);
  const [baseAlert, setBaseAlert] = useState('USD');
  const [targetAlert, setTargetAlert] = useState('INR');
  const [condition, setCondition] = useState('>');
  const [triggerValue, setTriggerValue] = useState(84.0);
  const [notifPermission, setNotifPermission] = useState('default');

  useEffect(() => {
    // Load alerts from storage
    const saved = JSON.parse(localStorage.getItem('currency_alerts') || '[]');
    setAlerts(saved);

    // Read initial notifications permission
    if ('Notification' in window) {
      setNotifPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotifPermission(permission);
    }
  };

  const handleAddAlert = () => {
    const newAlert = {
      id: Date.now(),
      base: baseAlert,
      target: targetAlert,
      condition,
      value: parseFloat(triggerValue),
      active: true,
      createdAt: new Date().toLocaleDateString()
    };

    const updated = [...alerts, newAlert];
    setAlerts(updated);
    localStorage.setItem('currency_alerts', JSON.stringify(updated));

    // Request permissions proactively
    if (notifPermission !== 'granted') {
      requestPermission();
    }
  };

  const handleDeleteAlert = (id) => {
    const updated = alerts.filter(a => a.id !== id);
    setAlerts(updated);
    localStorage.setItem('currency_alerts', JSON.stringify(updated));
  };

  // Real-time polling rate checker
  useEffect(() => {
    if (alerts.length === 0 || !rates) return;

    alerts.forEach(alert => {
      if (!alert.active) return;

      const baseRate = rates[alert.base];
      const targetRate = rates[alert.target];
      if (!baseRate || !targetRate) return;

      const currentRatio = targetRate / baseRate;
      let triggered = false;

      if (alert.condition === '>' && currentRatio > alert.value) {
        triggered = true;
      } else if (alert.condition === '<' && currentRatio < alert.value) {
        triggered = true;
      }

      if (triggered) {
        // Trigger browser notification
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('📈 Currency Rate Alert Triggered!', {
            body: `1 ${alert.base} has crossed ${alert.condition} ${alert.value} ${alert.target}! Current: ${currentRatio.toFixed(3)}`,
            icon: 'https://cdn-icons-png.flaticon.com/512/179/179386.png'
          });
        }
        
        // Mark alert as inactive to prevent continuous spamming
        const updated = alerts.map(a => a.id === alert.id ? { ...a, active: false } : a);
        setAlerts(updated);
        localStorage.setItem('currency_alerts', JSON.stringify(updated));
      }
    });
  }, [rates, alerts]);

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden transition-all duration-300">
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-emerald-500 animate-swing" />
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Rate Alerts</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Set desktop notification alerts for currency triggers</p>
          </div>
        </div>

        {/* Permissions shield indicator */}
        {notifPermission === 'granted' ? (
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center gap-1 bg-emerald-500/10 px-2.5 py-1.5 rounded-xl border border-emerald-500/10">
            <ShieldCheck className="w-3.5 h-3.5" /> Notifications Active
          </span>
        ) : (
          <button
            onClick={requestPermission}
            className="text-[10px] text-slate-500 dark:text-slate-400 font-extrabold flex items-center gap-1 bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-850 px-2.5 py-1.5 rounded-xl hover:bg-slate-200"
          >
            <BellRing className="w-3.5 h-3.5" /> Enable Notifications
          </button>
        )}
      </div>

      {/* Creation form */}
      <div className="p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-950/20 border border-slate-200/30 dark:border-slate-800/30 grid grid-cols-2 sm:grid-cols-5 gap-3 items-end mb-6">
        <div>
          <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-1 uppercase tracking-wider">Base</label>
          <select
            value={baseAlert}
            onChange={(e) => setBaseAlert(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-850 dark:text-white outline-none"
          >
            {Object.keys(CURRENCY_NAMES).map(code => (
              <option key={code} value={code}>{code}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-1 uppercase tracking-wider">Condition</label>
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-855 dark:text-white outline-none"
          >
            <option value=">">Exceeds (&gt;)</option>
            <option value="<">Falls below (&lt;)</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-1 uppercase tracking-wider">Value</label>
          <input
            type="number"
            step="0.001"
            value={triggerValue}
            onChange={(e) => setTriggerValue(parseFloat(e.target.value) || 0)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-850 dark:text-white outline-none"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-1 uppercase tracking-wider">Target</label>
          <select
            value={targetAlert}
            onChange={(e) => setTargetAlert(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-850 dark:text-white outline-none"
          >
            {Object.keys(CURRENCY_NAMES).map(code => (
              <option key={code} value={code}>{code}</option>
            ))}
          </select>
        </div>

        <div className="col-span-2 sm:col-span-1">
          <button
            onClick={handleAddAlert}
            className="w-full py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold text-xs shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-1"
          >
            <Plus className="w-4 h-4" /> Create Alert
          </button>
        </div>
      </div>

      {/* Active Alerts List */}
      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
        <AnimatePresence>
          {alerts.map(alert => (
            <motion.div
              layout
              key={alert.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-3.5 rounded-2xl bg-white/20 dark:bg-slate-800/20 border border-slate-250/20 dark:border-slate-800/40 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${alert.active ? 'bg-emerald-500/10 text-emerald-500 glowing-emerald' : 'bg-slate-100 dark:bg-slate-900 text-slate-400'}`}>
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-xs text-slate-800 dark:text-white">
                      1 {alert.base} {alert.condition} {alert.value} {alert.target}
                    </span>
                    <span className={`inline-flex px-1.5 py-0.5 rounded text-[8px] font-bold ${alert.active ? 'bg-emerald-500/15 text-emerald-500' : 'bg-slate-150 text-slate-400'}`}>
                      {alert.active ? 'ACTIVE' : 'TRIGGERED'}
                    </span>
                  </div>
                  <span className="text-[9px] text-slate-450 dark:text-slate-500 font-semibold block mt-0.5">Created: {alert.createdAt}</span>
                </div>
              </div>

              <button
                onClick={() => handleDeleteAlert(alert.id)}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                title="Delete Alert"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {alerts.length === 0 && (
          <div className="text-center py-6 flex flex-col items-center">
            <AlertCircle className="w-8 h-8 text-slate-350 dark:text-slate-700 mb-1" />
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-450">No price alerts set</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Alerts trigger a browser notification upon threshold breach.</p>
          </div>
        )}
      </div>
    </div>
  );
}
