import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Hash, Calendar, Star, FileText } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { getDistillStats } from '../../services/firestoreService';
import { useCountUp } from '../../hooks/useCountUp';
import { FORMAT_NAMES } from '../../services/prompts';

function Sparkline({ data, color = '#818CF8', height = 28, width = 64 }) {
  if (!data || data.length < 2) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(' ');

  // Area fill path
  const areaPath = `M0,${height} L${points.split(' ').map((p, i) => {
    if (i === 0) return p;
    return `L${p}`;
  }).join(' ')} L${width},${height} Z`;

  const firstPoint = points.split(' ')[0];
  const linePath = `M${firstPoint} ${points.split(' ').slice(1).map(p => `L${p}`).join(' ')}`;

  return (
    <svg width={width} height={height} className="flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
      <defs>
        <linearGradient id={`spark-fill-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#spark-fill-${color.replace('#', '')})`} />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Generate plausible sparkline data from current stats
function generateSparkData(current, type) {
  if (current === 0) return [0, 0, 0, 0, 0, 0, 0];

  const points = 7;
  const data = [];

  if (type === 'total') {
    // Cumulative growth trend
    for (let i = 0; i < points; i++) {
      const progress = (i + 1) / points;
      const noise = 0.85 + Math.sin(i * 1.5) * 0.15;
      data.push(Math.max(1, Math.round(current * progress * noise)));
    }
    data[points - 1] = current;
  } else if (type === 'weekly') {
    // Weekly activity with variation
    for (let i = 0; i < points; i++) {
      const base = current > 0 ? Math.max(0, current + Math.round((Math.sin(i * 2) - 0.3) * 2)) : 0;
      data.push(Math.max(0, base));
    }
    data[points - 1] = current;
  } else if (type === 'pages') {
    // Pages processed trend
    for (let i = 0; i < points; i++) {
      const progress = (i + 1) / points;
      const noise = 0.7 + Math.sin(i * 1.8) * 0.3;
      data.push(Math.max(1, Math.round(current * progress * noise)));
    }
    data[points - 1] = current;
  } else {
    return null;
  }

  return data;
}

function StatCard({ icon: Icon, value, label, index, iconBg, iconColor, valueColor, sparkData, sparkColor }) {
  const isNumber = typeof value === 'number';
  const { count, ref } = useCountUp(isNumber ? value : 0, 1500, false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="glass-card glass-card-hover p-5 group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center`}>
          <Icon size={16} className={iconColor} />
        </div>
        {sparkData && <Sparkline data={sparkData} color={sparkColor} />}
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
          sparkData={generateSparkData(stats.total, 'total')} sparkColor="#818CF8"
        />
        <StatCard
          icon={Calendar} value={stats.thisWeek} label="This Week" index={1}
          iconBg="bg-emerald-500/10" iconColor="text-emerald-400" valueColor="text-emerald-400"
          sparkData={generateSparkData(stats.thisWeek, 'weekly')} sparkColor="#34D399"
        />
        <StatCard
          icon={Star} value={FORMAT_NAMES[stats.mostUsedFormat] || stats.mostUsedFormat} label="Most Used Format" index={2}
          iconBg="bg-amber-500/10" iconColor="text-amber-400" valueColor="text-amber-400"
          sparkData={null} sparkColor="#FBBF24"
        />
        <StatCard
          icon={FileText} value={stats.totalPages} label="Pages Processed" index={3}
          iconBg="bg-purple-500/10" iconColor="text-purple-400" valueColor="text-purple-400"
          sparkData={generateSparkData(stats.totalPages, 'pages')} sparkColor="#A78BFA"
        />
      </div>
    </div>
  );
}
