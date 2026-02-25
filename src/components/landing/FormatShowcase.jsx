import { motion } from 'framer-motion';
import { GitBranch, GitPullRequest, Clock, Layers, BarChart3, Zap } from 'lucide-react';

const formats = [
  { icon: GitBranch, title: 'Mind Map', description: 'See how ideas connect', color: 'indigo' },
  { icon: GitPullRequest, title: 'Flowchart', description: 'Understand processes step by step', color: 'emerald' },
  { icon: Clock, title: 'Timeline', description: 'Events and sequences in order', color: 'amber' },
  { icon: Layers, title: 'Flashcards', description: 'Test your understanding', color: 'purple' },
  { icon: BarChart3, title: 'Infographic', description: 'Key stats and insights at a glance', color: 'cyan' },
  { icon: Zap, title: 'Key Takeaways', description: 'The 5-minute version', color: 'rose' },
];

const colorStyles = {
  indigo: { bg: 'bg-indigo-500/10', text: 'text-indigo-400' },
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-400' },
  purple: { bg: 'bg-purple-500/10', text: 'text-purple-400' },
  cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-400' },
  rose: { bg: 'bg-rose-500/10', text: 'text-rose-400' },
};

export default function FormatShowcase() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="font-heading font-bold text-3xl md:text-4xl text-center mb-16"
        >
          Six Ways to See Knowledge
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {formats.map((format, index) => (
            <motion.div
              key={format.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="glass-card glass-card-hover p-6 flex items-start gap-4"
            >
              <div className={`w-11 h-11 rounded-xl ${colorStyles[format.color].bg} flex items-center justify-center flex-shrink-0`}>
                <format.icon size={20} className={colorStyles[format.color].text} />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-lg text-white mb-1">
                  {format.title}
                </h3>
                <p className="text-zinc-400 text-sm">{format.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
