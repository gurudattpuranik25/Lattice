import { motion } from 'framer-motion';
import { GitBranch, Clock, Layers, BarChart3, Zap, LayoutGrid, Sparkles } from 'lucide-react';

const formats = [
  { key: 'mindMap', icon: GitBranch, title: 'Mind Map', description: 'Best for: understanding connections between concepts', color: 'indigo', preview: 'mindmap' },
  { key: 'timeline', icon: Clock, title: 'Timeline', description: 'Best for: historical events, project sequences', color: 'amber', preview: 'timeline' },
  { key: 'flashcards', icon: Layers, title: 'Flashcards', description: 'Best for: studying, memorization, review', color: 'purple', preview: 'flashcards' },
  { key: 'infographic', icon: BarChart3, title: 'Infographic Summary', description: 'Best for: reports, data-heavy content', color: 'cyan', preview: 'infographic' },
  { key: 'keyTakeaways', icon: Zap, title: 'Key Takeaways', description: 'Best for: quick overview, executive summary', color: 'rose', preview: 'takeaways' },
  { key: 'knowledgeCards', icon: LayoutGrid, title: 'Knowledge Cards', description: 'Best for: visual dashboard of key facts and insights', color: 'teal', preview: 'cards' },
];

const formatColors = {
  indigo: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', hover: 'group-hover:text-indigo-300', stroke: '#818CF8' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', hover: 'group-hover:text-amber-300', stroke: '#FBBF24' },
  purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', hover: 'group-hover:text-purple-300', stroke: '#A78BFA' },
  cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', hover: 'group-hover:text-cyan-300', stroke: '#22D3EE' },
  rose: { bg: 'bg-rose-500/10', text: 'text-rose-400', hover: 'group-hover:text-rose-300', stroke: '#FB7185' },
  teal: { bg: 'bg-teal-500/10', text: 'text-teal-400', hover: 'group-hover:text-teal-300', stroke: '#2DD4BF' },
};

function FormatPreview({ type, color }) {
  const c = formatColors[color];
  const s = c.stroke;

  switch (type) {
    case 'mindmap':
      return (
        <svg width="100%" height="48" viewBox="0 0 120 48" fill="none">
          <circle cx="60" cy="24" r="5" fill={s} fillOpacity="0.3" />
          <line x1="60" y1="24" x2="25" y2="10" stroke={s} strokeOpacity="0.3" strokeWidth="1.5" />
          <line x1="60" y1="24" x2="25" y2="38" stroke={s} strokeOpacity="0.3" strokeWidth="1.5" />
          <line x1="60" y1="24" x2="95" y2="10" stroke={s} strokeOpacity="0.3" strokeWidth="1.5" />
          <line x1="60" y1="24" x2="95" y2="38" stroke={s} strokeOpacity="0.3" strokeWidth="1.5" />
          <circle cx="25" cy="10" r="3.5" fill={s} fillOpacity="0.2" />
          <circle cx="25" cy="38" r="3.5" fill={s} fillOpacity="0.2" />
          <circle cx="95" cy="10" r="3.5" fill={s} fillOpacity="0.2" />
          <circle cx="95" cy="38" r="3.5" fill={s} fillOpacity="0.2" />
          <rect x="15" y="6" width="20" height="8" rx="4" fill={s} fillOpacity="0.08" />
          <rect x="85" y="6" width="20" height="8" rx="4" fill={s} fillOpacity="0.08" />
        </svg>
      );
    case 'timeline':
      return (
        <svg width="100%" height="48" viewBox="0 0 120 48" fill="none">
          <line x1="10" y1="24" x2="110" y2="24" stroke={s} strokeOpacity="0.2" strokeWidth="2" />
          {[25, 50, 75, 100].map((x, i) => (
            <g key={i}>
              <circle cx={x} cy={24} r={4} fill={s} fillOpacity={0.15 + i * 0.08} />
              <rect x={x - 10} y={6} width={20} height={8} rx={3} fill={s} fillOpacity={0.06 + i * 0.03} />
              <rect x={x - 8} y={34} width={16} height={4} rx={2} fill={s} fillOpacity="0.06" />
            </g>
          ))}
        </svg>
      );
    case 'flashcards':
      return (
        <svg width="100%" height="48" viewBox="0 0 120 48" fill="none">
          <rect x="20" y="6" width="44" height="30" rx="6" fill={s} fillOpacity="0.06" stroke={s} strokeOpacity="0.15" strokeWidth="1" />
          <rect x="30" y="10" width="44" height="30" rx="6" fill={s} fillOpacity="0.08" stroke={s} strokeOpacity="0.2" strokeWidth="1" />
          <rect x="40" y="14" width="44" height="30" rx="6" fill={s} fillOpacity="0.1" stroke={s} strokeOpacity="0.25" strokeWidth="1" />
          <text x="62" y="33" textAnchor="middle" fill={s} fillOpacity="0.4" fontSize="9" fontFamily="monospace">Q&A</text>
        </svg>
      );
    case 'infographic':
      return (
        <svg width="100%" height="48" viewBox="0 0 120 48" fill="none">
          <rect x="15" y="28" width="14" height="14" rx="3" fill={s} fillOpacity="0.12" />
          <rect x="35" y="18" width="14" height="24" rx="3" fill={s} fillOpacity="0.18" />
          <rect x="55" y="10" width="14" height="32" rx="3" fill={s} fillOpacity="0.25" />
          <rect x="75" y="22" width="14" height="20" rx="3" fill={s} fillOpacity="0.15" />
          <rect x="95" y="6" width="14" height="36" rx="3" fill={s} fillOpacity="0.3" />
        </svg>
      );
    case 'takeaways':
      return (
        <svg width="100%" height="48" viewBox="0 0 120 48" fill="none">
          {[12, 24, 36].map((y, i) => (
            <g key={i}>
              <circle cx={20} cy={y} r={3.5} fill={s} fillOpacity={0.2 + i * 0.08} />
              <rect x={30} y={y - 2.5} width={45 - i * 8} height={5} rx={2.5} fill={s} fillOpacity={0.08 + i * 0.04} />
            </g>
          ))}
          <rect x={82} y={8} width={24} height={32} rx={5} fill={s} fillOpacity="0.04" stroke={s} strokeOpacity="0.1" strokeWidth="1" />
          <path d="M90 20L94 24L98 18" stroke={s} strokeOpacity="0.2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'cards':
      return (
        <svg width="100%" height="48" viewBox="0 0 120 48" fill="none">
          <rect x="10" y="4" width="44" height="18" rx="4" fill={s} fillOpacity="0.06" stroke={s} strokeOpacity="0.12" strokeWidth="1" />
          <rect x="66" y="4" width="44" height="18" rx="4" fill={s} fillOpacity="0.08" stroke={s} strokeOpacity="0.15" strokeWidth="1" />
          <rect x="10" y="26" width="44" height="18" rx="4" fill={s} fillOpacity="0.08" stroke={s} strokeOpacity="0.15" strokeWidth="1" />
          <rect x="66" y="26" width="44" height="18" rx="4" fill={s} fillOpacity="0.06" stroke={s} strokeOpacity="0.12" strokeWidth="1" />
          <rect x="16" y="10" width="18" height="3" rx="1.5" fill={s} fillOpacity="0.15" />
          <rect x="72" y="10" width="14" height="3" rx="1.5" fill={s} fillOpacity="0.15" />
          <rect x="16" y="32" width="20" height="3" rx="1.5" fill={s} fillOpacity="0.15" />
          <rect x="72" y="32" width="16" height="3" rx="1.5" fill={s} fillOpacity="0.15" />
        </svg>
      );
    default:
      return null;
  }
}

export default function FormatSelector({ onSelect, recommended = [] }) {
  return (
    <div>
      <h2 className="font-heading font-semibold text-xl text-white mb-2">
        Choose how you want to see this
      </h2>
      <p className="text-sm text-zinc-400 mb-6 leading-relaxed">Select a visual format for your content.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {formats.map(({ key, icon: Icon, title, description, color, preview }, index) => (
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

            {/* Preview thumbnail */}
            <div className="mb-3 rounded-lg bg-white/[0.02] border border-white/5 p-2 overflow-hidden group-hover:border-white/10 transition-colors">
              <FormatPreview type={preview} color={color} />
            </div>

            <div className="flex items-center gap-2.5 mb-1.5">
              <div className={`w-8 h-8 rounded-lg ${formatColors[color].bg} flex items-center justify-center flex-shrink-0`}>
                <Icon size={16} className={formatColors[color].text} />
              </div>
              <h3 className={`font-heading font-semibold text-white ${formatColors[color].hover} transition-colors`}>
                {title}
              </h3>
            </div>
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
