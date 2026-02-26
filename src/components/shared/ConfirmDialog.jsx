import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  description,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  variant = 'danger', // 'danger' | 'warning'
}) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="glass-card p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-start gap-4 mb-5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  variant === 'danger' ? 'bg-red-500/10' : 'bg-amber-500/10'
                }`}>
                  <AlertTriangle size={20} className={
                    variant === 'danger' ? 'text-red-400' : 'text-amber-400'
                  } />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-white text-lg mb-1">{title}</h3>
                  {description && (
                    <p className="text-sm text-zinc-400 leading-relaxed">{description}</p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <button onClick={onClose} className="btn-ghost text-sm px-4 py-2">
                  {cancelLabel}
                </button>
                <button
                  onClick={() => { onConfirm(); onClose(); }}
                  className={`text-sm font-medium px-4 py-2 rounded-xl transition-all duration-200 active:scale-95 ${
                    variant === 'danger'
                      ? 'bg-red-500/15 text-red-400 hover:bg-red-500/25'
                      : 'bg-amber-500/15 text-amber-400 hover:bg-amber-500/25'
                  }`}
                >
                  {confirmLabel}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
