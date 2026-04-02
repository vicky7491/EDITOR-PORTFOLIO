import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title       = 'Are you sure?',
  description = 'This action cannot be undone.',
  confirmLabel = 'Delete',
  cancelLabel  = 'Cancel',
  variant      = 'danger',
  isLoading    = false,
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.2 }}
            className="relative glass-card border border-white/10 p-6
                       w-full max-w-sm shadow-2xl shadow-black/50"
          >
            {/* Warning icon */}
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4
              ${variant === 'danger' ? 'bg-red-500/10' : 'bg-amber-500/10'}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   strokeWidth={1.5} className={`w-6 h-6
                   ${variant === 'danger' ? 'text-red-400' : 'text-amber-400'}`}>
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0
                         1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
                      strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="12" y1="9" x2="12" y2="13"
                      strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="12" y1="17" x2="12.01" y2="17"
                      strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            <h3 className="text-base font-semibold text-slate-100 mb-2">{title}</h3>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">{description}</p>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={isLoading}
                className="btn-secondary flex-1"
              >
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className={`flex-1 inline-flex items-center justify-center gap-2
                  px-4 py-2.5 rounded-lg text-sm font-medium transition-all
                  duration-200 active:scale-[0.98] disabled:opacity-50
                  ${variant === 'danger'
                    ? 'bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/20'
                    : 'btn-primary'}`}
              >
                {isLoading ? (
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor"
                            strokeWidth={2} className="opacity-25"/>
                    <path d="M4 12a8 8 0 0 1 8-8" stroke="currentColor"
                          strokeWidth={2} strokeLinecap="round"/>
                  </svg>
                ) : confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;