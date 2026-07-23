import {
  createProduct,
  getProducts as apiGetProducts,
  getProduct as apiGetProduct,
  updateProduct as apiUpdateProduct,
  deleteProduct as apiDeleteProduct
} from './api';

const objectToFormData = (data) => {
  if (data instanceof FormData) return data;
  const formData = new FormData();
  if (data && typeof data === 'object') {
    Object.entries(data).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        formData.append(key, val);
      }
    });
  }
  return formData;
};

export const saveProduct = async (product) => {
  const formData = objectToFormData(product);
  const result = await createProduct(formData);
  return result.data;
};

export const getProducts = async (params = {}) => {
  const result = await apiGetProducts({ limit: 1000, ...params });
  return result.data || [];
};

export const getProduct = async (id) => {
  const result = await apiGetProduct(id);
  return result.data;
};

export const deleteProduct = async (id) => {
  const result = await apiDeleteProduct(id);
  return result.data;
};

export const updateProduct = async (id, data) => {
  const formData = objectToFormData(data);
  const result = await apiUpdateProduct(id, formData);
  return result.data;
};