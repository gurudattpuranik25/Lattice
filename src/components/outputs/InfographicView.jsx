import { motion } from 'framer-motion';
import {
  Lightbulb, TrendingUp, AlertTriangle, CheckCircle, Star, Zap, Target, Shield,
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

function StatCard({ value, label, index }) {
  const numericMatch = value?.match?.(/[\d.]+/);
  const numVal = numericMatch ? parseFloat(numericMatch[0]) : null;
  const { count, ref } = useCountUp(numVal || 0, 1500, true);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="glass-card p-6 text-center"
    >
      <div className="font-mono font-bold text-3xl text-white mb-2">
        {numVal !== null ? value.replace(numericMatch[0], String(count)) : value}
      </div>
      <div className="text-sm text-zinc-400">{label}</div>
    </motion.div>
  );
}

export default function InfographicView({ data }) {
  if (!data) {
    return <div className="text-center text-zinc-500 py-20">No infographic data available.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-12">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="font-heading font-bold text-3xl text-white mb-2">{data.title}</h2>
        {data.subtitle && <p className="text-zinc-400 text-lg">{data.subtitle}</p>}
      </motion.div>

      {/* Stats */}
      {data.stats?.length > 0 && (
        <div>
          <h3 className="font-heading font-semibold text-lg text-zinc-300 mb-4 text-center">
            By The Numbers
          </h3>
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
          <h3 className="font-heading font-semibold text-lg text-zinc-300 mb-4 text-center">
            Key Insights
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.insights.map((insight, i) => {
              const Icon = iconMap[insight.icon] || Lightbulb;
              const iconColorMap = {
                'alert-triangle': { bg: 'bg-amber-500/10', text: 'text-amber-400' },
                'trending-up': { bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
                'check-circle': { bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
                star: { bg: 'bg-amber-500/10', text: 'text-amber-400' },
                zap: { bg: 'bg-yellow-500/10', text: 'text-yellow-400' },
                target: { bg: 'bg-rose-500/10', text: 'text-rose-400' },
                shield: { bg: 'bg-blue-500/10', text: 'text-blue-400' },
                lightbulb: { bg: 'bg-indigo-500/10', text: 'text-indigo-400' },
              };
              const ic = iconColorMap[insight.icon] || iconColorMap.lightbulb;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="glass-card p-5 flex gap-4"
                >
                  <div className={`w-10 h-10 rounded-xl ${ic.bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon size={18} className={ic.text} />
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-white text-sm mb-1">{insight.title}</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">{insight.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Process */}
      {data.process?.length > 0 && (
        <div>
          <h3 className="font-heading font-semibold text-lg text-zinc-300 mb-4 text-center">
            How It Works
          </h3>
          <div className="space-y-3">
            {data.process.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-4 flex items-start gap-4"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center flex-shrink-0 font-mono font-bold text-sm text-indigo-400">
                  {step.step}
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-white text-sm">{step.title}</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Key Quote */}
      {data.keyQuote && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="glass-card p-8 text-center border-l-4 border-indigo-400"
        >
          <p className="text-lg text-zinc-200 italic leading-relaxed">"{data.keyQuote}"</p>
        </motion.div>
      )}
    </div>
  );
}
