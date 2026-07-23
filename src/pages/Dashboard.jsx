import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiBox, FiDollarSign, FiLayers, FiAlertTriangle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import DashboardCard from '../components/DashboardCard';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import { getDashboard, getProducts } from '../services/api';
import { formatCurrency } from '../utils/helpers';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const [dashboardResponse, productsResponse] = await Promise.all([
          getDashboard(),
          getProducts({ page: 1, limit: 100, sortBy: 'date', sortOrder: 'desc' })
        ]);

        setSummary(dashboardResponse.data);
        setLowStockProducts((productsResponse.data || []).filter((product) => Number(product.quantity) < 10));
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return <Loading label="Loading dashboard..." />;
  }

  const cards = [
    {
      title: 'Products',
      value: summary?.totalProducts ?? 0,
      icon: <FiBox />,
      subtitle: 'Items in inventory',
      accent: 'from-indigo-600 to-indigo-500'
    },
    {
      title: 'Total Stock',
      value: summary?.totalStock ?? 0,
      icon: <FiLayers />,
      subtitle: 'Combined units',
      accent: 'from-blue-600 to-cyan-500'
    },
    {
      title: 'Total Value',
      value: formatCurrency(summary?.inventoryValue ?? 0),
      icon: <FiDollarSign />,
      subtitle: 'Estimated inventory worth',
      accent: 'from-emerald-600 to-teal-500'
    },
    {
      title: 'Low Stock',
      value: summary?.lowStock ?? 0,
      icon: <FiAlertTriangle />,
      subtitle: 'Quantity under 10',
      accent: 'from-amber-500 to-orange-600'
    }
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <section className="grid grid-cols-2 gap-2.5 sm:gap-4">
        {cards.map((card) => (
          <DashboardCard key={card.title} {...card} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="surface p-5 md:p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recently Added Products</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Latest inventory changes saved on this device.</p>
            </div>
          </div>
          <div className="grid gap-4">
            {(summary?.recentProducts || []).length ? (
              summary.recentProducts.map((product) => (
                <ProductCard key={product.id} product={product} onEdit={() => {}} onDelete={() => {}} showActions={false} />
              ))
            ) : (
              <EmptyState
                title="No Recent Products"
                description="Add products to see recent activity here."
              />
            )}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="surface p-5 md:p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Low Stock Products</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Items that need restocking soon.</p>
            </div>
          </div>
          <div className="grid gap-4">
            {lowStockProducts.length ? (
              lowStockProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} onEdit={() => {}} onDelete={() => {}} showActions={false} />
              ))
            ) : (
              <EmptyState
                title="No Low Stock Items"
                description="Everything is currently above the low-stock threshold."
              />
            )}
          </div>
        </motion.div>
      </section>
    </div>
  );
}
