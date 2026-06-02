import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Download, Edit2, Trash2, Ban, Eye, ChevronLeft, ChevronRight, CheckCircle, AlertTriangle } from 'lucide-react';
import { supabase } from '../../services/supabase';

const BASE_MOCK_USERS = [
  {
    id: 'admin',
    name: 'Aman Kumar Das',
    email: 'kumaraman.das2004@gmail.com',
    country: 'India',
    status: 'Active',
    plan: 'Pro',
    conversions: 0,
    joined: '2026-01-01',
  },
  {
    id: 1,
    name: 'Priya Mehta',
    email: 'priya@finverse.io',
    country: 'India',
    status: 'Active',
    plan: 'Free',
    conversions: 24,
    joined: '2026-05-15',
  },
  {
    id: 2,
    name: 'Rahul Sharma',
    email: 'rahul@finverse.io',
    country: 'India',
    status: 'Active',
    plan: 'Pro',
    conversions: 184,
    joined: '2026-04-20',
  },
  {
    id: 3,
    name: 'Emma Wilson',
    email: 'emma.w@global.com',
    country: 'USA',
    status: 'Active',
    plan: 'Pro',
    conversions: 89,
    joined: '2026-05-10',
  },
  {
    id: 4,
    name: 'Carlos Rivera',
    email: 'carlos@rivera.es',
    country: 'Spain',
    status: 'Inactive',
    plan: 'Free',
    conversions: 2,
    joined: '2026-03-12',
  },
  {
    id: 5,
    name: 'Yuki Tanaka',
    email: 'yuki@tanaka.co.jp',
    country: 'Japan',
    status: 'Blocked',
    plan: 'Free',
    conversions: 0,
    joined: '2026-02-18',
  }
];

const STATUS_COLOR = {
  Active: 'bg-emerald-500/10 text-emerald-605 dark:text-emerald-400 border-emerald-500/20',
  Inactive: 'bg-slate-500/10 text-slate-605 dark:text-slate-400 border-slate-500/20',
  Blocked: 'bg-rose-500/10 text-rose-605 dark:text-rose-400 border-rose-500/20',
  'Deletion Requested': 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 animate-pulse font-extrabold',
};

const PAGE_SIZE = 10;

export default function AdminUsers() {
  const [users, setUsers] = useState(BASE_MOCK_USERS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [viewingUser, setViewingUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [editPlan, setEditPlan] = useState('');

  const loadRealUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('conversion_history')
        .select('*');

      // Load deletion requests
      const deleteRequests = JSON.parse(localStorage.getItem('delete_requests') || '[]');

      // Count real conversions per user
      const userCounts = {};
      if (!error && data) {
        data.forEach(c => {
          const email = c.user_email || 'anonymous@finverse.io';
          userCounts[email] = (userCounts[email] || 0) + 1;
        });
      }

      // Build dynamic users list
      const dynamicUsers = Object.entries(userCounts).map(([email, count], idx) => {
        const exists = BASE_MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (exists) {
          return { ...exists, conversions: exists.conversions + count };
        }
        const localPart = email.split('@')[0];
        const name = localPart.charAt(0).toUpperCase() + localPart.slice(1).replace(/[._-]/g, ' ');
        return {
          id: `real-${idx}`,
          name,
          email,
          country: 'India',
          status: 'Active',
          plan: 'Free',
          conversions: count,
          joined: new Date().toISOString().split('T')[0],
        };
      });

      // Blend with static ones
      const merged = [...BASE_MOCK_USERS];
      dynamicUsers.forEach(du => {
        const index = merged.findIndex(u => u.email.toLowerCase() === du.email.toLowerCase());
        if (index !== -1) {
          merged[index].conversions = du.conversions;
        } else {
          merged.push(du);
        }
      });

      // Filter out deleted users
      const deletedUsers = JSON.parse(localStorage.getItem('deleted_users') || '[]');
      const activeUsers = merged.filter(u => !deletedUsers.includes(u.email));

      // Map deletion request and block flags
      const blockedUsers = JSON.parse(localStorage.getItem('blocked_users') || '[]');
      const userPlans = JSON.parse(localStorage.getItem('user_plans') || '{}');
      const finalUsers = activeUsers.map(u => ({
        ...u,
        status: deleteRequests.includes(u.email) ? 'Deletion Requested' : (blockedUsers.includes(u.email) ? 'Blocked' : u.status),
        plan: userPlans[u.email] || u.plan,
        deletionRequested: deleteRequests.includes(u.email)
      }));

      setUsers(finalUsers);
    } catch (e) {
      console.warn('Real users sync skipped:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRealUsers();
  }, []);

  const handleApproveDeletion = (email) => {
    // 1. Remove from local delete_requests array
    const deleteRequests = JSON.parse(localStorage.getItem('delete_requests') || '[]');
    const updatedRequests = deleteRequests.filter(e => e !== email);
    localStorage.setItem('delete_requests', JSON.stringify(updatedRequests));

    // 2. Add to deleted_users array so they are hidden forever
    const deletedUsers = JSON.parse(localStorage.getItem('deleted_users') || '[]');
    if (!deletedUsers.includes(email)) {
      deletedUsers.push(email);
      localStorage.setItem('deleted_users', JSON.stringify(deletedUsers));
    }

    // 3. Remove associated database/local parameters if current or specific user email
    if (email === 'priya@finverse.io' || email === 'rahul@finverse.io') {
      localStorage.removeItem('currency_history');
      localStorage.removeItem('currency_favorites');
      localStorage.removeItem('currency_alerts');
    }

    // Reload the users directory
    loadRealUsers();

    // Show custom confirmation
    alert(`Account Deletion Request Approved! ${email} has been permanently deleted from the system.`);
  };

  const handleBlockUser = (email, currentStatus) => {
    if (currentStatus === 'Blocked') {
      // Unblock
      const blocked = JSON.parse(localStorage.getItem('blocked_users') || '[]');
      localStorage.setItem('blocked_users', JSON.stringify(blocked.filter(e => e !== email)));
      alert(`User ${email} has been unblocked.`);
    } else {
      // Block
      const blocked = JSON.parse(localStorage.getItem('blocked_users') || '[]');
      if (!blocked.includes(email)) {
        blocked.push(email);
        localStorage.setItem('blocked_users', JSON.stringify(blocked));
      }
      alert(`User ${email} has been blocked.`);
    }
    loadRealUsers();
  };

  const handleSaveEdit = () => {
    if (editingUser) {
      const userPlans = JSON.parse(localStorage.getItem('user_plans') || '{}');
      userPlans[editingUser.email] = editPlan;
      localStorage.setItem('user_plans', JSON.stringify(userPlans));
      setEditingUser(null);
      loadRealUsers();
    }
  };

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.country.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || u.status === statusFilter ||
      (statusFilter === 'Active' && u.status === 'Active') ||
      (statusFilter === 'Inactive' && u.status === 'Inactive') ||
      (statusFilter === 'Blocked' && u.status === 'Blocked');
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const exportCSV = () => {
    const headers = 'ID,Name,Email,Country,Status,Plan,Conversions,Joined\n';
    const rows = filtered.map(u =>
      `${u.id},"${u.name}",${u.email},${u.country},${u.status},${u.plan},${u.conversions},${u.joined}`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'finverse_users.csv'; a.click();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-805 dark:text-white transition-colors duration-300">User Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">{filtered.length} total users found · Syncing deletion requests</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={exportCSV} className="flex items-center gap-2 px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs font-bold text-emerald-605 dark:text-emerald-400 hover:bg-emerald-500/20 transition-all">
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, country..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full bg-white dark:bg-white/5 border border-slate-200/50 dark:border-white/5 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-805 dark:text-slate-300 placeholder-slate-405 dark:placeholder-slate-600 outline-none focus:border-purple-500/50 transition-all"
          />
        </div>
        <div className="flex gap-2">
          {['All', 'Active', 'Inactive', 'Blocked', 'Deletion Requested'].map(s => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`px-3 py-2 rounded-xl text-[11px] font-bold transition-all border ${
                statusFilter === s
                  ? 'bg-purple-100 border-purple-200 text-purple-750 dark:bg-purple-500/20 dark:border-purple-500/30 dark:text-purple-300'
                  : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#0d0f1e] border border-slate-100 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm transition-colors duration-300">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-transparent">
                {['User', 'Country', 'Status', 'Plan', 'Conversions', 'Joined', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/[0.03]">
              {paged.map((user, i) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-all"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600/60 to-blue-600/60 flex items-center justify-center text-white font-black text-[10px] shrink-0">
                        {user.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'US'}
                      </div>
                      <div>
                        <div className="text-[11px] font-bold text-slate-800 dark:text-white">{user.name}</div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[11px] text-slate-600 dark:text-slate-400">{user.country}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_COLOR[user.status]}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${user.plan === 'Pro' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' : 'bg-slate-500/10 text-slate-500 dark:text-slate-400 border border-slate-500/20'}`}>
                      {user.plan}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[11px] text-slate-700 dark:text-slate-300 font-bold">{user.conversions.toLocaleString()}</td>
                  <td className="px-4 py-3 text-[11px] text-slate-400 dark:text-slate-500">{user.joined}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {user.deletionRequested ? (
                        <button
                          onClick={() => handleApproveDeletion(user.email)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 font-black text-[9px] hover:bg-rose-500 hover:text-white hover:scale-103 transition-all animate-pulse"
                          title="Confirm Account Deletion"
                        >
                          <AlertTriangle className="w-3 h-3" /> Approve Delete
                        </button>
                      ) : (
                        <>
                          <button onClick={() => setViewingUser(user)} className="p-1.5 rounded-lg hover:bg-blue-500/10 text-slate-450 hover:text-blue-600 dark:text-slate-500 dark:hover:text-blue-400 transition-all" title="View">
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => { setEditingUser(user); setEditPlan(user.plan); }} className="p-1.5 rounded-lg hover:bg-purple-500/10 text-slate-455 hover:text-purple-650 dark:text-slate-500 dark:hover:text-purple-400 transition-all" title="Edit">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleBlockUser(user.email, user.status)} className="p-1.5 rounded-lg hover:bg-amber-500/10 text-slate-455 hover:text-amber-600 dark:text-slate-500 dark:hover:text-amber-400 transition-all" title="Toggle Block">
                            <Ban className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => { if(window.confirm(`Are you sure you want to permanently delete ${user.email}?`)) handleApproveDeletion(user.email); }} className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-455 hover:text-rose-600 dark:text-slate-500 dark:hover:text-rose-400 transition-all" title="Delete">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 dark:border-white/5">
          <p className="text-[10px] text-slate-400 dark:text-slate-500">
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200/50 dark:border-none text-slate-500 hover:text-slate-800 dark:hover:text-white disabled:opacity-30 transition-all"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">{page} / {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200/50 dark:border-none text-slate-500 hover:text-slate-800 dark:hover:text-white disabled:opacity-30 transition-all"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* View User Modal */}
      {viewingUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0d0f1e] w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center text-white font-black text-xl shadow-lg">
                    {viewingUser.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-800 dark:text-white">{viewingUser.name}</h3>
                    <p className="text-xs text-slate-500">{viewingUser.email}</p>
                  </div>
                </div>
                <button onClick={() => setViewingUser(null)} className="text-slate-400 hover:text-slate-600 transition-all">✕</button>
              </div>
              <div className="space-y-4 text-sm font-semibold">
                <div className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-2">
                  <span className="text-slate-500">Country</span>
                  <span className="text-slate-800 dark:text-white">{viewingUser.country}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-2">
                  <span className="text-slate-500">Status</span>
                  <span className={`px-2 py-0.5 rounded-full border text-[10px] ${STATUS_COLOR[viewingUser.status]}`}>{viewingUser.status}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-2">
                  <span className="text-slate-500">Current Plan</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${viewingUser.plan === 'Pro' ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' : 'bg-slate-500/10 text-slate-500 border border-slate-500/20'}`}>{viewingUser.plan}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-2">
                  <span className="text-slate-500">Total API Conversions</span>
                  <span className="text-slate-800 dark:text-white">{viewingUser.conversions.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pb-2">
                  <span className="text-slate-500">Join Date</span>
                  <span className="text-slate-800 dark:text-white">{viewingUser.joined}</span>
                </div>
              </div>
              <button onClick={() => setViewingUser(null)} className="w-full mt-6 py-2.5 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white rounded-xl text-xs font-bold transition-all">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Plan Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0d0f1e] w-full max-w-sm rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-black text-slate-800 dark:text-white">Edit Subscription</h3>
                  <p className="text-xs text-slate-500">Upgrade or downgrade {editingUser.name}</p>
                </div>
                <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-slate-600 transition-all">✕</button>
              </div>
              
              <div className="space-y-4 my-6">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Access Plan</label>
                  <select
                    value={editPlan}
                    onChange={(e) => setEditPlan(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 dark:text-white outline-none focus:border-purple-500/50 transition-all"
                  >
                    <option value="Free">Free Tier</option>
                    <option value="Pro">Pro Premium</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setEditingUser(null)} className="flex-1 py-2.5 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all">
                  Cancel
                </button>
                <button onClick={handleSaveEdit} className="flex-1 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-lg hover:shadow-purple-500/20 text-white rounded-xl text-xs font-bold transition-all">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
