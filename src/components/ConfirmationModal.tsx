import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  icon?: LucideIcon;
  variant?: 'danger' | 'warning' | 'info';
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  icon: Icon,
  variant = 'danger',
}) => {
  // Styles based on variant
  const iconBgColors = {
    danger: 'bg-rose-100 dark:bg-rose-500/20',
    warning: 'bg-amber-100 dark:bg-amber-500/20',
    info: 'bg-indigo-100 dark:bg-indigo-500/20',
  };

  const iconColors = {
    danger: 'text-rose-600 dark:text-rose-400',
    warning: 'text-amber-600 dark:text-amber-400',
    info: 'text-indigo-600 dark:text-indigo-400',
  };

  const buttonColors = {
    danger: 'bg-rose-600 hover:bg-rose-500 dark:bg-rose-500 dark:hover:bg-rose-400 shadow-rose-500/20',
    warning: 'bg-amber-600 hover:bg-amber-500 dark:bg-amber-500 dark:hover:bg-amber-400 shadow-amber-500/20',
    info: 'bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 shadow-indigo-500/20',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center px-4 sm:px-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-100/50 bg-white/95 p-8 shadow-2xl backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-900/95"
          >
            <div className="flex flex-col items-center text-center">
              {Icon && (
                <div className={`mb-5 flex h-16 w-16 items-center justify-center rounded-2xl ${iconBgColors[variant]}`}>
                  <Icon className={`h-8 w-8 ${iconColors[variant]}`} />
                </div>
              )}

              <h3 className="mb-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {title}
              </h3>

              <p className="mb-8 text-base leading-relaxed text-slate-500 dark:text-slate-400">
                {description}
              </p>

              <div className="flex w-full flex-col-reverse space-y-3 space-y-reverse sm:flex-row sm:space-x-3 sm:space-y-0">
                <button
                  onClick={onClose}
                  className="flex-1 rounded-xl bg-slate-100/80 py-3.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-200 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  className={`flex-1 rounded-xl py-3.5 text-sm font-semibold text-white shadow-lg transition-colors ${buttonColors[variant]}`}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
