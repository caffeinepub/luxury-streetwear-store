import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import type { Product } from "../backend";
import { useCart } from "../context/CartContext";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group bg-card-dark border border-border hover:border-gold transition-all duration-300"
    >
      <Link to="/products/$id" params={{ id: product.id.toString() }}>
        <div className="relative bg-image-mat aspect-square overflow-hidden">
          <img
            src={
              product.imageUrl ||
              `https://placehold.co/600x600/efefef/1a1a1a?text=${encodeURIComponent(product.name)}`
            }
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {product.featured && (
            <span className="absolute top-3 left-3 bg-gold text-background text-[10px] font-display font-bold uppercase tracking-widest px-2 py-1">
              Featured
            </span>
          )}
        </div>
      </Link>

      <div className="p-4">
        <p className="text-[10px] font-display font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-1">
          {product.brand}
        </p>
        <h3 className="font-display font-bold uppercase text-sm tracking-wide text-foreground mb-2 truncate">
          {product.name}
        </h3>
        <p className="text-gold font-display font-semibold text-sm mb-4">
          ${product.price.toLocaleString()}
        </p>

        <div className="flex gap-2">
          <Link
            to="/products/$id"
            params={{ id: product.id.toString() }}
            className="flex-1 text-center text-[10px] font-display font-bold uppercase tracking-widest border border-border text-foreground py-2 hover:border-gold hover:text-gold transition-all"
            data-ocid="products.item.1"
          >
            View Product
          </Link>
          <button
            type="button"
            onClick={() => addToCart(product)}
            className="flex-1 text-[10px] font-display font-bold uppercase tracking-widest bg-btn-dark text-foreground py-2 hover:bg-gold hover:text-background transition-all"
            data-ocid="products.item.1"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </motion.div>
  );
}
