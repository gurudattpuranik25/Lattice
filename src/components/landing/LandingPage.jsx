import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { usePageTitle } from '../../hooks/usePageTitle';
import Navbar from '../shared/Navbar';
import HeroSection from './HeroSection';
import HowItWorks from './HowItWorks';
import FormatShowcase from './FormatShowcase';
import StatsSection from './StatsSection';
import LandingFooter from './LandingFooter';

const inputCycles = [
  { type: 'PDF', label: 'research-paper.pdf', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
  { type: 'YouTube', label: 'youtube.com/watch?v=...', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
  { type: 'Article', label: 'https://blog.example.com/ai', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
];

const outputCycles = [
  { type: 'Mind Map', color: 'text-indigo-400' },
  { type: 'Flashcards', color: 'text-purple-400' },
  { type: 'Timeline', color: 'text-amber-400' },
];

function MiniMindMap() {
  return (
    <svg width="120" height="80" viewBox="0 0 120 80" className="text-indigo-400">
      <motion.circle cx="60" cy="40" r="6" fill="currentColor" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }} />
      <motion.line x1="60" y1="40" x2="25" y2="15" stroke="currentColor" strokeWidth="1.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.4, duration: 0.3 }} />
      <motion.line x1="60" y1="40" x2="95" y2="15" stroke="currentColor" strokeWidth="1.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5, duration: 0.3 }} />
      <motion.line x1="60" y1="40" x2="25" y2="65" stroke="currentColor" strokeWidth="1.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.6, duration: 0.3 }} />
      <motion.line x1="60" y1="40" x2="95" y2="65" stroke="currentColor" strokeWidth="1.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.7, duration: 0.3 }} />
      <motion.circle cx="25" cy="15" r="4" fill="currentColor" opacity="0.7" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 }} />
      <motion.circle cx="95" cy="15" r="4" fill="currentColor" opacity="0.7" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.6 }} />
      <motion.circle cx="25" cy="65" r="4" fill="currentColor" opacity="0.7" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.7 }} />
      <motion.circle cx="95" cy="65" r="4" fill="currentColor" opacity="0.7" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8 }} />
    </svg>
  );
}

function MiniFlashcards() {
  return (
    <div className="flex gap-2 items-center justify-center">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10, rotateY: 90 }}
          animate={{ opacity: 1 - i * 0.2, y: 0, rotateY: 0 }}
          transition={{ delay: 0.2 + i * 0.15 }}
          className="w-14 h-20 rounded-lg border border-purple-500/30 bg-purple-500/10 flex items-center justify-center"
        >
          <span className="text-purple-400 text-[10px] font-mono">Q&A</span>
        </motion.div>
      ))}
    </div>
  );
}

function MiniTimeline() {
  return (
    <svg width="120" height="80" viewBox="0 0 120 80" className="text-amber-400">
      <motion.line x1="10" y1="40" x2="110" y2="40" stroke="currentColor" strokeWidth="1.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4 }} />
      {[25, 50, 75, 100].map((x, i) => (
        <motion.g key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.15 }}>
          <circle cx={x} cy={40} r={4} fill="currentColor" />
          <rect x={x - 8} y={18} width={16} height={10} rx={2} fill="currentColor" opacity="0.3" />
        </motion.g>
      ))}
    </svg>
  );
}

const outputPreviews = [MiniMindMap, MiniFlashcards, MiniTimeline];

function TypewriterText({ text, className }) {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    setDisplayed('');
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 40);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <span className={className}>
      {displayed}
      <span className="animate-pulse">|</span>
    </span>
  );
}

function DemoSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % inputCycles.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const input = inputCycles[activeIndex];
  const output = outputCycles[activeIndex];
  const OutputPreview = outputPreviews[activeIndex];

  return (
    <section className="pb-16 sm:pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-zinc-500 mb-6 font-medium tracking-wide uppercase"
        >
          See the magic in action
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="glass-card rounded-2xl overflow-hidden"
        >
          <div className="border-b border-white/5 px-4 py-3 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
            <span className="ml-3 text-xs text-zinc-500 font-mono">lattice</span>
          </div>

          <div className="p-5 sm:p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-6">
              {/* Input side */}
              <div className="flex-1 w-full">
                <div className="text-xs text-zinc-500 mb-3 font-mono uppercase tracking-wider">Input</div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.3 }}
                    className={`glass-card p-5 rounded-xl border ${input.bg}`}
                  >
                    <div className={`text-xs font-semibold mb-2 ${input.color}`}>{input.type}</div>
                    <div className="font-mono text-sm text-zinc-300">
                      <TypewriterText text={input.label} />
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Arrow with sparkle */}
              <div className="flex-shrink-0 flex flex-col items-center gap-1">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles size={18} className="text-indigo-400" />
                </motion.div>
                <ArrowRight size={20} className="text-zinc-600 hidden md:block" />
                <div className="md:hidden w-[2px] h-6 bg-zinc-700 rounded-full" />
              </div>

              {/* Output side */}
              <div className="flex-1 w-full">
                <div className="text-xs text-zinc-500 mb-3 font-mono uppercase tracking-wider">Output</div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.3 }}
                    className="glass-card p-5 rounded-xl min-h-[100px] flex flex-col items-center justify-center"
                  >
                    <div className={`text-xs font-semibold mb-3 ${output.color}`}>{output.type}</div>
                    <OutputPreview />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Cycle indicators */}
            <div className="flex justify-center gap-2 mt-8">
              {inputCycles.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === activeIndex ? 'bg-indigo-400 w-6' : 'bg-zinc-700 hover:bg-zinc-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FloatingDot({ className, delay = 0 }) {
  return (
    <motion.div
      className={`absolute w-1.5 h-1.5 rounded-full bg-indigo-400/30 ${className}`}
      animate={{ y: [0, -8, 0], opacity: [0.3, 0.6, 0.3] }}
      transition={{ duration: 3, delay, repeat: Infinity }}
    />
  );
}

export default function LandingPage() {
  const { user, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  usePageTitle();

  const handleGetStarted = async () => {
    if (user) {
      navigate('/dashboard');
    } else {
      try {
        await signInWithGoogle();
        navigate('/dashboard');
      } catch (err) {
        console.error('Sign in failed:', err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />
      <HeroSection />
      <DemoSection />
      <HowItWorks />
      <FormatShowcase />
      <StatsSection />

      {/* Final CTA Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="gradient-border glass-card p-8 sm:p-12 md:p-16 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-indigo-500/5 pointer-events-none" />

            {/* Floating decorative dots */}
            <FloatingDot className="top-6 left-8" delay={0} />
            <FloatingDot className="top-10 right-12" delay={0.5} />
            <FloatingDot className="bottom-8 left-16" delay={1} />
            <FloatingDot className="bottom-12 right-8" delay={1.5} />
            <FloatingDot className="top-1/2 left-6" delay={0.8} />
            <FloatingDot className="top-1/3 right-6" delay={1.2} />

            <div className="relative z-10">
              <h2 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl mb-4">
                Start understanding faster
              </h2>
              <p className="text-zinc-400 text-base sm:text-lg mb-6 sm:mb-8">
                Your next PDF, lecture, or article is waiting to be distilled.
              </p>
              <button
                onClick={handleGetStarted}
                className="btn-primary shimmer-btn text-base sm:text-lg px-8 sm:px-12 py-3 sm:py-4 mb-4"
              >
                Get Started Free
              </button>
              <p className="text-zinc-500 text-sm">
                Join learners transforming how they study
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
