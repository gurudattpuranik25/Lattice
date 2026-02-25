import { motion } from 'framer-motion';
import { useCountUp } from '../../hooks/useCountUp';

function StatItem({ value, label, suffix = '', colorClass = 'text-white' }) {
  const isNumber = typeof value === 'number';
  const { count, ref } = useCountUp(isNumber ? value : 0);

  return (
    <div ref={ref} className="text-center px-8">
      <div className={`font-mono font-bold text-4xl md:text-5xl mb-2 ${colorClass}`}>
        {isNumber ? count : value}{suffix}
      </div>
      <div className="text-zinc-400 text-sm">{label}</div>
    </div>
  );
}

export default function StatsSection() {
  return (
    <section className="py-20">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-0 md:divide-x md:divide-white/5"
        >
          <StatItem value={10} suffix="+" label="file types supported" colorClass="text-indigo-400" />
          <StatItem value={6} label="visual output formats" colorClass="text-emerald-400" />
          <StatItem value="Minutes" label="not hours to understand" colorClass="text-amber-400" />
        </motion.div>
      </div>
    </section>
  );
}
