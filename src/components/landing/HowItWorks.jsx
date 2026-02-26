import React from 'react';
import { motion } from 'framer-motion';
import { Upload, Sparkles, LayoutGrid } from 'lucide-react';

const steps = [
  {
    icon: Upload,
    num: 1,
    title: 'Drop Your Content',
    description: 'PDF, YouTube link, Word doc, article URL — just drop it in.',
    gradient: 'from-cyan-400 to-cyan-600',
    color: { bg: 'bg-cyan-500/10', text: 'text-cyan-400' },
  },
  {
    icon: Sparkles,
    num: 2,
    title: 'AI Processes It',
    description: 'Claude AI reads everything, extracts key concepts, maps relationships.',
    gradient: 'from-violet-400 to-violet-600',
    color: { bg: 'bg-violet-500/10', text: 'text-violet-400' },
  },
  {
    icon: LayoutGrid,
    num: 3,
    title: 'See It Visually',
    description: 'Get interactive mind maps, flashcards, timelines, knowledge cards, and more.',
    gradient: 'from-emerald-400 to-emerald-600',
    color: { bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl text-center mb-10 sm:mb-16"
        >
          How Lattice Works
        </motion.h2>

        <div className="flex flex-col md:flex-row items-stretch gap-4 sm:gap-6">
          {steps.map((step, index) => (
            <React.Fragment key={step.title}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="glass-card glass-card-hover p-6 sm:p-8 text-center group flex-1"
              >
                {/* Numbered badge */}
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${step.gradient} flex items-center justify-center mx-auto mb-5 text-sm font-bold text-white`}>
                  {step.num}
                </div>

                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl ${step.color.bg} flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <step.icon size={28} className={`${step.color.text} group-hover:animate-pulse`} />
                </div>

                <h3 className="font-heading font-bold text-xl mb-3 text-white">
                  {step.title}
                </h3>
                <p className="text-zinc-400 leading-relaxed">{step.description}</p>
              </motion.div>

              {/* Connector line between cards */}
              {index < steps.length - 1 && (
                <div className="hidden md:flex items-center justify-center w-6 flex-shrink-0">
                  <div className="h-[2px] w-full" style={{
                    background: 'repeating-linear-gradient(90deg, rgba(129,140,248,0.3) 0, rgba(129,140,248,0.3) 6px, transparent 6px, transparent 12px)',
                    animation: 'dashMove 1.5s linear infinite',
                  }} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
