import { motion } from 'framer-motion';

export default function Loading({ label = 'Loading data...' }) {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-slate-200 bg-white/70 p-8 text-slate-600 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.1, ease: 'linear' }}
        className="h-12 w-12 rounded-full border-4 border-brand-100 border-t-brand-700 dark:border-brand-950 dark:border-t-brand-400"
      />
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
}
