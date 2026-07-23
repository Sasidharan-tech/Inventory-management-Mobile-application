const STORAGE_KEY = 'inventory-products-v2';

const getFallbackDate = () => new Date().toISOString();

const readStorage = () => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeStorage = (products) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
};

const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

const toNumber = (value) => Number(value || 0);

const normalizeText = (value) => String(value ?? '').trim();

const getProductId = (product) => String(product?.id ?? product?.product_id ?? '');

const cloneProducts = () => readStorage().map((product) => ({ ...product }));

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Unable to read the selected image.'));
    reader.readAsDataURL(file);
  });

const readFormField = (formData, key, fallback = '') => normalizeText(formData.get(key) ?? fallback);

const readImageField = async (formData, existingImage = '') => {
  const imageField = formData.get('image');

  if (imageField instanceof File && imageField.size > 0) {
    return readFileAsDataUrl(imageField);
  }

  if (typeof imageField === 'string' && imageField.trim()) {
    return imageField.trim();
  }

  return existingImage;
};

const buildProductPayload = async (formData, existingProduct = null) => {
  const image = await readImageField(formData, existingProduct?.image || '');
  const now = getFallbackDate();
  const isNew = !existingProduct;

  return {
    id: existingProduct?.id ?? crypto.randomUUID(),
    product_id: existingProduct?.product_id ?? `PRD-${Date.now().toString(36).toUpperCase()}`,
    name: readFormField(formData, 'name'),
    category: readFormField(formData, 'category'),
    price: toNumber(formData.get('price')),
    quantity: toNumber(formData.get('quantity')),
    description: readFormField(formData, 'description'),
    image,
    created_at: existingProduct?.created_at ?? now,
    updated_at: now,
    _kind: isNew ? 'created' : 'updated'
  };
};

const sortProducts = (products, sortBy = 'date', sortOrder = 'desc') => {
  const direction = sortOrder === 'asc' ? 1 : -1;

  return [...products].sort((left, right) => {
    const leftValue =
      sortBy === 'name'
        ? left.name
        : sortBy === 'price'
          ? Number(left.price || 0)
          : sortBy === 'quantity'
            ? Number(left.quantity || 0)
            : new Date(left.updated_at || left.created_at || 0).getTime();

    const rightValue =
      sortBy === 'name'
        ? right.name
        : sortBy === 'price'
          ? Number(right.price || 0)
          : sortBy === 'quantity'
            ? Number(right.quantity || 0)
            : new Date(right.updated_at || right.created_at || 0).getTime();

    if (leftValue < rightValue) return -1 * direction;
    if (leftValue > rightValue) return 1 * direction;
    return 0;
  });
};

const applyFilters = (products, params = {}) => {
  const search = normalizeText(params.search).toLowerCase();
  const category = normalizeText(params.category).toLowerCase();

  return products.filter((product) => {
    const matchesSearch =
      !search ||
      [product.name, product.category, product.description, product.product_id]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(search));

    const matchesCategory = !category || String(product.category || '').toLowerCase() === category;

    return matchesSearch && matchesCategory;
  });
};

const paginate = (products, page = 1, limit = 10) => {
  const safePage = Math.max(Number(page) || 1, 1);
  const safeLimit = Math.max(Number(limit) || 10, 1);
  const total = products.length;
  const totalPages = Math.max(Math.ceil(total / safeLimit), 1);
  const currentPage = Math.min(safePage, totalPages);
  const start = (currentPage - 1) * safeLimit;

  return {
    items: products.slice(start, start + safeLimit),
    pagination: {
      page: currentPage,
      limit: safeLimit,
      total,
      totalPages
    }
  };
};

const getStoredProducts = () => cloneProducts();

const updateStoredProducts = (products) => {
  writeStorage(products);
  return products;
};

export const getDashboard = async () => {
  const products = getStoredProducts();
  const recentProducts = [...products]
    .sort((left, right) => new Date(right.updated_at || right.created_at || 0) - new Date(left.updated_at || left.created_at || 0))
    .slice(0, 4);

  const summary = {
    totalProducts: products.length,
    totalStock: products.reduce((total, product) => total + toNumber(product.quantity), 0),
    inventoryValue: products.reduce((total, product) => total + toNumber(product.price) * toNumber(product.quantity), 0),
    lowStock: products.filter((product) => toNumber(product.quantity) < 10).length,
    recentProducts
  };

  return { data: summary };
};

export const getProducts = async (params = {}) => {
  const filteredProducts = applyFilters(getStoredProducts(), params);
  const sortedProducts = sortProducts(filteredProducts, params.sortBy, params.sortOrder);
  const { items, pagination } = paginate(sortedProducts, params.page, params.limit);

  return {
    data: items,
    pagination
  };
};

export const getProduct = async (id) => {
  const product = getStoredProducts().find((item) => getProductId(item) === String(id));

  if (!product) {
    throw new Error('Product not found.');
  }

  return { data: product };
};

export const createProduct = async (formData) => {
  const products = getStoredProducts();
  const newProduct = await buildProductPayload(formData);
  const nextProducts = updateStoredProducts([newProduct, ...products]);

  return { data: nextProducts[0] };
};

export const updateProduct = async (id, formData) => {
  const products = getStoredProducts();
  const index = products.findIndex((product) => getProductId(product) === String(id));

  if (index === -1) {
    throw new Error('Product not found.');
  }

  const updatedProduct = await buildProductPayload(formData, products[index]);
  const nextProducts = [...products];
  nextProducts[index] = updatedProduct;
  updateStoredProducts(nextProducts);

  return { data: updatedProduct };
};

export const deleteProduct = async (id) => {
  const products = getStoredProducts();
  const nextProducts = products.filter((product) => getProductId(product) !== String(id));
  updateStoredProducts(nextProducts);

  return { data: { success: true } };
};

export const importExcel = async (formData, onUploadProgress) => {
  const file = formData.get('file');

  if (!(file instanceof File)) {
    throw new Error('Please choose a backup file first.');
  }

  if (typeof onUploadProgress === 'function') {
    onUploadProgress({ loaded: 25, total: 100 });
  }

  const text = await file.text();
  let importedProducts = [];

  try {
    const parsed = JSON.parse(text);
    importedProducts = Array.isArray(parsed) ? parsed : parsed.products || [];
  } catch {
    throw new Error('Backup files must be valid JSON exported from this app.');
  }

  const currentProducts = getStoredProducts();
  const mergedProducts = [...currentProducts];
  let inserted = 0;
  let updated = 0;

  importedProducts.forEach((product) => {
    if (!product) return;

    const normalized = {
      id: product.id ?? crypto.randomUUID(),
      product_id: product.product_id ?? `PRD-${Date.now().toString(36).toUpperCase()}`,
      name: normalizeText(product.name),
      category: normalizeText(product.category),
      price: toNumber(product.price),
      quantity: toNumber(product.quantity),
      description: normalizeText(product.description),
      image: normalizeText(product.image),
      created_at: product.created_at || getFallbackDate(),
      updated_at: product.updated_at || getFallbackDate()
    };

    const existingIndex = mergedProducts.findIndex((item) => getProductId(item) === String(normalized.id));

    if (existingIndex >= 0) {
      mergedProducts[existingIndex] = normalized;
      updated += 1;
    } else {
      mergedProducts.unshift(normalized);
      inserted += 1;
    }
  });

  updateStoredProducts(mergedProducts);

  if (typeof onUploadProgress === 'function') {
    onUploadProgress({ loaded: 100, total: 100 });
  }

  await wait(50);

  return {
    inserted,
    updated,
    data: mergedProducts
  };
};

export const exportExcel = async () => {
  const products = getStoredProducts();
  return new Blob([JSON.stringify(products, null, 2)], { type: 'application/json' });
};

export default {
  getDashboard,
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  importExcel,
  exportExcel
};
