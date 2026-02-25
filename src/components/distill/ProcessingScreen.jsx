import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';
import { FORMAT_NAMES } from '../../services/prompts';

const steps = [
  { key: 'received', label: 'Content received' },
  { key: 'extracting', label: 'Extracting text...' },
  { key: 'processing', label: 'AI is reading...' },
  { key: 'building', label: 'Building your {format}...' },
  { key: 'done', label: 'Done!' },
];

export default function ProcessingScreen({ currentStep, format, error, onRetry }) {
  const stepIndex = steps.findIndex(s => s.key === currentStep);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-lg mx-auto py-20"
    >
      <h2 className="font-heading font-bold text-2xl text-white text-center mb-12">
        Processing your content
      </h2>

      <div className="space-y-6">
        {steps.map((step, index) => {
          const isCompleted = index < stepIndex || currentStep === 'done';
          const isActive = index === stepIndex && currentStep !== 'done';
          const isPending = index > stepIndex;

          const label = step.label.replace('{format}', FORMAT_NAMES[format] || format);

          return (
            <motion.div
              key={step.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="flex items-center gap-4"
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
                isCompleted
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : isActive
                  ? 'bg-indigo-500/20 text-indigo-400'
                  : 'bg-zinc-800 text-zinc-600'
              }`}>
                {isCompleted ? (
                  <Check size={16} />
                ) : isActive ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <span className="text-xs">{index + 1}</span>
                )}
              </div>
              <span className={`text-sm transition-colors duration-300 ${
                isCompleted ? 'text-emerald-400' : isActive ? 'text-white' : 'text-zinc-600'
              }`}>
                {label}
              </span>
            </motion.div>
          );
        })}
      </div>

      {currentStep === 'done' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          className="mt-8 text-center"
        >
          <div className="text-2xl mb-2">&#10024;</div>
          <p className="text-zinc-400 text-sm">Your visual summary is ready</p>
        </motion.div>
      )}

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-center"
          >
            <p className="text-red-400 text-sm mb-3">{error}</p>
            <button onClick={onRetry} className="btn-primary text-sm px-4 py-2">
              Try Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
