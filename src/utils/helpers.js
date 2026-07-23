export const formatCurrency = (value = 0) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2
  }).format(Number(value || 0));

export const formatDate = (value) => {
  if (!value) return '-';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(value));
};

export const getImageUrl = (image) => {
  if (!image) return '';
  if (image.startsWith('data:')) return image;
  if (image.startsWith('http')) return image;
  if (image.startsWith('/')) return `${import.meta.env.VITE_API_BASE_URL || ''}${image}`;
  return `${import.meta.env.VITE_API_BASE_URL || ''}/uploads/${image}`;
};

export const getErrorMessage = (error) =>
  error?.response?.data?.message || error?.message || 'Something went wrong.';

export const downloadBlob = (blob, fileName) => {
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.URL.revokeObjectURL(url);
};
