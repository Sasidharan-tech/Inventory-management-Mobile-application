import { useState } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FiDownload } from 'react-icons/fi';
import { exportExcel } from '../services/api';
import { downloadBlob } from '../utils/helpers';

export default function ExportExcel() {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    try {
      setLoading(true);
      const blob = await exportExcel();
      downloadBlob(blob, 'Inventory.xlsx');
      toast.success('Export Successful');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to export inventory.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl space-y-5">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600 dark:text-brand-300">Inventory</p>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white">Export Backup</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Download a JSON backup of the products stored on this device.</p>
      </div>

      <div className="surface flex flex-col items-start gap-5 p-5 md:p-6">
        <div className="rounded-3xl bg-brand-50 p-5 text-brand-800 dark:bg-slate-900 dark:text-brand-300">
          <FiDownload className="text-4xl" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">inventory-backup.json</h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Includes product ID, image data, name, category, price, quantity, and description fields.</p>
        </div>
        <button className="btn-primary" disabled={loading} onClick={handleExport} type="button">
          {loading ? 'Exporting...' : 'Export Backup'}
        </button>
      </div>
    </motion.div>
  );
}
