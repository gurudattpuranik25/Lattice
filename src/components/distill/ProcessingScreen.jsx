import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2, AlertTriangle, RotateCcw, Sparkles } from 'lucide-react';
import { FORMAT_NAMES } from '../../services/prompts';

const steps = [
  { key: 'received', label: 'Content received', shortLabel: 'Received' },
  { key: 'extracting', label: 'Extracting text...', shortLabel: 'Extracting' },
  { key: 'processing', label: 'AI is analyzing your content...', shortLabel: 'Analyzing' },
  { key: 'building', label: 'Building your {format}...', shortLabel: 'Generating' },
  { key: 'done', label: 'Done!', shortLabel: 'Done' },
];

const funFacts = {
  pdf: [
    'PDFs were invented by Adobe in 1993 — your doc has been on quite a journey.',
    'The average person reads ~250 words per minute. AI? About 50,000.',
    'PDF stands for Portable Document Format — we\'re making it even more portable.',
    'The longest PDF ever created was over 1 million pages. Yours is a bit easier.',
  ],
  youtube: [
    '500 hours of video are uploaded to YouTube every minute.',
    'The first YouTube video was uploaded on April 23, 2005.',
    'YouTube\'s AI already generates captions — we\'re taking it a step further.',
    'Watching a 10-minute video takes 10 minutes. Reading a summary? About 30 seconds.',
  ],
  url: [
    'The first website ever created is still online at info.cern.ch.',
    'There are over 1.9 billion websites on the internet.',
    'The average web page takes 2.5 seconds to load. We read it even faster.',
    'Web articles average 1,200 words. Your summary will be much more focused.',
  ],
  docx: [
    'Microsoft Word was first released in 1983 — over 40 years of documents.',
    'The average business document is 4.5 pages long.',
    'DOCX files are actually ZIP archives containing XML files.',
    'Office documents account for over 80% of business content.',
  ],
  text: [
    'The English language has over 170,000 words in current use.',
    'Speed readers can process 1,000+ words per minute.',
    'The most common word in English is "the".',
    'Your brain processes text 60,000x faster when it\'s visual.',
  ],
};

const defaultFacts = [
  'Visual information is processed 60,000x faster than text.',
  'People remember 80% of what they see vs 20% of what they read.',
  'Mind maps were popularized by Tony Buzan in the 1970s.',
  'Spaced repetition with flashcards can improve retention by 200%.',
  'The best learning happens when information is chunked into small pieces.',
];

export default function ProcessingScreen({ currentStep, format, sourceType, error, onRetry }) {
  const stepIndex = steps.findIndex(s => s.key === currentStep);
  const [factIndex, setFactIndex] = useState(0);

  const facts = funFacts[sourceType] || defaultFacts;

  // Cycle fun facts every 4 seconds
  useEffect(() => {
    if (currentStep === 'done' || error) return;
    const interval = setInterval(() => {
      setFactIndex(prev => (prev + 1) % facts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [currentStep, error, facts.length]);

  // Progress percentage
  const progressPercent = currentStep === 'done' ? 100 : Math.min((stepIndex / (steps.length - 1)) * 100, 95);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-lg mx-auto py-16"
    >
      {/* Header */}
      <div className="text-center mb-10">
        <motion.div
          animate={{ rotate: currentStep === 'done' ? 0 : 360 }}
          transition={{ duration: 2, repeat: currentStep === 'done' ? 0 : Infinity, ease: 'linear' }}
          className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mx-auto mb-4"
        >
          {currentStep === 'done' ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Sparkles size={28} className="text-emerald-400" />
            </motion.div>
          ) : (
            <Loader2 size={28} className="text-indigo-400" />
          )}
        </motion.div>
        <h2 className="font-heading font-bold text-2xl text-white mb-1">
          {currentStep === 'done' ? 'All done!' : 'Transforming your content'}
        </h2>
        <p className="text-sm text-zinc-500">
          {currentStep === 'done'
            ? 'Your visual summary is ready'
            : `Creating your ${FORMAT_NAMES[format] || format}`
          }
        </p>
      </div>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {steps.filter(s => s.key !== 'received').map((step, i) => {
            const realIndex = i + 1;
            const isCompleted = realIndex < stepIndex || currentStep === 'done';
            const isActive = realIndex === stepIndex;
            return (
              <span
                key={step.key}
                className={`text-xs font-medium transition-colors duration-300 ${
                  isCompleted ? 'text-emerald-400' : isActive ? 'text-indigo-300' : 'text-zinc-600'
                }`}
              >
                {step.shortLabel}
              </span>
            );
          })}
        </div>
        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            initial={{ width: '0%' }}
            animate={{
              width: `${progressPercent}%`,
              backgroundColor: currentStep === 'done' ? '#34D399' : '#818CF8',
            }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Step list */}
      <div className="space-y-3 mb-8">
        {steps.map((step, index) => {
          const isCompleted = index < stepIndex || currentStep === 'done';
          const isActive = index === stepIndex && currentStep !== 'done';
          const isPending = index > stepIndex;
          const label = step.label.replace('{format}', FORMAT_NAMES[format] || format);

          if (isPending) return null;

          return (
            <motion.div
              key={step.key}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08, duration: 0.3 }}
              className="flex items-center gap-3"
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
                isCompleted
                  ? 'bg-emerald-500/15 text-emerald-400'
                  : isActive
                  ? 'bg-indigo-500/15 text-indigo-400'
                  : 'bg-zinc-800 text-zinc-600'
              }`}>
                {isCompleted ? (
                  <Check size={14} />
                ) : isActive ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <span className="text-xs">{index + 1}</span>
                )}
              </div>
              <span className={`text-sm transition-colors duration-300 ${
                isCompleted ? 'text-emerald-400/80' : isActive ? 'text-white' : 'text-zinc-600'
              }`}>
                {label}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Fun fact */}
      {currentStep !== 'done' && !error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-4 text-center"
        >
          <p className="text-xs text-zinc-500 mb-1 uppercase tracking-wider font-medium">Did you know?</p>
          <AnimatePresence mode="wait">
            <motion.p
              key={factIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="text-sm text-zinc-300"
            >
              {facts[factIndex]}
            </motion.p>
          </AnimatePresence>
        </motion.div>
      )}

      {/* Done state */}
      {currentStep === 'done' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="text-center glass-card p-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 300 }}
            className="text-3xl mb-2"
          >
            &#10024;
          </motion.div>
          <p className="text-zinc-300 text-sm">Redirecting you to your distill...</p>
        </motion.div>
      )}

      {/* Error state */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-8 glass-card p-5 border-red-500/20 text-center"
          >
            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle size={18} className="text-red-400" />
            </div>
            <p className="text-red-400 text-sm mb-1 font-medium">Something went wrong</p>
            <p className="text-zinc-500 text-xs mb-4">{error}</p>
            <button onClick={onRetry} className="btn-primary text-sm px-5 py-2 flex items-center gap-2 mx-auto">
              <RotateCcw size={14} />
              Try Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
