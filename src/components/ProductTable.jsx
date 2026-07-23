import ProductCard from './ProductCard';

export default function ProductTable({ products = [], onEdit, onDelete }) {
  if (!products.length) {
    return null;
  }

  return (
    <div className="grid gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
