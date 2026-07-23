import { FiInbox } from 'react-icons/fi';

export default function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white px-6 py-14 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-brand-50 text-4xl text-brand-700 dark:bg-slate-800 dark:text-brand-300">
        <FiInbox />
      </div>
      <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">{description}</p>
      {actionLabel ? (
        <button className="btn-primary mt-6" onClick={onAction} type="button">
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
