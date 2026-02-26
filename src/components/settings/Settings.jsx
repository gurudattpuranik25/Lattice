import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogOut, Trash2, Moon, Mail, Calendar, Hash, Star, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getUserSettings, updateUserSettings, getDistillStats, deleteAllUserData } from '../../services/firestoreService';
import { usePageTitle } from '../../hooks/usePageTitle';
import ConfirmDialog from '../shared/ConfirmDialog';
import { FORMAT_NAMES } from '../../services/prompts';

export default function Settings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  usePageTitle('Settings');
  const [settings, setSettings] = useState({ defaultFormat: 'keyTakeaways' });
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);

  useEffect(() => {
    if (user) {
      getUserSettings(user.uid).then(s => {
        setSettings(s);
        setLoading(false);
      });
      getDistillStats(user.uid).then(setStats);
    }
  }, [user]);

  const handleFormatChange = async (format) => {
    const updated = { ...settings, defaultFormat: format };
    setSettings(updated);
    try {
      await updateUserSettings(user.uid, updated);
      toast.success('Settings saved');
    } catch {
      toast.error('Failed to save settings');
    }
  };

  const handleDeleteAll = async () => {
    try {
      await deleteAllUserData(user.uid);
      setStats({ total: 0, thisWeek: 0, mostUsedFormat: 'None', totalPages: 0 });
      toast.success('All data deleted successfully');
    } catch {
      toast.error('Failed to delete data');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const memberSince = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl"
    >
      <h1 className="font-heading font-bold text-2xl sm:text-3xl text-white mb-6 sm:mb-8 flex items-center gap-3">
        <span className="w-1.5 h-7 rounded-full bg-gradient-to-b from-indigo-400 to-zinc-500" />
        Settings
      </h1>

      {/* Profile Card */}
      <section className="glass-card mb-6 overflow-hidden">
        {/* Banner with avatar + info inside */}
        <div className="relative overflow-hidden px-4 sm:px-6 pt-4 sm:pt-6 pb-6 sm:pb-8">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-violet-500/15 to-purple-500/10" />
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(129,140,248,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(167,139,250,0.1) 0%, transparent 50%)',
          }} />
          {/* Decorative dots */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
            <pattern id="profile-dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="white" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#profile-dots)" />
          </svg>

          <div className="relative flex items-center gap-3 sm:gap-4">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt=""
                className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl border-2 border-white/10 shadow-lg"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl border-2 border-white/10 bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-xl sm:text-2xl text-white font-bold shadow-lg">
                {user?.displayName?.[0]}
              </div>
            )}
            <div>
              <h2 className="font-heading font-bold text-lg sm:text-xl text-white">{user?.displayName}</h2>
              <div className="flex items-center gap-1.5 text-sm text-zinc-300/70 mt-0.5">
                <Mail size={13} />
                {user?.email}
              </div>
            </div>
          </div>
        </div>

        {/* Account stats */}
        <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-3 sm:pt-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
            {memberSince && (
              <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3 text-center">
                <Calendar size={15} className="text-indigo-400 mx-auto mb-1.5" />
                <div className="text-xs text-zinc-500">Member since</div>
                <div className="text-sm text-white font-medium mt-0.5">{memberSince}</div>
              </div>
            )}
            <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3 text-center">
              <Hash size={15} className="text-emerald-400 mx-auto mb-1.5" />
              <div className="text-xs text-zinc-500">Total distills</div>
              <div className="text-sm text-white font-medium mt-0.5">{stats?.total ?? '—'}</div>
            </div>
            <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3 text-center">
              <Star size={15} className="text-amber-400 mx-auto mb-1.5" />
              <div className="text-xs text-zinc-500">Favorite format</div>
              <div className="text-sm text-white font-medium mt-0.5">{stats?.mostUsedFormat ? (FORMAT_NAMES[stats.mostUsedFormat] || stats.mostUsedFormat) : '—'}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Preferences */}
      <section className="glass-card p-4 sm:p-6 mb-6">
        <h2 className="font-heading font-semibold text-lg text-white mb-4">Preferences</h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-zinc-400 mb-2 block">Default Output Format</label>
            <select
              value={settings.defaultFormat}
              onChange={(e) => handleFormatChange(e.target.value)}
              className="bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-sm text-white w-full focus:outline-none focus:border-indigo-500/40"
            >
              {Object.entries(FORMAT_NAMES).map(([key, name]) => (
                <option key={key} value={key}>{name}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="text-sm text-white">Dark Mode</div>
              <div className="text-xs text-zinc-500">Coming soon</div>
            </div>
            <button disabled className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-zinc-500 cursor-not-allowed w-fit">
              <Moon size={15} />
              Dark Only
            </button>
          </div>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="glass-card p-4 sm:p-6 mb-6 border-red-500/10">
        <h2 className="font-heading font-semibold text-lg text-red-400 mb-4">Danger Zone</h2>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-sm text-white">Delete All Data</div>
            <div className="text-xs text-zinc-500 leading-relaxed">Permanently remove all distills and collections</div>
          </div>
          <button onClick={() => setConfirmDeleteAll(true)} className="btn-danger flex items-center gap-2 text-sm flex-shrink-0 w-fit">
            <Trash2 size={15} />
            Delete All
          </button>
        </div>
      </section>

      {/* Account */}
      <section className="glass-card p-4 sm:p-6">
        <button onClick={handleLogout} className="btn-secondary flex items-center gap-2">
          <LogOut size={16} />
          Sign Out
        </button>
      </section>

      <ConfirmDialog
        isOpen={confirmDeleteAll}
        onClose={() => setConfirmDeleteAll(false)}
        onConfirm={handleDeleteAll}
        title="Delete all data?"
        description="This will permanently remove all your distills, collections, and settings. This cannot be undone."
        confirmLabel="Delete Everything"
        variant="danger"
      />
    </motion.div>
  );
}
