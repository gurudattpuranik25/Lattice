import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Hash, Calendar, Star, FileText } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { getDistillStats } from '../../services/firestoreService';
import { useCountUp } from '../../hooks/useCountUp';
import { FORMAT_NAMES } from '../../services/prompts';

function StatCard({ icon: Icon, value, label, index, iconBg, iconColor, valueColor }) {
  const isNumber = typeof value === 'number';
  const { count, ref } = useCountUp(isNumber ? value : 0, 1500, false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="glass-card glass-card-hover p-5"
    >
      <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center mb-3`}>
        <Icon size={16} className={iconColor} />
      </div>
      <div className={`font-mono font-bold text-2xl mb-1 ${valueColor}`}>
        {isNumber ? count : value}
      </div>
      <div className="text-xs text-zinc-400">{label}</div>
    </motion.div>
  );
}

export default function StatsCards() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (user) {
      getDistillStats(user.uid).then(setStats);
    }
  }, [user]);

  if (!stats) return null;

  return (
    <div>
      <h2 className="font-heading font-semibold text-lg text-white mb-4 flex items-center gap-2">
        <span className="w-1 h-5 rounded-full bg-emerald-500" />
        Your Stats
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Hash} value={stats.total} label="Total Distills" index={0}
          iconBg="bg-indigo-500/10" iconColor="text-indigo-400" valueColor="text-indigo-400"
        />
        <StatCard
          icon={Calendar} value={stats.thisWeek} label="This Week" index={1}
          iconBg="bg-emerald-500/10" iconColor="text-emerald-400" valueColor="text-emerald-400"
        />
        <StatCard
          icon={Star} value={FORMAT_NAMES[stats.mostUsedFormat] || stats.mostUsedFormat} label="Most Used Format" index={2}
          iconBg="bg-amber-500/10" iconColor="text-amber-400" valueColor="text-amber-400"
        />
        <StatCard
          icon={FileText} value={stats.totalPages} label="Pages Processed" index={3}
          iconBg="bg-purple-500/10" iconColor="text-purple-400" valueColor="text-purple-400"
        />
      </div>
    </div>
  );
}
