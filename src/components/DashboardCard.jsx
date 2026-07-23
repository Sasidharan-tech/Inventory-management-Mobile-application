import { motion } from 'framer-motion';

export default function DashboardCard({ title, value, icon, accent = 'from-indigo-500 to-indigo-700', subtitle }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      className="surface p-4 sm:p-5"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{title}</p>
          <h3 className="mt-1 text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">{value}</h3>
        </div>
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${accent} text-white shadow-md text-xl`}>
          {icon}
        </div>
      </div>
      {subtitle ? <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">{subtitle}</p> : null}
    </motion.div>
  );
}
