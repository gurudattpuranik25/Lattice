import { motion } from 'framer-motion';
import { Lightbulb, Quote, BookOpen, Brain, ArrowLeftRight, Sparkles } from 'lucide-react';

const cardTypeConfig = {
  stat: {
    gradient: 'linear-gradient(135deg, #6366F1 0%, #818CF8 100%)',
    accent: '#818CF8',
    accentSoft: 'rgba(99,102,241,0.10)',
    border: 'rgba(129,140,248,0.25)',
    icon: Sparkles,
    label: 'Statistic',
  },
  quote: {
    gradient: 'linear-gradient(135deg, #DB2777 0%, #F472B6 100%)',
    accent: '#F472B6',
    accentSoft: 'rgba(244,114,182,0.10)',
    border: 'rgba(244,114,182,0.25)',
    icon: Quote,
    label: 'Quote',
  },
  definition: {
    gradient: 'linear-gradient(135deg, #059669 0%, #34D399 100%)',
    accent: '#34D399',
    accentSoft: 'rgba(52,211,153,0.10)',
    border: 'rgba(52,211,153,0.25)',
    icon: BookOpen,
    label: 'Definition',
  },
  insight: {
    gradient: 'linear-gradient(135deg, #0284C7 0%, #38BDF8 100%)',
    accent: '#38BDF8',
    accentSoft: 'rgba(56,189,248,0.10)',
    border: 'rgba(56,189,248,0.25)',
    icon: Brain,
    label: 'Insight',
  },
  comparison: {
    gradient: 'linear-gradient(135deg, #EA580C 0%, #FB923C 100%)',
    accent: '#FB923C',
    accentSoft: 'rgba(251,146,60,0.10)',
    border: 'rgba(251,146,60,0.25)',
    icon: ArrowLeftRight,
    label: 'Comparison',
  },
  fact: {
    gradient: 'linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)',
    accent: '#A78BFA',
    accentSoft: 'rgba(167,139,250,0.10)',
    border: 'rgba(167,139,250,0.25)',
    icon: Lightbulb,
    label: 'Fact',
  },
};

const defaultConfig = cardTypeConfig.fact;

// --- Card type badge ---
function TypeBadge({ config }) {
  const Icon = config.icon;
  return (
    <div
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
      style={{ background: config.accentSoft, color: config.accent, border: `1px solid ${config.border}` }}
    >
      <Icon size={12} />
      {config.label}
    </div>
  );
}

// --- Stat Card: big bold number with gradient ---
function StatCard({ card, config }) {
  return (
    <div className="text-center py-2">
      <div
        className="text-5xl font-extrabold font-heading mb-2"
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

// --- Quote Card: elegant left-border ---
function QuoteCard({ card, config }) {
  return (
    <div className="flex gap-4">
      <div className="w-1 rounded-full flex-shrink-0" style={{ background: config.gradient }} />
      <div>
        <p className="text-zinc-200 italic text-[15px] leading-relaxed">
          &ldquo;{card.text}&rdquo;
        </p>
        {card.attribution && (
          <p className="text-xs font-semibold mt-2.5" style={{ color: config.accent }}>
            &mdash; {card.attribution}
          </p>
        )}
      </div>
    </div>
  );
}

// --- Definition Card: term + explanation ---
function DefinitionCard({ card, config }) {
  return (
    <div>
      <div
        className="text-lg font-bold mb-2"
        style={{ color: config.accent }}
      >
        {card.term}
      </div>
      <div className="text-sm text-zinc-300 leading-relaxed">
        {card.explanation}
      </div>
    </div>
  );
}

// --- Insight Card: icon + content ---
function InsightCard({ card, config }) {
  return (
    <div>
      <div className="text-[15px] font-semibold text-white mb-2">{card.title}</div>
      <div className="text-sm text-zinc-400 leading-relaxed">{card.description}</div>
    </div>
  );
}

// --- Comparison Card: side-by-side ---
function ComparisonCard({ card, config }) {
  return (
    <div>
      <div className="text-[15px] font-semibold text-white mb-3">{card.title}</div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl p-3.5" style={{ background: config.accentSoft, border: `1px solid ${config.border}` }}>
          <div className="text-xs font-bold mb-2" style={{ color: config.accent }}>
            {card.left?.label}
          </div>
          <ul className="space-y-1.5">
            {card.left?.points?.map((p, i) => (
              <li key={i} className="text-xs text-zinc-300 flex gap-1.5 items-start">
                <span className="mt-1 w-1 h-1 rounded-full flex-shrink-0" style={{ background: config.accent }} />
                {p}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl p-3.5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="text-xs font-bold mb-2 text-zinc-300">
            {card.right?.label}
          </div>
          <ul className="space-y-1.5">
            {card.right?.points?.map((p, i) => (
              <li key={i} className="text-xs text-zinc-300 flex gap-1.5 items-start">
                <span className="mt-1 w-1 h-1 rounded-full flex-shrink-0 bg-zinc-500" />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// --- Fact Card: fun nugget ---
function FactCard({ card, config }) {
  return (
    <div>
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
    return <div className="text-center text-zinc-500 py-20">No knowledge cards data available.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      {data.title && (
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-heading font-bold text-2xl sm:text-3xl text-white mb-8 text-center"
        >
          {data.title}
        </motion.h2>
      )}

      <div className="columns-1 sm:columns-2 gap-4 space-y-4">
        {data.cards.map((card, index) => {
          const config = cardTypeConfig[card.type] || defaultConfig;
          const Renderer = cardRenderers[card.type] || FactCard;

          return (
            <motion.div
              key={card.id || index}
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="break-inside-avoid rounded-2xl p-5 overflow-hidden"
              style={{
                background: '#111116',
                border: `1px solid ${config.border}`,
                boxShadow: `0 4px 24px ${config.accentSoft}`,
              }}
            >
              <div className="mb-3">
                <TypeBadge config={config} />
              </div>
              <Renderer card={card} config={config} />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
