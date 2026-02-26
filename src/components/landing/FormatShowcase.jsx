import { motion } from 'framer-motion';
import { GitBranch, Clock, Layers, BarChart3, Zap, LayoutGrid } from 'lucide-react';

const formats = [
  {
    icon: GitBranch,
    title: 'Mind Map',
    description: 'See how ideas connect in a visual branching structure',
    color: 'indigo',
    preview: 'mindmap',
  },
  {
    icon: Clock,
    title: 'Timeline',
    description: 'Events and sequences placed in clear chronological order',
    color: 'amber',
    preview: 'timeline',
  },
  {
    icon: Layers,
    title: 'Flashcards',
    description: 'Test and reinforce your understanding with Q&A cards',
    color: 'purple',
    preview: 'flashcards',
  },
  {
    icon: BarChart3,
    title: 'Infographic',
    description: 'Key stats and insights visualized at a glance',
    color: 'cyan',
    preview: 'infographic',
  },
  {
    icon: Zap,
    title: 'Key Takeaways',
    description: 'The essential points distilled into a 5-minute read',
    color: 'rose',
    preview: 'takeaways',
  },
  {
    icon: LayoutGrid,
    title: 'Knowledge Cards',
    description: 'A dashboard of facts, stats, and organized insights',
    color: 'teal',
    preview: 'cards',
  },
];

const colorStyles = {
  indigo: { border: 'border-l-indigo-500', bg: 'bg-indigo-500/10', text: 'text-indigo-400', glow: 'group-hover:shadow-indigo-500/10' },
  amber: { border: 'border-l-amber-500', bg: 'bg-amber-500/10', text: 'text-amber-400', glow: 'group-hover:shadow-amber-500/10' },
  purple: { border: 'border-l-purple-500', bg: 'bg-purple-500/10', text: 'text-purple-400', glow: 'group-hover:shadow-purple-500/10' },
  cyan: { border: 'border-l-cyan-500', bg: 'bg-cyan-500/10', text: 'text-cyan-400', glow: 'group-hover:shadow-cyan-500/10' },
  rose: { border: 'border-l-rose-500', bg: 'bg-rose-500/10', text: 'text-rose-400', glow: 'group-hover:shadow-rose-500/10' },
  teal: { border: 'border-l-teal-500', bg: 'bg-teal-500/10', text: 'text-teal-400', glow: 'group-hover:shadow-teal-500/10' },
};

function MiniPreview({ type, color }) {
  const c = colorStyles[color];

  switch (type) {
    case 'mindmap':
      return (
        <svg width="48" height="32" viewBox="0 0 48 32" className={`${c.text} opacity-40 group-hover:opacity-70 transition-opacity duration-300`}>
          <circle cx="24" cy="16" r="3" fill="currentColor" />
          <line x1="24" y1="16" x2="10" y2="6" stroke="currentColor" strokeWidth="1.5" />
          <line x1="24" y1="16" x2="10" y2="26" stroke="currentColor" strokeWidth="1.5" />
          <line x1="24" y1="16" x2="38" y2="10" stroke="currentColor" strokeWidth="1.5" />
          <line x1="24" y1="16" x2="38" y2="22" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="10" cy="6" r="2" fill="currentColor" />
          <circle cx="10" cy="26" r="2" fill="currentColor" />
          <circle cx="38" cy="10" r="2" fill="currentColor" />
          <circle cx="38" cy="22" r="2" fill="currentColor" />
        </svg>
      );
    case 'timeline':
      return (
        <svg width="48" height="32" viewBox="0 0 48 32" className={`${c.text} opacity-40 group-hover:opacity-70 transition-opacity duration-300`}>
          <line x1="4" y1="16" x2="44" y2="16" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="12" cy="16" r="3" fill="currentColor" />
          <circle cx="24" cy="16" r="3" fill="currentColor" />
          <circle cx="36" cy="16" r="3" fill="currentColor" />
        </svg>
      );
    case 'flashcards':
      return (
        <svg width="48" height="32" viewBox="0 0 48 32" className={`${c.text} opacity-40 group-hover:opacity-70 transition-opacity duration-300`}>
          <rect x="8" y="4" width="24" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <rect x="14" y="8" width="24" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.5" />
          <rect x="20" y="12" width="24" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.3" />
        </svg>
      );
    case 'infographic':
      return (
        <svg width="48" height="32" viewBox="0 0 48 32" className={`${c.text} opacity-40 group-hover:opacity-70 transition-opacity duration-300`}>
          <rect x="6" y="18" width="8" height="10" rx="1" fill="currentColor" opacity="0.6" />
          <rect x="18" y="10" width="8" height="18" rx="1" fill="currentColor" opacity="0.8" />
          <rect x="30" y="4" width="8" height="24" rx="1" fill="currentColor" />
        </svg>
      );
    case 'takeaways':
      return (
        <svg width="48" height="32" viewBox="0 0 48 32" className={`${c.text} opacity-40 group-hover:opacity-70 transition-opacity duration-300`}>
          <circle cx="10" cy="8" r="2.5" fill="currentColor" />
          <line x1="16" y1="8" x2="42" y2="8" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="10" cy="16" r="2.5" fill="currentColor" />
          <line x1="16" y1="16" x2="36" y2="16" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="10" cy="24" r="2.5" fill="currentColor" />
          <line x1="16" y1="24" x2="38" y2="24" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    case 'cards':
      return (
        <svg width="48" height="32" viewBox="0 0 48 32" className={`${c.text} opacity-40 group-hover:opacity-70 transition-opacity duration-300`}>
          <rect x="4" y="4" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <rect x="24" y="4" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <rect x="4" y="18" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <rect x="24" y="18" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </svg>
      );
    default:
      return null;
  }
}

export default function FormatShowcase() {
  return (
    <section id="formats" className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 sm:mb-16"
        >
          <h2 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl mb-3">
            Six Ways to See Knowledge
          </h2>
          <p className="text-zinc-400 text-lg">Choose the format that fits how you learn best</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {formats.map((format, index) => {
            const c = colorStyles[format.color];
            return (
              <motion.div
                key={format.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className={`glass-card p-4 sm:p-6 border-l-2 ${c.border} group hover:bg-white/[0.04] hover:-translate-y-1 hover:shadow-lg ${c.glow} transition-all duration-300 cursor-default`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-11 h-11 rounded-xl ${c.bg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    <format.icon size={20} className={c.text} />
                  </div>
                  <MiniPreview type={format.preview} color={format.color} />
                </div>
                <h3 className="font-heading font-semibold text-lg text-white mb-1">
                  {format.title}
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{format.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
