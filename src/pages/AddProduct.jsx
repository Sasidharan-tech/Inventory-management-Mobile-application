import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import ProductForm from '../components/ProductForm';
import { createProduct } from '../services/api';

export default function AddProduct() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      await createProduct(formData);

      toast.success('Product Added Successfully');
      navigate('/products');
    } catch (error) {
      toast.error(error?.message || 'Failed to add product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600 dark:text-brand-300">
          Products
        </p>

        <h2 className="text-3xl font-black text-slate-900 dark:text-white">
          Add Product
        </h2>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Create a new inventory item stored on this device.
        </p>
      </div>

      <ProductForm
        onSubmit={handleSubmit}
        submitLabel={loading ? 'Creating...' : 'Create Product'}
        requireImage={false}
        loading={loading}
      />
    </motion.div>
  );
}