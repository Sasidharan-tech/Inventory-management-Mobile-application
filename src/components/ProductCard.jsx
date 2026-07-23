import { FiEdit2, FiTrash2, FiTag, FiBox, FiClock, FiCheckCircle, FiAlertTriangle, FiXCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { formatCurrency, formatDate, getImageUrl } from '../utils/helpers';

export default function ProductCard({ product, onEdit, onDelete, showActions = true }) {
  const imageUrl = getImageUrl(product.image);
  const qty = Number(product.quantity || 0);

  const getStockBadge = () => {
    if (qty <= 0) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-bold text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
          <FiXCircle className="text-xs" /> Out of stock
        </span>
      );
    }
    if (qty < 10) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
          <FiAlertTriangle className="text-xs" /> Low ({qty} left)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
        <FiCheckCircle className="text-xs" /> {qty} in stock
      </span>
    );
  };

  return (
    <motion.article
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      className="surface overflow-hidden hover:border-indigo-300 dark:hover:border-indigo-800"
    >
      <div className="p-4 sm:p-5 space-y-3.5">
        {/* Top Header Row: Category Pill & Stock Status */}
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300">
            <FiTag className="text-xs" /> {product.category || 'General'}
          </span>
          {getStockBadge()}
        </div>

        {/* Middle Main Content Row: Image + Details */}
        <div className="flex items-start gap-3.5">
          {/* Thumbnail / Dynamic Gradient Placeholder */}
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-800">
            {imageUrl ? (
              <img src={imageUrl} alt={product.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-indigo-500/10 to-sky-500/10 text-indigo-600 dark:from-indigo-500/20 dark:to-sky-500/20 dark:text-indigo-400">
                <FiBox className="text-2xl" />
                <span className="mt-0.5 text-[9px] font-bold uppercase tracking-wider opacity-75">Product</span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="min-w-0 flex-1 space-y-1">
            <h3 className="truncate text-base font-extrabold text-slate-900 dark:text-white">
              {product.name}
            </h3>
            <p className="text-lg font-black text-indigo-600 dark:text-indigo-400">
              {formatCurrency(product.price)}
            </p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-mono text-[11px] bg-slate-100 dark:bg-slate-900 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400">
                ID: {product.product_id || product.id}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px]">
                <FiClock className="text-[10px]" /> {formatDate(product.updated_at || product.created_at)}
              </span>
            </div>
          </div>
        </div>

        {/* Description (if present) */}
        {product.description ? (
          <p className="line-clamp-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400 bg-slate-50/70 dark:bg-slate-900/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/60">
            {product.description}
          </p>
        ) : null}

        {/* Actions Footer */}
        {showActions ? (
          <div className="flex items-center gap-2 pt-1">
            <button
              className="btn-secondary flex-1 py-2 text-xs font-bold"
              onClick={() => onEdit(product)}
              type="button"
            >
              <FiEdit2 className="text-xs" /> Edit
            </button>
            <button
              className="btn-danger flex-1 py-2 text-xs font-bold"
              onClick={() => onDelete(product)}
              type="button"
            >
              <FiTrash2 className="text-xs" /> Delete
            </button>
          </div>
        ) : null}
      </div>
    </motion.article>
  );
}
