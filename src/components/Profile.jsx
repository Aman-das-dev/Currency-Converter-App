import React, { useState, useEffect } from 'react';
import { User, Shield, CreditCard, Award, Database, Check, AlertTriangle, Key, Trash2, ShieldAlert, Clock, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { MOCK_RATES } from '../services/rateApi';
import { supabase } from '../services/supabase';

export default function Profile({ rates = {}, baseCurrency, setBaseCurrency, userEmail }) {
  const activeEmail = userEmail || 'priya@finverse.io';

  // Sync profile details with local storage
  const [name, setName] = useState(() => localStorage.getItem('xchange_profile_name') || 'Aman Das');
  const [role, setRole] = useState(() => localStorage.getItem('xchange_profile_role') || 'Principal Wealth Lead');
  const [investGoal, setInvestGoal] = useState(() => localStorage.getItem('xchange_profile_goal') || 'Global Asset Allocation & Crypto Hedging');
  const [currencyPref, setCurrencyPref] = useState(baseCurrency);
  
  // Password change states
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState(null);
  const [passwordErrorMsg, setPasswordErrorMsg] = useState('');
  
  const [saved, setSaved] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Deletion request state
  const [deleteRequested, setDeleteRequested] = useState(() => {
    const requests = JSON.parse(localStorage.getItem('delete_requests') || '[]');
    return requests.includes(activeEmail);
  });

  // Dynamic storage stats
  const [storageStats, setStorageStats] = useState({
    conversionsCount: 0,
    conversionsBytes: 0,
    favoritesCount: 0,
    favoritesBytes: 0,
    alertsCount: 0,
    alertsBytes: 0,
    totalBytes: 0,
  });

  const loadStorageTelemetry = () => {
    try {
      const historyStr = localStorage.getItem('currency_history') || '[]';
      const favsStr = localStorage.getItem('currency_favorites') || '[]';
      const alertsStr = localStorage.getItem('currency_alerts') || '[]';

      const hCount = JSON.parse(historyStr).length;
      const fCount = JSON.parse(favsStr).length;
      const aCount = JSON.parse(alertsStr).length;

      const hBytes = new Blob([historyStr]).size;
      const fBytes = new Blob([favsStr]).size;
      const aBytes = new Blob([alertsStr]).size;
      setStorageStats({
        conversionsCount: hCount,
        conversionsBytes: hBytes,
        favoritesCount: fCount,
        favoritesBytes: fBytes,
        alertsCount: aCount,
        alertsBytes: aBytes,
        totalBytes: hBytes + fBytes + aBytes
      });
    } catch (e) {
      console.warn('Local storage audit skipped:', e);
    }
  };

  useEffect(() => {
    loadStorageTelemetry();
  }, []);

  // Asset values in USD monthly base
  const USD_NET_ASSETS = 1248500;
  const USD_MONTHLY_VOL = 84200;

  const currentRate = rates[currencyPref] || MOCK_RATES[currencyPref] || 1;
  const convertedAssets = USD_NET_ASSETS * currentRate;
  const convertedVol = USD_MONTHLY_VOL * currentRate;

  const handleSaveProfile = (e) => {
    e.preventDefault();
    localStorage.setItem('xchange_profile_name', name);
    localStorage.setItem('xchange_profile_role', role);
    localStorage.setItem('xchange_profile_goal', investGoal);
    setBaseCurrency(currencyPref); // update app context
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordStatus('error');
      setPasswordErrorMsg("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordStatus('error');
      setPasswordErrorMsg("Password must be at least 6 characters");
      return;
    }

    setPasswordStatus('loading');
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;
      
      setPasswordStatus('success');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordStatus(null), 3000);
    } catch (err) {
      setPasswordStatus('error');
      setPasswordErrorMsg(err.message || "Failed to update password");
    }
  };

  const handleClearDatabase = () => {
    localStorage.removeItem('currency_history');
    localStorage.removeItem('currency_favorites');
    localStorage.removeItem('currency_alerts');
    loadStorageTelemetry();
    setConfirmClear(false);
  };

  const handleRequestDelete = () => {
    const requests = JSON.parse(localStorage.getItem('delete_requests') || '[]');
    if (!requests.includes(activeEmail)) {
      requests.push(activeEmail);
      localStorage.setItem('delete_requests', JSON.stringify(requests));
    }
    setDeleteRequested(true);
    setConfirmDelete(false);
  };

  const handleCancelDeleteRequest = () => {
    const requests = JSON.parse(localStorage.getItem('delete_requests') || '[]');
    const updated = requests.filter(email => email !== activeEmail);
    localStorage.setItem('delete_requests', JSON.stringify(updated));
    setDeleteRequested(false);
  };

  const availableCurrencies = Object.keys(MOCK_RATES);

  return (
    <div className="space-y-6">
      
      {/* 1. TOP DYNAMIC METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Net Assets */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          whileHover={{ y: -4 }}
          className="glass-panel p-5 rounded-3xl relative overflow-hidden shadow-sm"
        >
          <div className="absolute -top-8 -right-8 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 block mb-1">
            Converted Net Assets
          </span>
          <h3 className="text-xl font-extrabold text-slate-855 dark:text-white mt-1">
            {convertedAssets.toLocaleString([], { maximumFractionDigits: 0 })} <span className="text-emerald-500">{currencyPref}</span>
          </h3>
          <p className="text-[10px] text-slate-450 dark:text-slate-500 mt-1 font-semibold">
            Base Valuation: $1,248,500 USD
          </p>
        </motion.div>

        {/* Card 2: Conversion Vol */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          whileHover={{ y: -4 }}
          className="glass-panel p-5 rounded-3xl relative overflow-hidden shadow-sm"
        >
          <div className="absolute -top-8 -right-8 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 block mb-1">
            Monthly Conversion Vol
          </span>
          <h3 className="text-xl font-extrabold text-slate-855 dark:text-white mt-1">
            {convertedVol.toLocaleString([], { maximumFractionDigits: 0 })} <span className="text-cyan-500">{currencyPref}</span>
          </h3>
          <p className="text-[10px] text-slate-450 dark:text-slate-500 mt-1 font-semibold">
            Avg volume frequency active
          </p>
        </motion.div>

        {/* Card 3: Security Rank */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          whileHover={{ y: -4 }}
          className="glass-panel p-5 rounded-3xl relative overflow-hidden shadow-sm"
        >
          <div className="absolute -top-8 -right-8 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 block mb-1">
            Account Security Level
          </span>
          <h3 className="text-xl font-extrabold text-indigo-500 dark:text-indigo-400 mt-1 flex items-center gap-1.5">
            <Shield className="w-5 h-5" /> 99.98% A+
          </h3>
          <p className="text-[10px] text-slate-450 dark:text-slate-500 mt-1 font-semibold">
            256-bit Local Sandbox Secure
          </p>
        </motion.div>

        {/* Card 4: Trust Badges */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          whileHover={{ y: -4 }}
          className="glass-panel p-5 rounded-3xl relative overflow-hidden shadow-sm"
        >
          <div className="absolute -top-8 -right-8 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 block mb-1">
            Premium Wealth Tier
          </span>
          <h3 className="text-xl font-extrabold text-amber-500 mt-1 flex items-center gap-1.5">
            <Award className="w-5 h-5 animate-bounce" /> Platinum VIP
          </h3>
          <p className="text-[10px] text-slate-450 dark:text-slate-500 mt-1 font-semibold">
            AI telemetry & voice unlocked
          </p>
        </motion.div>

      </div>

      {/* 2. PROFILE EDIT & DATABASE CONFIGS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Edit profile form */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl lg:col-span-2 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center gap-2 mb-6">
            <User className="w-5 h-5 text-emerald-500" />
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Profile Customization</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Configure dashboard base parameters and personal tags</p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full glass-input text-xs font-bold text-slate-855 dark:text-white"
                  placeholder="e.g. Aman Das"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase mb-1.5">Designation</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full glass-input text-xs font-bold text-slate-855 dark:text-white"
                  placeholder="e.g. Principal Wealth Lead"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase mb-1.5">Primary Investment Goal</label>
              <textarea
                value={investGoal}
                onChange={(e) => setInvestGoal(e.target.value)}
                className="w-full glass-input text-xs font-bold text-slate-855 dark:text-white min-h-[60px] resize-none"
                placeholder="Describe your financial goals..."
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase mb-1.5">Default Engine Currency Preference</label>
              <select
                value={currencyPref}
                onChange={(e) => setCurrencyPref(e.target.value)}
                className="w-full glass-input text-xs font-bold text-slate-850 dark:text-white py-3 cursor-pointer"
              >
                {availableCurrencies.map(code => (
                  <option key={code} value={code}>{code}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-extrabold text-xs shadow-md hover:scale-[1.02] transition-all flex items-center gap-1.5 cursor-pointer"
              >
                {saved ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Preference Updated</span>
                  </>
                ) : (
                  <span>Save Profile</span>
                )}
              </button>
            </div>

          </form>

          {/* Change Password Section */}
          <div className="mt-10 border-t border-slate-200/60 dark:border-white/10 pt-8">
            <div className="flex items-center gap-2 mb-6">
              <Key className="w-5 h-5 text-purple-500" />
              <div>
                <h2 className="text-lg font-bold text-slate-800 dark:text-white">Change Password</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Update your account authentication credentials</p>
              </div>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase mb-1.5">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full glass-input text-xs font-bold text-slate-855 dark:text-white"
                    placeholder="Enter new password"
                    minLength={6}
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase mb-1.5">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full glass-input text-xs font-bold text-slate-855 dark:text-white"
                    placeholder="Confirm new password"
                    minLength={6}
                    required
                  />
                </div>
              </div>

              {passwordStatus === 'error' && (
                <div className="text-[10px] font-bold text-rose-500 bg-rose-500/10 p-2 rounded-lg border border-rose-500/20 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {passwordErrorMsg}
                </div>
              )}

              {passwordStatus === 'success' && (
                <div className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  Password updated successfully!
                </div>
              )}

              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  disabled={passwordStatus === 'loading'}
                  className="px-6 py-2.5 rounded-xl bg-slate-800 dark:bg-white/10 text-white font-extrabold text-xs shadow-md hover:bg-slate-900 dark:hover:bg-white/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {passwordStatus === 'loading' ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Shield className="w-4 h-4" />
                      <span>Update Password</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Local database & profile console */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl flex flex-col justify-between gap-6 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center gap-2 mb-4">
              <Database className="w-5 h-5 text-rose-500 animate-pulse" />
              <div>
                <h2 className="text-base font-bold text-slate-800 dark:text-white">Storage Console</h2>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Purge offline database stores and local session parameters</p>
              </div>
            </div>

            {/* Storage Usage Audit Breakdown */}
            <div className="bg-slate-50 dark:bg-slate-950/40 p-4 rounded-2xl border border-slate-200/50 dark:border-white/5 space-y-2.5 mt-4">
              <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Storage Allocation Summary</span>
              
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-bold">
                  <span className="text-slate-500">Conversions Logged:</span>
                  <span className="text-slate-700 dark:text-slate-300">{storageStats.conversionsCount} ({(storageStats.conversionsBytes / 1024).toFixed(2)} KB)</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold">
                  <span className="text-slate-500">Favorite Pairs Saved:</span>
                  <span className="text-slate-700 dark:text-slate-300">{storageStats.favoritesCount} ({(storageStats.favoritesBytes / 1024).toFixed(2)} KB)</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold">
                  <span className="text-slate-500">Active Rate Alerts:</span>
                  <span className="text-slate-700 dark:text-slate-300">{storageStats.alertsCount} ({(storageStats.alertsBytes / 1024).toFixed(2)} KB)</span>
                </div>
              </div>

              <div className="border-t border-slate-200/50 dark:border-white/5 pt-2 flex justify-between items-center text-[10px] font-black">
                <span className="text-slate-650 dark:text-slate-400">Total Sandbox Footprint:</span>
                <span className="text-purple-650 dark:text-purple-400">{(storageStats.totalBytes / 1024).toFixed(2)} KB</span>
              </div>
            </div>

            {/* Deletion Request Status Card */}
            {deleteRequested ? (
              <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 text-xs text-amber-600 space-y-2 mt-4 font-semibold">
                <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400">
                  <Clock className="w-4 h-4 animate-spin" />
                  <span className="font-extrabold">Deletion Requested Pending</span>
                </div>
                <p className="text-[10px] leading-relaxed text-amber-700/80 dark:text-amber-400/80">
                  A request has been sent to the Admin Panel to safely purge your profile parameter and asset stores. The System Admin will assess and confirm deletion shortly.
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-rose-500/15 bg-rose-500/5 text-xs text-rose-500 space-y-2 mt-4 font-semibold">
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="font-extrabold">Data Clean Warnings</span>
                </div>
                <p className="text-[10px] leading-relaxed text-rose-600/80 dark:text-rose-400/80">
                  Purging parameters will delete all favorite currency pairs, converted history logs, and offline settings database tables.
                </p>
              </div>
            )}
          </div>

          <div className="pt-4 space-y-2.5">
            {/* Clear Database Trigger */}
            {confirmClear ? (
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold text-rose-500 text-center uppercase block mb-1">⚠️ Are you absolutely sure?</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleClearDatabase}
                    className="py-2.5 rounded-xl bg-rose-500 text-white font-extrabold text-xs shadow-md transition-all hover:bg-rose-600 cursor-pointer"
                  >
                    Yes, Purge
                  </button>
                  <button
                    onClick={() => setConfirmClear(false)}
                    className="py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-355 font-extrabold text-xs transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setConfirmClear(true)}
                disabled={storageStats.totalBytes === 0}
                className="w-full py-3 rounded-xl bg-slate-100 hover:bg-rose-500/10 hover:text-rose-650 border border-slate-200 dark:border-slate-800 dark:bg-slate-900/40 text-slate-500 font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>Clear Local Database</span>
              </button>
            )}

            {/* Deletion Request Toggle Button */}
            {deleteRequested ? (
              <button
                onClick={handleCancelDeleteRequest}
                className="w-full py-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-[10px] font-black text-slate-750 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Cancel Deletion Request</span>
              </button>
            ) : confirmDelete ? (
              <div className="flex flex-col gap-2 border border-rose-500/20 bg-rose-500/5 p-3 rounded-2xl">
                <span className="text-[9px] font-black text-rose-600 dark:text-rose-400 text-center uppercase block">⚠️ SUBMIT ACCT DELETION REQUEST TO ADMIN?</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleRequestDelete}
                    className="py-2 rounded-lg bg-red-600 text-white font-extrabold text-[10px] transition-all hover:bg-red-700 cursor-pointer"
                  >
                    Request Deletion
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="py-2 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-350 font-extrabold text-[10px] transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                className="w-full py-3 rounded-xl bg-rose-500/10 text-rose-605 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Request Account Deletion</span>
              </button>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
