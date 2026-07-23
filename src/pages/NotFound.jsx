import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex min-h-[70vh] items-center justify-center">
      <div className="surface max-w-xl px-6 py-14 text-center md:px-10">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600 dark:text-brand-300">404</p>
        <h1 className="mt-4 text-4xl font-black text-slate-900 dark:text-white">Page not found</h1>
        <p className="mt-4 text-sm leading-6 text-slate-500 dark:text-slate-400">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link className="btn-primary mt-8" to="/dashboard">
          Back to Dashboard
        </Link>
      </div>
    </motion.div>
  );
}
