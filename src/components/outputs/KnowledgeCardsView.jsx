import { motion } from 'framer-motion';
import { Lightbulb, Quote, BookOpen, Brain, ArrowLeftRight, Sparkles, Star } from 'lucide-react';

const cardTypeConfig = {
  stat: {
    gradient: 'linear-gradient(135deg, #6366F1 0%, #818CF8 100%)',
    accent: '#818CF8',
    accentSoft: 'rgba(99,102,241,0.08)',
    border: 'rgba(129,140,248,0.20)',
    glow: 'rgba(99,102,241,0.12)',
    icon: Sparkles,
    label: 'Statistic',
  },
  quote: {
    gradient: 'linear-gradient(135deg, #DB2777 0%, #F472B6 100%)',
    accent: '#F472B6',
    accentSoft: 'rgba(244,114,182,0.08)',
    border: 'rgba(244,114,182,0.20)',
    glow: 'rgba(244,114,182,0.12)',
    icon: Quote,
    label: 'Quote',
  },
  definition: {
    gradient: 'linear-gradient(135deg, #059669 0%, #34D399 100%)',
    accent: '#34D399',
    accentSoft: 'rgba(52,211,153,0.08)',
    border: 'rgba(52,211,153,0.20)',
    glow: 'rgba(52,211,153,0.12)',
    icon: BookOpen,
    label: 'Definition',
  },
  insight: {
    gradient: 'linear-gradient(135deg, #0284C7 0%, #38BDF8 100%)',
    accent: '#38BDF8',
    accentSoft: 'rgba(56,189,248,0.08)',
    border: 'rgba(56,189,248,0.20)',
    glow: 'rgba(56,189,248,0.12)',
    icon: Brain,
    label: 'Insight',
  },
  comparison: {
    gradient: 'linear-gradient(135deg, #EA580C 0%, #FB923C 100%)',
    accent: '#FB923C',
    accentSoft: 'rgba(251,146,60,0.08)',
    border: 'rgba(251,146,60,0.20)',
    glow: 'rgba(251,146,60,0.12)',
    icon: ArrowLeftRight,
    label: 'Comparison',
  },
  fact: {
    gradient: 'linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)',
    accent: '#A78BFA',
    accentSoft: 'rgba(167,139,250,0.08)',
    border: 'rgba(167,139,250,0.20)',
    glow: 'rgba(167,139,250,0.12)',
    icon: Lightbulb,
    label: 'Fact',
  },
};

const defaultConfig = cardTypeConfig.fact;

// --- Floating icon decoration ---
function FloatingIcon({ config }) {
  const Icon = config.icon;
  return (
    <div
      className="absolute -top-3 -right-3 w-16 h-16 rounded-2xl flex items-center justify-center opacity-[0.06] rotate-12"
      style={{ background: config.gradient }}
    >
      <Icon size={32} />
    </div>
  );
}

// --- Card type badge ---
function TypeBadge({ config }) {
  const Icon = config.icon;
  return (
    <div
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
      style={{ background: config.accentSoft, color: config.accent }}
    >
      <Icon size={11} />
      {config.label}
    </div>
  );
}

// --- Stat Card ---
function StatCard({ card, config }) {
  return (
    <div className="text-center py-4">
      <div
        className="text-5xl sm:text-6xl font-extrabold font-heading mb-3 leading-none"
        style={{
          background: config.gradient,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        {card.value}
      </div>
      <div className="text-sm text-zinc-400 font-medium">{card.label}</div>
    </div>
  );
}

// --- Quote Card ---
function QuoteCard({ card, config }) {
  return (
    <div>
      <Quote size={24} style={{ color: config.accent }} className="opacity-30 mb-3" />
      <p className="text-zinc-200 italic text-[15px] leading-relaxed mb-3">
        &ldquo;{card.text}&rdquo;
      </p>
      {card.attribution && (
        <div className="flex items-center gap-2">
          <div className="w-6 h-[2px] rounded-full" style={{ background: config.gradient }} />
          <p className="text-xs font-semibold" style={{ color: config.accent }}>
            {card.attribution}
          </p>
        </div>
      )}
    </div>
  );
}

// --- Definition Card ---
function DefinitionCard({ card, config }) {
  return (
    <div>
      <div className="text-lg font-bold text-white mb-2">{card.term}</div>
      <div
        className="text-sm text-zinc-300 leading-relaxed rounded-xl p-3.5"
        style={{ background: config.accentSoft, borderLeft: `3px solid ${config.accent}` }}
      >
        {card.explanation}
      </div>
    </div>
  );
}

// --- Insight Card ---
function InsightCard({ card, config }) {
  const Icon = config.icon;
  return (
    <div>
      <div className="flex items-center gap-2.5 mb-2.5">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: config.gradient }}
        >
          <Icon size={16} className="text-white" />
        </div>
        <div className="text-[15px] font-semibold text-white">{card.title}</div>
      </div>
      <div className="text-sm text-zinc-400 leading-relaxed pl-[42px]">{card.description}</div>
    </div>
  );
}

// --- Comparison Card ---
function ComparisonCard({ card, config }) {
  return (
    <div>
      <div className="text-[15px] font-semibold text-white mb-3">{card.title}</div>
      <div className="grid grid-cols-2 gap-3">
        <div
          className="rounded-xl p-3.5"
          style={{ background: config.accentSoft, border: `1px solid ${config.border}` }}
        >
          <div className="text-xs font-bold mb-2.5" style={{ color: config.accent }}>
            {card.left?.label}
          </div>
          <ul className="space-y-2">
            {card.left?.points?.map((p, i) => (
              <li key={i} className="text-xs text-zinc-300 flex gap-2 items-start leading-relaxed">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: config.accent }} />
                {p}
              </li>
            ))}
          </ul>
        </div>
        <div
          className="rounded-xl p-3.5"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="text-xs font-bold mb-2.5 text-zinc-400">
            {card.right?.label}
          </div>
          <ul className="space-y-2">
            {card.right?.points?.map((p, i) => (
              <li key={i} className="text-xs text-zinc-300 flex gap-2 items-start leading-relaxed">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-zinc-500" />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// --- Fact Card ---
function FactCard({ card, config }) {
  return (
    <div className="flex gap-3 items-start">
      <Star size={16} style={{ color: config.accent }} className="flex-shrink-0 mt-0.5" />
      <div className="text-sm text-zinc-200 leading-relaxed">{card.text}</div>
    </div>
  );
}

const cardRenderers = {
  stat: StatCard,
  quote: QuoteCard,
  definition: DefinitionCard,
  insight: InsightCard,
  comparison: ComparisonCard,
  fact: FactCard,
};

export default function KnowledgeCardsView({ data }) {
  if (!data?.cards?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-12 h-12 rounded-full bg-teal-500/10 flex items-center justify-center">
          <Lightbulb size={22} className="text-teal-400" />
        </div>
        <p className="text-zinc-400 font-medium text-sm">No knowledge cards data available</p>
        <p className="text-zinc-600 text-xs">Generate this format to see visual knowledge cards</p>
      </div>
    );
  }

  return (
    <div className="py-8">
      {data.title && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-white">{data.title}</h2>
        </motion.div>
      )}

      <div className="columns-1 sm:columns-2 gap-5 space-y-5">
        {data.cards.map((card, index) => {
          const config = cardTypeConfig[card.type] || defaultConfig;
          const Renderer = cardRenderers[card.type] || FactCard;

          return (
            <motion.div
              key={card.id || index}
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.45, delay: index * 0.06, ease: [0.23, 1, 0.32, 1] }}
              whileHover={{
                y: -4,
                boxShadow: `0 8px 40px ${config.glow}, 0 0 0 1px ${config.border}`,
                transition: { duration: 0.25 },
              }}
              className="break-inside-avoid rounded-2xl p-6 relative overflow-hidden cursor-default"
              style={{
                background: 'linear-gradient(145deg, #131318 0%, #0e0e12 100%)',
                border: `1px solid ${config.border}`,
                boxShadow: `0 2px 16px ${config.glow}`,
              }}
            >
              <FloatingIcon config={config} />
              <div className="relative z-10">
                <div className="mb-4">
                  <TypeBadge config={config} />
                </div>
                <Renderer card={card} config={config} />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
