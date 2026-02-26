import { motion } from 'framer-motion';
import { Lightbulb, Quote, BookOpen, Brain, ArrowLeftRight, Sparkles } from 'lucide-react';

const cardTypeConfig = {
  stat: {
    accent: '#6366F1',
    accentSoft: 'rgba(99,102,241,0.12)',
    icon: Sparkles,
    span: 'col-span-1',
  },
  quote: {
    accent: '#F472B6',
    accentSoft: 'rgba(244,114,182,0.12)',
    icon: Quote,
    span: 'col-span-1 sm:col-span-2',
  },
  definition: {
    accent: '#34D399',
    accentSoft: 'rgba(52,211,153,0.12)',
    icon: BookOpen,
    span: 'col-span-1',
  },
  insight: {
    accent: '#38BDF8',
    accentSoft: 'rgba(56,189,248,0.12)',
    icon: Brain,
    span: 'col-span-1 sm:col-span-2',
  },
  comparison: {
    accent: '#FB923C',
    accentSoft: 'rgba(251,146,60,0.12)',
    icon: ArrowLeftRight,
    span: 'col-span-1 sm:col-span-2',
  },
  fact: {
    accent: '#A78BFA',
    accentSoft: 'rgba(167,139,250,0.12)',
    icon: Lightbulb,
    span: 'col-span-1',
  },
};

const defaultConfig = cardTypeConfig.fact;

function StatCard({ card, config }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-4">
      <div style={{ color: config.accent }} className="text-4xl sm:text-5xl font-bold font-heading mb-2">
        {card.value}
      </div>
      <div className="text-sm text-zinc-400">{card.label}</div>
    </div>
  );
}

function QuoteCard({ card, config }) {
  return (
    <div className="flex gap-3">
      <div className="w-1 rounded-full flex-shrink-0" style={{ background: config.accent }} />
      <div>
        <p className="text-zinc-200 italic text-base leading-relaxed">
          &ldquo;{card.text}&rdquo;
        </p>
        {card.attribution && (
          <p className="text-xs mt-2" style={{ color: config.accent }}>
            &mdash; {card.attribution}
          </p>
        )}
      </div>
    </div>
  );
}

function DefinitionCard({ card, config }) {
  return (
    <div>
      <div className="text-base font-bold text-white mb-1.5">{card.term}</div>
      <div className="text-sm text-zinc-400 leading-relaxed rounded-lg p-2.5"
        style={{ background: config.accentSoft }}>
        {card.explanation}
      </div>
    </div>
  );
}

function InsightCard({ card, config }) {
  const Icon = config.icon;
  return (
    <div className="flex gap-3 items-start">
      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: config.accentSoft }}>
        <Icon size={18} style={{ color: config.accent }} />
      </div>
      <div>
        <div className="text-sm font-semibold text-white mb-1">{card.title}</div>
        <div className="text-sm text-zinc-400 leading-relaxed">{card.description}</div>
      </div>
    </div>
  );
}

function ComparisonCard({ card, config }) {
  return (
    <div>
      <div className="text-sm font-semibold text-white mb-3">{card.title}</div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg p-3" style={{ background: config.accentSoft }}>
          <div className="text-xs font-bold mb-2" style={{ color: config.accent }}>
            {card.left?.label}
          </div>
          <ul className="space-y-1">
            {card.left?.points?.map((p, i) => (
              <li key={i} className="text-xs text-zinc-300 flex gap-1.5">
                <span style={{ color: config.accent }}>&#8226;</span> {p}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg p-3 bg-white/[0.04]">
          <div className="text-xs font-bold mb-2 text-zinc-300">
            {card.right?.label}
          </div>
          <ul className="space-y-1">
            {card.right?.points?.map((p, i) => (
              <li key={i} className="text-xs text-zinc-300 flex gap-1.5">
                <span className="text-zinc-500">&#8226;</span> {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function FactCard({ card, config }) {
  return (
    <div className="rounded-lg p-3" style={{ background: config.accentSoft }}>
      <div className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: config.accent }}>
        Did you know?
      </div>
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
    <div>
      {data.title && (
        <h2 className="font-heading font-bold text-2xl text-white mb-6">{data.title}</h2>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.cards.map((card, index) => {
          const config = cardTypeConfig[card.type] || defaultConfig;
          const Renderer = cardRenderers[card.type] || FactCard;
          const spanClass = config.span || 'col-span-1';

          return (
            <motion.div
              key={card.id || index}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              className={`${spanClass} rounded-2xl border border-white/[0.06] p-5`}
              style={{
                background: '#111116',
                borderTop: `2px solid ${config.accent}`,
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <config.icon size={14} style={{ color: config.accent }} />
                <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: config.accent }}>
                  {card.type}
                </span>
              </div>
              <Renderer card={card} config={config} />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
