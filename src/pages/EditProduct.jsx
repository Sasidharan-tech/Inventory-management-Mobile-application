import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import ProductForm from '../components/ProductForm';
import Loading from '../components/Loading';
import { getProduct, updateProduct } from '../services/api';
import { getImageUrl } from '../utils/helpers';

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const response = await getProduct(id);
        setProduct(response.data);
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Failed to load product.');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, navigate]);

  const handleSubmit = async (formData) => {
    try {
      setSaving(true);
      await updateProduct(id, formData);
      toast.success('Product Updated');
      navigate('/products');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update product.');
      throw error;
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loading label="Loading product..." />;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600 dark:text-brand-300">Products</p>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white">Edit Product</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Update any field and optionally replace the product image.</p>
      </div>
      <ProductForm
        initialValues={{
          ...product,
          imageUrl: getImageUrl(product?.image)
        }}
        onSubmit={handleSubmit}
        submitLabel={saving ? 'Saving...' : 'Update Product'}
        requireImage={false}
        loading={saving}
      />
    </motion.div>
  );
}
