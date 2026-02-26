import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogOut, Trash2, Moon } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getUserSettings, updateUserSettings } from '../../services/firestoreService';
import ConfirmDialog from '../shared/ConfirmDialog';
import { FORMAT_NAMES } from '../../services/prompts';

export default function Settings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [settings, setSettings] = useState({ defaultFormat: 'keyTakeaways' });
  const [loading, setLoading] = useState(true);
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);

  useEffect(() => {
    if (user) {
      getUserSettings(user.uid).then(s => {
        setSettings(s);
        setLoading(false);
      });
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

  const handleDeleteAll = () => {
    toast.error('This feature is coming soon.');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl"
    >
      <h1 className="font-heading font-bold text-3xl text-white mb-8">Settings</h1>

      {/* Profile */}
      <section className="glass-card p-6 mb-6">
        <h2 className="font-heading font-semibold text-lg text-white mb-4">Profile</h2>
        <div className="flex items-center gap-4">
          {user?.photoURL ? (
            <img src={user.photoURL} alt="" className="w-14 h-14 rounded-full" referrerPolicy="no-referrer" />
          ) : (
            <div className="w-14 h-14 rounded-full bg-indigo-500/20 flex items-center justify-center text-xl text-indigo-400 font-bold">
              {user?.displayName?.[0]}
            </div>
          )}
          <div>
            <div className="text-white font-medium">{user?.displayName}</div>
            <div className="text-sm text-zinc-400">{user?.email}</div>
          </div>
        </div>
      </section>

      {/* Preferences */}
      <section className="glass-card p-6 mb-6">
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

          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-white">Dark Mode</div>
              <div className="text-xs text-zinc-500">Coming soon</div>
            </div>
            <button disabled className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-zinc-500 cursor-not-allowed">
              <Moon size={15} />
              Dark Only
            </button>
          </div>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="glass-card p-6 mb-6 border-red-500/10">
        <h2 className="font-heading font-semibold text-lg text-red-400 mb-4">Danger Zone</h2>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-white">Delete All Data</div>
            <div className="text-xs text-zinc-500">Permanently remove all distills and collections</div>
          </div>
          <button onClick={() => setConfirmDeleteAll(true)} className="btn-danger flex items-center gap-2 text-sm">
            <Trash2 size={15} />
            Delete All
          </button>
        </div>
      </section>

      {/* Account */}
      <section className="glass-card p-6">
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
