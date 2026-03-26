import { Skeleton } from "@/components/ui/skeleton";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Loader2,
  Minus,
  Plus,
  ShoppingCart,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "../context/CartContext";
import { useCreateStripeCheckout, useProductById } from "../hooks/useQueries";

export default function ProductDetailPage() {
  const { id } = useParams({ from: "/products/$id" });
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const createCheckout = useCreateStripeCheckout();

  const productId = id ? BigInt(id) : undefined;
  const { data: product, isLoading, isError } = useProductById(productId);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    toast.success(`${product.name} added to cart`);
  };

  const handleBuyNow = async () => {
    if (!product) return;
    try {
      const stripeUrl = await createCheckout.mutateAsync({
        customerName: "",
        customerEmail: "",
        items: [
          {
            productId: product.id,
            quantity: BigInt(quantity),
            price: product.price,
          },
        ],
        successUrl: `${window.location.origin}/?checkout=success`,
        cancelUrl: window.location.href,
      });
      window.location.href = stripeUrl;
    } catch {
      addToCart(product, quantity);
      navigate({ to: "/cart" });
    }
  };

  if (isLoading) {
    return (
      <main
        className="pt-16 max-w-screen-xl mx-auto px-6 py-12"
        data-ocid="product.loading_state"
      >
        <div className="grid md:grid-cols-2 gap-12">
          <Skeleton className="aspect-square w-full bg-card-dark" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-1/3 bg-card-dark" />
            <Skeleton className="h-8 w-2/3 bg-card-dark" />
            <Skeleton className="h-6 w-1/4 bg-card-dark" />
            <Skeleton className="h-20 w-full bg-card-dark" />
          </div>
        </div>
      </main>
    );
  }

  if (isError || !product) {
    return (
      <main
        className="pt-16 min-h-screen flex items-center justify-center"
        data-ocid="product.error_state"
      >
        <div className="text-center">
          <h2 className="font-display font-black uppercase text-4xl text-foreground mb-4">
            Product Not Found
          </h2>
          <p className="text-muted-foreground mb-8">
            The product you're looking for doesn't exist.
          </p>
          <Link
            to="/products"
            search={{ category: undefined }}
            className="text-accent font-body font-bold uppercase tracking-widest text-xs hover:underline"
          >
            ← Back to Products
          </Link>
        </div>
      </main>
    );
  }

  const inStock = product.stock > 0n;

  return (
    <main className="pt-16" data-ocid="product.section">
      <div className="max-w-screen-xl mx-auto px-6 py-12">
        <nav className="flex items-center gap-2 mb-10" aria-label="Breadcrumb">
          <button
            type="button"
            onClick={() =>
              navigate({ to: "/products", search: { category: undefined } })
            }
            className="text-xs font-body font-bold uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors flex items-center gap-2"
            data-ocid="product.link"
          >
            <ArrowLeft className="w-3 h-3" /> Back
          </button>
          <span className="text-border">/</span>
          <Link
            to="/products"
            search={{ category: undefined }}
            className="text-xs font-body font-bold uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors"
            data-ocid="product.link"
          >
            Products
          </Link>
          <span className="text-border">/</span>
          <span className="text-xs font-body font-bold uppercase tracking-widest text-foreground">
            {product.name}
          </span>
        </nav>

        <div className="grid md:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative bg-image-mat aspect-square overflow-hidden"
          >
            <img
              src={
                product.imageUrl ||
                `https://placehold.co/600x600/efefef/1a1a1a?text=${encodeURIComponent(product.name)}`
              }
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.featured && (
              <span className="absolute top-4 left-4 bg-accent text-background text-[10px] font-body font-black uppercase tracking-widest px-3 py-1">
                Featured
              </span>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col"
          >
            <p className="text-[10px] font-body font-bold uppercase tracking-[0.4em] text-muted-foreground mb-3">
              {product.brand}
            </p>
            <h1 className="font-display font-black uppercase text-3xl md:text-4xl tracking-tighter text-foreground mb-4">
              {product.name}
            </h1>
            <p className="text-3xl font-display font-black text-accent mb-6">
              ${product.price.toLocaleString()}
            </p>

            <div className="h-px bg-border mb-6" />
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              {product.description}
            </p>

            <div className="flex items-center gap-3 mb-8">
              <span className="text-[10px] font-body uppercase tracking-widest text-muted-foreground">
                Category:
              </span>
              <span className="text-[10px] font-body font-bold uppercase tracking-widest border border-border px-2 py-1 text-foreground">
                {product.category}
              </span>
            </div>

            <div className="flex items-center gap-2 mb-8">
              <div
                className={`w-2 h-2 rounded-full ${inStock ? "bg-green-500" : "bg-destructive"}`}
              />
              <span className="text-xs font-body uppercase tracking-widest text-muted-foreground">
                {inStock
                  ? `In Stock (${product.stock.toString()} available)`
                  : "Out of Stock"}
              </span>
            </div>

            <div className="flex items-center gap-4 mb-8">
              <span className="text-xs font-body uppercase tracking-widest text-muted-foreground">
                Qty:
              </span>
              <div className="flex items-center border border-border">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-3 text-muted-foreground hover:text-foreground transition-colors"
                  data-ocid="product.button"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="px-4 font-body font-black text-sm text-foreground">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-3 text-muted-foreground hover:text-foreground transition-colors"
                  data-ocid="product.button"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!inStock}
              className="flex items-center justify-center gap-3 bg-accent text-background font-body font-black uppercase tracking-widest text-xs py-5 hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              data-ocid="product.primary_button"
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </button>

            <button
              type="button"
              onClick={handleBuyNow}
              disabled={!inStock || createCheckout.isPending}
              className="mt-3 flex items-center justify-center gap-3 border border-border text-foreground font-body font-black uppercase tracking-widest text-xs py-4 hover:border-accent hover:text-accent transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              data-ocid="product.secondary_button"
            >
              {createCheckout.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Redirecting...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Buy Now
                </>
              )}
            </button>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
