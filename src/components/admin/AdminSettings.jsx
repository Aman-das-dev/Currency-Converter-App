import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Key, Eye, EyeOff, Copy, Check, Save, User, Mail, Shield, AlertTriangle } from 'lucide-react';
import { supabase } from '../../services/supabase';

const API_KEYS = [
  { id: 'exchange', label: 'Exchange Rate API', provider: 'exchangerate-api.com', key: '••••••••••••••••', status: 'Active', usage: '4,821 / 10,000 req/day' },
  { id: 'gemini', label: 'Gemini AI API', provider: 'Google Generative AI', key: '••••••••••••••••', status: 'Active', usage: '1,240 / 5,000 req/day' },
  { id: 'crypto', label: 'Crypto Price API', provider: 'CoinGecko', key: '••••••••••••••••', status: 'Active', usage: '892 / 2,000 req/day' },
];

export default function AdminSettings() {
  const [showKeys, setShowKeys] = useState({});
  const [copied, setCopied] = useState({});
  const [adminName, setAdminName] = useState('Aman Kumar Das');
  const [saved, setSaved] = useState(false);

  // Password change states
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState(null);
  const [passwordErrorMsg, setPasswordErrorMsg] = useState('');

  const toggleKey = (id) => setShowKeys(prev => ({ ...prev, [id]: !prev[id] }));

  const copyKey = (id, key) => {
    navigator.clipboard.writeText(key).catch(() => {});
    setCopied(prev => ({ ...prev, [id]: true }));
    setTimeout(() => setCopied(prev => ({ ...prev, [id]: false })), 2000);
  };

  const handleSave = () => {
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

  const maskKey = (key) => key.slice(0, 6) + '••••••••••••••••' + key.slice(-4);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-black text-slate-805 dark:text-white transition-colors duration-300">Settings</h1>
        <p className="text-xs text-slate-500 mt-0.5">Admin profile and platform configuration</p>
      </div>

      {/* Admin Profile */}
      <div className="bg-white dark:bg-[#0d0f1e] border border-slate-100 dark:border-white/5 rounded-2xl p-6 shadow-sm transition-colors duration-300">
        <h2 className="text-sm font-black text-slate-800 dark:text-white mb-5 flex items-center gap-2">
          <User className="w-4 h-4 text-purple-600 dark:text-purple-400" /> Admin Profile
        </h2>
        <div className="flex items-start gap-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center text-white font-black text-xl shadow-lg shrink-0">
            AD
          </div>
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">Display Name</label>
                <input
                  value={adminName}
                  onChange={e => setAdminName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 outline-none focus:border-purple-500/50 transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">Admin Email (Read-only)</label>
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 rounded-xl px-3 py-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400 dark:text-slate-650 shrink-0" />
                  <span className="text-xs text-slate-550 dark:text-slate-400">kumaraman.das2004@gmail.com</span>
                  <Shield className="w-3 h-3 text-emerald-600 dark:text-emerald-500 ml-auto shrink-0" title="Verified" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">Role</label>
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 rounded-xl px-3 py-2">
                  <span className="text-xs font-bold text-purple-650 dark:text-purple-400">Super Administrator</span>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">Account Status</label>
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 rounded-xl px-3 py-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Active & Verified</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleSave}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                saved
                  ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                  : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30'
              }`}
            >
              {saved ? <><Check className="w-3.5 h-3.5" /> Saved!</> : <><Save className="w-3.5 h-3.5" /> Save Changes</>}
            </button>
          </div>
        </div>
      </div>

      {/* API Key Management */}
      <div className="bg-white dark:bg-[#0d0f1e] border border-slate-100 dark:border-white/5 rounded-2xl p-6 shadow-sm transition-colors duration-300">
        <h2 className="text-sm font-black text-slate-800 dark:text-white mb-5 flex items-center gap-2">
          <Key className="w-4 h-4 text-amber-605 dark:text-amber-400" /> API Key Management
        </h2>
        <div className="space-y-4">
          {API_KEYS.map((api, i) => (
            <motion.div
              key={api.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-4 bg-slate-50 dark:bg-white/[0.02] border border-slate-200/50 dark:border-white/5 rounded-2xl"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-xs font-black text-slate-800 dark:text-white">{api.label}</div>
                  <div className="text-[10px] text-slate-455 dark:text-slate-500 mt-0.5">{api.provider}</div>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  {api.status}
                </span>
              </div>

              {/* Key Display */}
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-black/30 border border-slate-200/50 dark:border-white/5 rounded-xl px-3 py-2 mb-3">
                <Key className="w-3 h-3 text-slate-450 dark:text-slate-600 shrink-0" />
                <code className="text-[11px] text-slate-700 dark:text-slate-400 flex-1 font-mono truncate">
                  {showKeys[api.id] ? api.key : maskKey(api.key)}
                </code>
                <button onClick={() => toggleKey(api.id)} className="text-slate-500 hover:text-slate-800 dark:hover:text-white transition-all shrink-0">
                  {showKeys[api.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
                <button onClick={() => copyKey(api.id, api.key)} className="text-slate-500 hover:text-slate-800 dark:hover:text-white transition-all shrink-0">
                  {copied[api.id] ? <Check className="w-3.5 h-3.5 text-emerald-650 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Usage */}
              <div>
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-slate-455 dark:text-slate-500 font-semibold">Usage</span>
                  <span className="text-slate-600 dark:text-slate-400 font-bold">{api.usage}</span>
                </div>
                <div className="h-1 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                    style={{ width: api.id === 'exchange' ? '48%' : api.id === 'gemini' ? '25%' : '45%' }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white dark:bg-[#0d0f1e] border border-rose-500/10 dark:border-rose-500/20 rounded-2xl p-6 shadow-sm transition-colors duration-300">
        <h2 className="text-sm font-black text-rose-600 dark:text-rose-400 mb-4">Danger Zone</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="flex-1 py-2.5 bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 dark:hover:bg-rose-500/20 transition-all">
            Clear All Conversion History
          </button>
          <button className="flex-1 py-2.5 bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 dark:hover:bg-rose-500/20 transition-all">
            Reset All Rate Alerts
          </button>
          <button className="flex-1 py-2.5 bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 dark:hover:bg-rose-500/20 transition-all">
            Flush Session Cache
          </button>
        </div>
      </div>

      {/* Admin Password Management */}
      <div className="bg-white dark:bg-[#0d0f1e] border border-slate-100 dark:border-white/5 rounded-2xl p-6 shadow-sm transition-colors duration-300">
        <h2 className="text-sm font-black text-slate-800 dark:text-white mb-5 flex items-center gap-2">
          <Key className="w-4 h-4 text-purple-600 dark:text-purple-400" /> Admin Password Change
        </h2>
        
        <form onSubmit={handleChangePassword} className="space-y-4 max-w-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 outline-none focus:border-purple-500/50 transition-all"
                placeholder="Enter new admin password"
                minLength={6}
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 outline-none focus:border-purple-500/50 transition-all"
                placeholder="Confirm new admin password"
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
              Admin password updated successfully!
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={passwordStatus === 'loading'}
              className="px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-white/10 text-white font-bold text-xs shadow-md hover:bg-black dark:hover:bg-white/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              {passwordStatus === 'loading' ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Shield className="w-3.5 h-3.5" />
                  <span>Update Admin Password</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
