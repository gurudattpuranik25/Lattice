import { motion } from 'framer-motion';
import { FileText, LayoutGrid, Clock } from 'lucide-react';
import { useCountUp } from '../../hooks/useCountUp';

const stats = [
  {
    value: 10,
    suffix: '+',
    label: 'File types supported',
    icon: FileText,
    gradient: 'from-indigo-400 to-indigo-600',
    glow: 'hover:shadow-indigo-500/20',
  },
  {
    value: 6,
    suffix: '',
    label: 'Visual output formats',
    icon: LayoutGrid,
    gradient: 'from-emerald-400 to-emerald-600',
    glow: 'hover:shadow-emerald-500/20',
  },
  {
    value: null,
    display: 'Minutes',
    label: 'Not hours to understand',
    icon: Clock,
    gradient: 'from-amber-400 to-amber-600',
    glow: 'hover:shadow-amber-500/20',
  },
];

function StatCard({ stat, index }) {
  const isNumber = stat.value !== null;
  const { count, ref } = useCountUp(isNumber ? stat.value : 0);
  const Icon = stat.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`glass-card p-8 text-center group hover:border-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${stat.glow}`}
    >
      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300">
        <Icon size={22} className="text-zinc-400" />
      </div>
      <div className={`font-mono font-bold text-4xl md:text-5xl mb-2 bg-gradient-to-b ${stat.gradient} bg-clip-text text-transparent`}>
        {isNumber ? count : stat.display}{stat.suffix}
      </div>
      <div className="text-zinc-400 text-sm">{stat.label}</div>
    </motion.div>
  );
}

export default function StatsSection() {
  return (
    <section id="stats" className="py-24">
      <div className="max-w-4xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <StatCard key={stat.label} stat={stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
