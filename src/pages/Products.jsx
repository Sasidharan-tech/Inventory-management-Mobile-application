import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import SearchBar from '../components/SearchBar';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import ProductTable from '../components/ProductTable';
import { confirmDelete } from '../components/ConfirmDialog';
import { deleteProduct, getProducts } from '../services/api';
import { useDebounce } from '../hooks/useDebounce';

export default function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  const debouncedSearch = useDebounce(search, 350);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const response = await getProducts({
          page: pagination.page,
          limit: pagination.limit,
          search: debouncedSearch,
          category,
          sortBy,
          sortOrder
        });

        setProducts(response.data || []);
        setPagination((current) => ({
          ...current,
          ...response.pagination
        }));
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Failed to load products.');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [debouncedSearch, category, sortBy, sortOrder, pagination.page, pagination.limit]);

  useEffect(() => {
    setPagination((current) => ({ ...current, page: 1 }));
  }, [debouncedSearch, category, sortBy, sortOrder]);

  const categories = Array.from(new Set(products.map((product) => product.category).filter(Boolean)));

  const handleDelete = async (product) => {
    const confirmed = await confirmDelete();
    if (!confirmed) return;

    try {
      await deleteProduct(product.id || product.product_id);
      toast.success('Product deleted successfully.');
      setProducts((current) => current.filter((item) => item.id !== product.id));
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to delete product.');
    }
  };

  if (loading) {
    return <Loading label="Loading products..." />;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Products</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Stored on local device memory</p>
        </div>
        <button className="btn-primary text-xs px-3.5 py-2.5 shadow-sm" onClick={() => navigate('/products/add')} type="button">
          + Add Product
        </button>
      </div>

      <SearchBar
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
        categories={categories}
      />

      {products.length ? (
        <>
          <ProductTable products={products} onEdit={(product) => navigate(`/products/edit/${product.id}`)} onDelete={handleDelete} />
          <div className="flex flex-col items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-white p-4 text-sm dark:border-slate-800 dark:bg-slate-900 md:flex-row">
            <p className="text-slate-500 dark:text-slate-400">
              Showing {(pagination.page - 1) * pagination.limit + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} products
            </p>
            <div className="flex items-center gap-2">
              <button
                className="btn-secondary"
                disabled={pagination.page <= 1}
                onClick={() => setPagination((current) => ({ ...current, page: current.page - 1 }))}
                type="button"
              >
                Previous
              </button>
              <span className="rounded-2xl bg-slate-100 px-4 py-3 font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                className="btn-secondary"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => setPagination((current) => ({ ...current, page: current.page + 1 }))}
                type="button"
              >
                Next
              </button>
            </div>
          </div>
        </>
      ) : (
        <EmptyState
          title="No Products Found"
          description="Click Add Product to create your first inventory item."
          actionLabel="Add Product"
          onAction={() => navigate('/products/add')}
        />
      )}
    </motion.div>
  );
}
