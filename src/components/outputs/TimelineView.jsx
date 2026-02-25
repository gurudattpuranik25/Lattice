import { motion } from 'framer-motion';

const significanceColors = {
  high: 'bg-indigo-500 border-indigo-400',
  medium: 'bg-emerald-500 border-emerald-400',
  low: 'bg-zinc-500 border-zinc-400',
};

export default function TimelineView({ data }) {
  if (!data?.events?.length) {
    return <div className="text-center text-zinc-500 py-20">No timeline data available.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h2 className="font-heading font-bold text-2xl text-white text-center mb-12">
        {data.title}
      </h2>

      <div className="relative">
        {/* Center line */}
        <div
          className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px md:-translate-x-px"
          style={{ background: 'linear-gradient(to bottom, transparent, #818CF8 20%, #818CF8 80%, transparent)' }}
        />

        <div className="space-y-12">
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
                  <div className="glass-card p-5">
                    <h3 className="font-heading font-semibold text-white mb-2">{event.title}</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">{event.description}</p>
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
