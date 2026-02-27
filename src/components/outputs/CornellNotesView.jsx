import { motion } from 'framer-motion';

const categoryStyles = {
  definition: { border: 'border-l-indigo-500', badge: 'bg-indigo-500/15 text-indigo-400', label: 'Definition' },
  concept:    { border: 'border-l-violet-500', badge: 'bg-violet-500/15 text-violet-400', label: 'Concept' },
  example:    { border: 'border-l-emerald-500', badge: 'bg-emerald-500/15 text-emerald-400', label: 'Example' },
  formula:    { border: 'border-l-amber-500', badge: 'bg-amber-500/15 text-amber-400', label: 'Formula' },
  fact:       { border: 'border-l-rose-500', badge: 'bg-rose-500/15 text-rose-400', label: 'Fact' },
};

export default function CornellNotesView({ data }) {
  if (!data?.cues?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#818CF8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="2" width="16" height="20" rx="2" />
            <line x1="8" y1="6" x2="16" y2="6" />
            <line x1="8" y1="10" x2="16" y2="10" />
            <line x1="8" y1="14" x2="12" y2="14" />
          </svg>
        </div>
        <p className="text-zinc-400 font-medium text-sm">No Cornell Notes data available</p>
        <p className="text-zinc-600 text-xs">Generate this format to see your content as Cornell Notes</p>
      </div>
    );
  }

  const cues = data.cues || [];
  const cat = (c) => categoryStyles[c] || categoryStyles.concept;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-baseline justify-between gap-4 flex-wrap"
      >
        <h2 className="font-heading font-bold text-xl sm:text-2xl text-white">
          {data.title}
        </h2>
        <span className="text-xs text-zinc-500 font-medium whitespace-nowrap">
          {cues.length} notes
        </span>
      </motion.div>

      {/* One-liner */}
      {data.oneLiner && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-sm text-zinc-400 leading-relaxed -mt-2"
        >
          {data.oneLiner}
        </motion.p>
      )}

      {/* Cue-Note Cards */}
      <div className="space-y-3">
        {cues.map((cue, index) => {
          const style = cat(cue.category);
          return (
            <motion.div
              key={cue.id || index}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.08 * index }}
              className={`glass-card border-l-[3px] ${style.border} overflow-hidden`}
            >
              <div className="flex flex-col sm:flex-row">
                {/* Cue / keyword side */}
                <div className="sm:w-[180px] lg:w-[220px] flex-shrink-0 px-4 py-3 sm:py-4 sm:border-r border-b sm:border-b-0 border-white/5 bg-white/[0.015] flex flex-col gap-2 justify-center">
                  <span className="font-heading font-semibold text-sm text-white leading-snug">
                    {cue.keyword}
                  </span>
                  <span className={`text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded w-fit ${style.badge}`}>
                    {style.label}
                  </span>
                </div>

                {/* Notes side */}
                <div className="flex-1 px-4 py-3 sm:py-4">
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    {cue.notes}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Summary Footer */}
      {data.summary && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 * cues.length + 0.1 }}
          className="glass-card p-4 sm:p-5 mt-2"
        >
          <div className="text-[10px] font-medium uppercase tracking-wider text-zinc-500 mb-2">
            Summary
          </div>
          <p className="text-sm text-zinc-300 leading-relaxed">
            {data.summary}
          </p>
        </motion.div>
      )}
    </div>
  );
}
