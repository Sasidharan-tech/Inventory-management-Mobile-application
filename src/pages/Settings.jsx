import { useContext } from 'react';
import { motion } from 'framer-motion';
import { FiMoon, FiSun, FiMonitor } from 'react-icons/fi';
import { ThemeContext } from '../context/ThemeContext';

export default function Settings() {
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-4xl space-y-5">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600 dark:text-brand-300">Application</p>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white">Settings</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Tune the interface for light or dark mode and review device storage details.</p>
      </div>

      <div className="surface grid gap-5 p-5 md:grid-cols-2 md:p-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Theme</h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Toggle between light and dark mode for comfortable day or night use.</p>
        </div>
        <div className="flex items-center justify-start md:justify-end">
          <button className="btn-primary" onClick={toggleTheme} type="button">
            {darkMode ? <FiSun /> : <FiMoon />}
            {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          </button>
        </div>
      </div>

      <div className="surface p-5 md:p-6">
        <div className="flex items-center gap-3 text-brand-700 dark:text-brand-300">
          <FiMonitor className="text-2xl" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Android Ready</h3>
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
          This interface uses touch-friendly controls, compact spacing, and local device storage so it can run cleanly inside an Android WebView.
        </p>
      </div>
    </motion.div>
  );
}
