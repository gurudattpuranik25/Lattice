import { motion } from 'framer-motion';
import {
  Lightbulb, TrendingUp, AlertTriangle, CheckCircle, Star, Zap, Target, Shield,
  Quote,
} from 'lucide-react';
import { useCountUp } from '../../hooks/useCountUp';

const iconMap = {
  lightbulb: Lightbulb,
  'trending-up': TrendingUp,
  'alert-triangle': AlertTriangle,
  'check-circle': CheckCircle,
  star: Star,
  zap: Zap,
  target: Target,
  shield: Shield,
};

// --- Color palette for stat cards ---
const statColors = [
  { gradient: 'linear-gradient(135deg, #6366F1 0%, #818CF8 100%)', accent: '#818CF8', soft: 'rgba(99,102,241,0.12)', border: 'rgba(129,140,248,0.3)' },
  { gradient: 'linear-gradient(135deg, #059669 0%, #34D399 100%)', accent: '#34D399', soft: 'rgba(52,211,153,0.12)', border: 'rgba(52,211,153,0.3)' },
  { gradient: 'linear-gradient(135deg, #EA580C 0%, #FB923C 100%)', accent: '#FB923C', soft: 'rgba(251,146,60,0.12)', border: 'rgba(251,146,60,0.3)' },
  { gradient: 'linear-gradient(135deg, #DB2777 0%, #F472B6 100%)', accent: '#F472B6', soft: 'rgba(244,114,182,0.12)', border: 'rgba(244,114,182,0.3)' },
];

// --- Color config for insight icons ---
const iconColorConfig = {
  'alert-triangle': { bg: '#D97706', soft: 'rgba(217,119,6,0.15)' },
  'trending-up':    { bg: '#059669', soft: 'rgba(5,150,105,0.15)' },
  'check-circle':   { bg: '#34D399', soft: 'rgba(52,211,153,0.15)' },
  star:             { bg: '#FBBF24', soft: 'rgba(251,191,36,0.15)' },
  zap:              { bg: '#F59E0B', soft: 'rgba(245,158,11,0.15)' },
  target:           { bg: '#F43F5E', soft: 'rgba(244,63,94,0.15)' },
  shield:           { bg: '#3B82F6', soft: 'rgba(59,130,246,0.15)' },
  lightbulb:        { bg: '#6366F1', soft: 'rgba(99,102,241,0.15)' },
};

const defaultIconColor = iconColorConfig.lightbulb;

// --- Process step colors ---
const stepColors = [
  { accent: '#818CF8', soft: 'rgba(129,140,248,0.12)', border: 'rgba(129,140,248,0.25)' },
  { accent: '#34D399', soft: 'rgba(52,211,153,0.12)', border: 'rgba(52,211,153,0.25)' },
  { accent: '#FB923C', soft: 'rgba(251,146,60,0.12)', border: 'rgba(251,146,60,0.25)' },
  { accent: '#F472B6', soft: 'rgba(244,114,182,0.12)', border: 'rgba(244,114,182,0.25)' },
  { accent: '#38BDF8', soft: 'rgba(56,189,248,0.12)', border: 'rgba(56,189,248,0.25)' },
];

// --- Stat Card with gradient background ---
function StatCard({ value, label, index }) {
  const numericMatch = value?.match?.(/[\d.]+/);
  const numVal = numericMatch ? parseFloat(numericMatch[0]) : null;
  const { count, ref } = useCountUp(numVal || 0, 1500, true);
  const color = statColors[index % statColors.length];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ scale: 1.04, y: -4 }}
      className="relative rounded-2xl p-6 text-center overflow-hidden cursor-default"
      style={{
        background: color.gradient,
        boxShadow: `0 8px 32px ${color.soft}, 0 0 0 1px ${color.border}`,
      }}
    >
      {/* Decorative circle */}
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-[0.12]"
        style={{ background: '#fff' }} />

      <div className="relative z-10">
        <div className="font-mono font-extrabold text-4xl text-white mb-2 drop-shadow-sm">
          {numVal !== null ? value.replace(numericMatch[0], String(count)) : value}
        </div>
        <div className="text-sm text-white/70 font-medium">{label}</div>
      </div>
    </motion.div>
  );
}

// --- Insight Card ---
function InsightCard({ insight, index }) {
  const Icon = iconMap[insight.icon] || Lightbulb;
  const ic = iconColorConfig[insight.icon] || defaultIconColor;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="rounded-2xl p-5 transition-all duration-300 group"
      style={{
        background: '#111116',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="flex gap-4 items-start">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: ic.soft }}>
          <Icon size={20} style={{ color: ic.bg }} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-heading font-semibold text-white text-sm group-hover:text-zinc-100 transition-colors">
            {insight.title}
          </h4>
          <p className="text-sm text-zinc-400 leading-relaxed mt-2">
            {insight.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// --- Process Step ---
function ProcessStep({ step, index, total }) {
  const color = stepColors[index % stepColors.length];

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.12, duration: 0.5 }}
      className="flex gap-4 items-start relative"
    >
      {/* Vertical line connector */}
      {index < total - 1 && (
        <div className="absolute left-[19px] top-[44px] w-[2px] bottom-[-12px]"
          style={{ background: `linear-gradient(to bottom, ${color.accent}40, transparent)` }} />
      )}

      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 relative z-10 font-mono font-extrabold text-sm"
        style={{
          background: color.soft,
          color: color.accent,
          border: `1.5px solid ${color.border}`,
          boxShadow: `0 0 16px ${color.soft}`,
        }}>
        {step.step}
      </div>
      <div className="flex-1 rounded-xl p-4 mb-3 transition-all duration-200"
        style={{
          background: '#111116',
          border: `1px solid rgba(255,255,255,0.06)`,
        }}>
        <h4 className="font-heading font-semibold text-white text-sm">{step.title}</h4>
        <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{step.description}</p>
      </div>
    </motion.div>
  );
}

// --- Main Component ---
export default function InfographicView({ data }) {
  if (!data) {
    return <div className="text-center text-zinc-500 py-20">No infographic data available.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-14">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h2 className="font-heading font-bold text-3xl sm:text-4xl text-white mb-3">{data.title}</h2>
        {data.subtitle && (
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">{data.subtitle}</p>
        )}
      </motion.div>

      {/* Stats */}
      {data.stats?.length > 0 && (
        <div>
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-heading font-semibold text-lg text-zinc-300 mb-5 text-center"
          >
            By The Numbers
          </motion.h3>
          <div className={`grid gap-4 ${data.stats.length <= 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-2 sm:grid-cols-4'}`}>
            {data.stats.map((stat, i) => (
              <StatCard key={i} value={stat.value} label={stat.label} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Insights */}
      {data.insights?.length > 0 && (
        <div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-5"
          >
            <h3 className="font-heading font-semibold text-lg text-zinc-300">
              Key Insights
            </h3>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.insights.map((insight, i) => (
              <InsightCard key={i} insight={insight} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Process */}
      {data.process?.length > 0 && (
        <div>
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-heading font-semibold text-lg text-zinc-300 mb-5 text-center"
          >
            How It Works
          </motion.h3>
          <div className="space-y-1">
            {data.process.map((step, i) => (
              <ProcessStep key={i} step={step} index={i} total={data.process.length} />
            ))}
          </div>
        </div>
      )}

      {/* Key Quote */}
      {data.keyQuote && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative rounded-2xl p-8 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(167,139,250,0.08) 100%)',
            border: '1px solid rgba(129,140,248,0.2)',
          }}
        >
          <Quote size={32} className="text-indigo-500/30 absolute top-4 left-4" />
          <div className="relative z-10 text-center px-4">
            <p className="text-lg sm:text-xl text-zinc-200 italic leading-relaxed font-medium">
              &ldquo;{data.keyQuote}&rdquo;
            </p>
          </div>
          <Quote size={32} className="text-indigo-500/30 absolute bottom-4 right-4 rotate-180" />
        </motion.div>
      )}
    </div>
  );
}
