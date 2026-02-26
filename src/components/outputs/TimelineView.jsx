import { useState } from 'react';
import { motion } from 'framer-motion';
import { Minimize2, Maximize2 } from 'lucide-react';

const significanceColors = {
  high: 'bg-indigo-500 border-indigo-400',
  medium: 'bg-emerald-500 border-emerald-400',
  low: 'bg-zinc-500 border-zinc-400',
};

export default function TimelineView({ data }) {
  const [viewMode, setViewMode] = useState('expanded');

  if (!data?.events?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round">
            <line x1="3" y1="12" x2="21" y2="12" />
            <circle cx="7" cy="12" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="17" cy="12" r="2" />
          </svg>
        </div>
        <p className="text-zinc-400 font-medium text-sm">No timeline data available</p>
        <p className="text-zinc-600 text-xs">Generate this format to see your content as a timeline</p>
      </div>
    );
  }

  const isCondensed = viewMode === 'condensed';

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-heading font-bold text-2xl text-white">
          {data.title}
        </h2>
        <div className="flex items-center gap-1 bg-white/[0.04] border border-white/[0.06] rounded-lg p-0.5">
          <button
            onClick={() => setViewMode('condensed')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              isCondensed
                ? 'bg-indigo-500/20 text-indigo-300'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Minimize2 size={13} />
            Condensed
          </button>
          <button
            onClick={() => setViewMode('expanded')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              !isCondensed
                ? 'bg-indigo-500/20 text-indigo-300'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Maximize2 size={13} />
            Expanded
          </button>
        </div>
      </div>

      <div className="relative">
        {/* Center line */}
        <div
          className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px md:-translate-x-px"
          style={{ background: 'linear-gradient(to bottom, transparent, #818CF8 20%, #818CF8 80%, transparent)' }}
        />

        <div className={isCondensed ? 'space-y-4' : 'space-y-12'}>
          {data.events.map((event, index) => {
            const isLeft = index % 2 === 0;
            const dotColor = significanceColors[event.significance] || significanceColors.medium;

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: 0.1 }}
                layout
                className={`relative flex items-start gap-6 ${
                  isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                } flex-row`}
              >
                {/* Date - desktop */}
                <div className={`hidden md:block w-[calc(50%-24px)] ${isLeft ? 'text-right' : 'text-left'}`}>
                  <span className="text-sm font-mono text-zinc-400">{event.date}</span>
                </div>

                {/* Dot */}
                <div className={`relative z-10 w-3 h-3 rounded-full flex-shrink-0 mt-1.5 ${dotColor} border-2 md:mx-0 ml-[18px]`} />

                {/* Content card */}
                <div className={`flex-1 md:w-[calc(50%-24px)] md:flex-none`}>
                  <span className="md:hidden text-xs font-mono text-zinc-500 mb-1 block">{event.date}</span>
                  <div className={`glass-card ${isCondensed ? 'p-3' : 'p-5'}`}>
                    <h3 className={`font-heading font-semibold text-white ${isCondensed ? 'text-sm mb-0.5' : 'mb-2'}`}>{event.title}</h3>
                    {isCondensed ? (
                      <p className="text-xs text-zinc-500 leading-relaxed line-clamp-1">{event.description}</p>
                    ) : (
                      <p className="text-sm text-zinc-400 leading-relaxed">{event.description}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
