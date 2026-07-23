import { useState } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FiUploadCloud, FiFileText } from 'react-icons/fi';
import { importExcel } from '../services/api';

export default function ImportExcel() {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      toast.error('Please select an Excel file first.');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);

      const result = await importExcel(formData, (eventProgress) => {
        if (eventProgress.total) {
          setProgress(Math.round((eventProgress.loaded * 100) / eventProgress.total));
        }
      });

      toast.success(`Import Successful: ${result.inserted} inserted, ${result.updated} updated`);
      setFile(null);
      setProgress(0);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to import Excel file.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl space-y-5">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600 dark:text-brand-300">Inventory</p>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white">Import Backup</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Import a JSON backup exported from this app to restore products on this device.</p>
      </div>

      <form className="surface space-y-5 p-5 md:p-6" onSubmit={handleSubmit}>
        <label className="flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center transition hover:border-brand-400 hover:bg-brand-50/50 dark:border-slate-700 dark:bg-slate-950/50 dark:hover:bg-slate-900">
          <FiUploadCloud className="text-5xl text-brand-600" />
          <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">Select a backup file</h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Accepted format: .json</p>
          <input
            accept="application/json,.json"
            className="hidden"
            type="file"
            onChange={(event) => setFile(event.target.files?.[0] || null)}
          />
        </label>

        <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:bg-slate-950 dark:text-slate-300">
          {file ? (
            <div className="flex items-center gap-2">
              <FiFileText className="text-brand-600" />
              <span>{file.name}</span>
            </div>
          ) : (
            'No file selected yet.'
          )}
        </div>

        {progress > 0 ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
              <span>Upload Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
              <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-700 transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        ) : null}

        <button className="btn-primary" disabled={loading} type="submit">
          {loading ? 'Importing...' : 'Import Backup'}
        </button>
      </form>
    </motion.div>
  );
}
