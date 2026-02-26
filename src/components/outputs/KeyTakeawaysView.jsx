import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Zap } from 'lucide-react';

const importanceColor = {
  1: 'bg-emerald-400',
  2: 'bg-amber-400',
  3: 'bg-rose-400',
};

function ImportanceDots({ importance }) {
  const activeColor = importanceColor[importance] || 'bg-indigo-400';
  return (
    <div className="flex gap-1">
      {[1, 2, 3].map(level => (
        <div
          key={level}
          className={`w-1.5 h-4 rounded-full ${
            level <= importance ? activeColor : 'bg-zinc-800'
          }`}
        />
      ))}
    </div>
  );
}

export default function KeyTakeawaysView({ data }) {
  const [expanded, setExpanded] = useState({});

  if (!data?.takeaways?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center">
          <Zap size={22} className="text-rose-400" />
        </div>
        <p className="text-zinc-400 font-medium text-sm">No takeaway data available</p>
        <p className="text-zinc-600 text-xs">Generate this format to extract key takeaways</p>
      </div>
    );
  }

  const sorted = [...data.takeaways].sort((a, b) => b.importance - a.importance);

  return (
    <div className="max-w-2xl mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="font-heading font-bold text-2xl text-white mb-1">{data.title}</h2>
        <p className="text-sm text-zinc-500">
          {sorted.length} key takeaways &middot; Scannable in 60 seconds
        </p>
      </motion.div>

      <div className="space-y-3">
        {sorted.map((takeaway, index) => (
          <motion.div
            key={takeaway.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            className="glass-card overflow-hidden"
          >
            <button
              onClick={() => setExpanded(prev => ({ ...prev, [takeaway.id]: !prev[takeaway.id] }))}
              className="w-full p-5 flex items-start gap-4 text-left hover:bg-white/[0.02] transition-colors"
            >
              <ImportanceDots importance={takeaway.importance} />
              <p className="flex-1 text-white text-sm leading-relaxed font-medium">
                {takeaway.text}
              </p>
              <ChevronDown
                size={16}
                className={`text-zinc-500 flex-shrink-0 mt-0.5 transition-transform duration-200 ${
                  expanded[takeaway.id] ? 'rotate-180' : ''
                }`}
              />
            </button>

            <AnimatePresence>
              {expanded[takeaway.id] && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 pl-[52px]">
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      {takeaway.explanation}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {data.oneSentenceSummary && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 sm:mt-10 glass-card p-5 sm:p-8 text-center"
        >
          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">One-Sentence Summary</p>
          <p className="text-lg text-zinc-200 italic leading-relaxed">
            {data.oneSentenceSummary}
          </p>
        </motion.div>
      )}
    </div>
  );
}
