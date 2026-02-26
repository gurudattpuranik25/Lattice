import { motion } from 'framer-motion';
import { GitBranch, Clock, Layers, BarChart3, Zap, LayoutGrid, Sparkles } from 'lucide-react';

const formats = [
  { key: 'mindMap', icon: GitBranch, title: 'Mind Map', description: 'Best for: understanding connections between concepts', color: 'indigo' },
  { key: 'timeline', icon: Clock, title: 'Timeline', description: 'Best for: historical events, project sequences', color: 'amber' },
  { key: 'flashcards', icon: Layers, title: 'Flashcards', description: 'Best for: studying, memorization, review', color: 'purple' },
  { key: 'infographic', icon: BarChart3, title: 'Infographic Summary', description: 'Best for: reports, data-heavy content', color: 'cyan' },
  { key: 'keyTakeaways', icon: Zap, title: 'Key Takeaways', description: 'Best for: quick overview, executive summary', color: 'rose' },
  { key: 'knowledgeCards', icon: LayoutGrid, title: 'Knowledge Cards', description: 'Best for: visual dashboard of key facts, stats, and insights', color: 'teal' },
];

const formatColors = {
  indigo: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', hover: 'group-hover:text-indigo-300' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', hover: 'group-hover:text-amber-300' },
  purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', hover: 'group-hover:text-purple-300' },
  cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', hover: 'group-hover:text-cyan-300' },
  rose: { bg: 'bg-rose-500/10', text: 'text-rose-400', hover: 'group-hover:text-rose-300' },
  teal: { bg: 'bg-teal-500/10', text: 'text-teal-400', hover: 'group-hover:text-teal-300' },
};

export default function FormatSelector({ onSelect, recommended = [] }) {
  return (
    <div>
      <h2 className="font-heading font-semibold text-xl text-white mb-2">
        Choose how you want to see this
      </h2>
      <p className="text-sm text-zinc-400 mb-6">Select a visual format for your content.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {formats.map(({ key, icon: Icon, title, description, color }, index) => (
          <motion.button
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.06 }}
            onClick={() => onSelect(key)}
            className="glass-card glass-card-hover p-5 text-left relative group"
          >
            {recommended.includes(key) && (
              <span className="absolute top-3 right-3 flex items-center gap-1 text-xs text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md">
                <Sparkles size={12} /> Recommended
              </span>
            )}
            <div className={`w-10 h-10 rounded-xl ${formatColors[color].bg} flex items-center justify-center mb-3`}>
              <Icon size={20} className={formatColors[color].text} />
            </div>
            <h3 className={`font-heading font-semibold text-white mb-1 ${formatColors[color].hover} transition-colors`}>
              {title}
            </h3>
            <p className="text-xs text-zinc-500">{description}</p>
          </motion.button>
        ))}
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        onClick={() => onSelect('auto')}
        className="btn-secondary flex items-center gap-2 mx-auto"
      >
        <Sparkles size={16} />
        Let AI Choose
      </motion.button>
    </div>
  );
}
