import { Link, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { motion } from "motion/react";
import type { Product } from "../backend";
import { useCart } from "../context/CartContext";
import { useCreateStripeCheckout } from "../hooks/useQueries";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const createCheckout = useCreateStripeCheckout();

  const handleBuyNow = async () => {
    if (!product) return;
    try {
      const stripeUrl = await createCheckout.mutateAsync({
        customerName: "",
        customerEmail: "",
        items: [{ productId: product.id, quantity: 1n, price: product.price }],
        successUrl: `${window.location.origin}/?checkout=success`,
        cancelUrl: window.location.href,
      });
      window.location.href = stripeUrl;
    } catch {
      addToCart(product);
      navigate({ to: "/cart" });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group"
    >
      {/* Image block */}
      <Link to="/products/$id" params={{ id: product.id.toString() }}>
        <div className="relative bg-image-mat aspect-square overflow-hidden">
          <img
            src={
              product.imageUrl ||
              `https://placehold.co/600x600/f2f2f2/111111?text=${encodeURIComponent(product.name)}`
            }
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
          {/* Hover overlay */}
          <div className="absolute inset-x-0 bottom-0 flex opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                addToCart(product);
              }}
              className="flex-1 bg-background/90 text-foreground text-[10px] font-body font-bold uppercase tracking-[0.18em] py-3 hover:bg-foreground hover:text-background transition-colors duration-200"
              data-ocid="products.secondary_button"
            >
              Add to Cart
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                handleBuyNow();
              }}
              className="flex-1 bg-foreground text-background text-[10px] font-body font-bold uppercase tracking-[0.18em] py-3 hover:opacity-80 transition-opacity duration-200"
              data-ocid="products.primary_button"
            >
              Buy Now
            </button>
          </div>
          {product.featured && (
            <span className="absolute top-3 left-3 bg-foreground text-background text-[9px] font-body font-black uppercase tracking-widest px-2 py-1">
              Featured
            </span>
          )}
        </div>
        {/* Bottom rule */}
        <div className="h-px bg-border group-hover:bg-foreground transition-colors duration-300" />
      </Link>

      {/* Text info */}
      <div className="pt-4 pb-2">
        <p className="text-[9px] font-body font-bold uppercase tracking-[0.25em] text-muted-foreground mb-1">
          {product.brand}
        </p>
        <h3 className="font-display font-bold text-[15px] text-foreground mb-2 leading-tight truncate">
          {product.name}
        </h3>
        <p className="text-foreground font-body font-black text-base mb-4">
          ${product.price.toLocaleString()}
        </p>

        {/* Permanent action buttons */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => addToCart(product)}
            className="flex-1 border border-border text-foreground text-[10px] font-body font-bold uppercase tracking-widest py-3 hover:border-foreground hover:bg-foreground hover:text-background transition-all duration-200"
            data-ocid="products.secondary_button"
          >
            Add to Cart
          </button>
          <button
            type="button"
            onClick={handleBuyNow}
            disabled={createCheckout.isPending}
            className="flex-1 bg-foreground text-background text-[10px] font-body font-black uppercase tracking-widest py-3 hover:opacity-80 transition-opacity duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1"
            data-ocid="products.primary_button"
          >
            {createCheckout.isPending ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Wait...</span>
              </>
            ) : (
              "Buy Now"
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
