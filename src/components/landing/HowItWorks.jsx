import { motion } from 'framer-motion';
import { Upload, Sparkles, LayoutGrid } from 'lucide-react';

const steps = [
  {
    icon: Upload,
    title: '1. Drop Your Content',
    description: 'PDF, YouTube link, Word doc, article URL \u2014 just drop it in.',
    color: { bg: 'bg-cyan-500/10', text: 'text-cyan-400' },
  },
  {
    icon: Sparkles,
    title: '2. AI Processes It',
    description: 'Claude AI reads everything, extracts key concepts, maps relationships.',
    color: { bg: 'bg-violet-500/10', text: 'text-violet-400' },
  },
  {
    icon: LayoutGrid,
    title: '3. See It Visually',
    description: 'Get interactive mind maps, flashcards, timelines, knowledge cards, and more.',
    color: { bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="font-heading font-bold text-3xl md:text-4xl text-center mb-16"
        >
          How Lattice Works
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card glass-card-hover p-8 text-center"
            >
              <div className={`w-14 h-14 rounded-2xl ${step.color.bg} flex items-center justify-center mx-auto mb-5`}>
                <step.icon size={24} className={step.color.text} />
              </div>
              <h3 className="font-heading font-semibold text-xl mb-3 text-white">
                {step.title}
              </h3>
              <p className="text-zinc-400 leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
