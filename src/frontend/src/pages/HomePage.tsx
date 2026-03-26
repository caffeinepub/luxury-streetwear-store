import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef } from "react";
import ProductCard from "../components/ProductCard";
import { useFeaturedProducts, useSeedProducts } from "../hooks/useQueries";

const SKELETON_KEYS = ["sk-a", "sk-b", "sk-c", "sk-d"];

export default function HomePage() {
  const { data: products, isLoading } = useFeaturedProducts();
  const { mutate: seed } = useSeedProducts();
  const seeded = useRef(false);

  useEffect(() => {
    if (seeded.current) return;
    seeded.current = true;
    seed();
  }, [seed]);

  return (
    <main>
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to bottom, oklch(0.09 0 0 / 0.6), oklch(0.09 0 0 / 0.9)), url('/assets/generated/hero-banner.dim_1920x600.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        data-ocid="hero.section"
      >
        <div className="relative z-10 max-w-screen-xl mx-auto px-6 text-center">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-px bg-gold w-24 mx-auto mb-10"
          />
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xs font-display font-semibold uppercase tracking-[0.4em] text-gold mb-6"
          >
            Luxury Streetwear Boutique
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="font-display font-black uppercase text-5xl sm:text-7xl md:text-8xl lg:text-[9rem] leading-[0.9] tracking-tight text-foreground mb-6"
          >
            DEFINE
            <br />
            <span className="text-gold">YOUR</span>
            <br />
            STYLE
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-sm text-muted-foreground max-w-md mx-auto mb-10 leading-relaxed"
          >
            Curated luxury and streetwear. From Balenciaga to Dior — wear what
            moves culture forward.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/products"
              search={{ category: undefined }}
              className="inline-flex items-center justify-center gap-2 bg-gold text-background font-display font-bold uppercase tracking-widest text-xs px-10 py-4 hover:opacity-90 transition-opacity"
              data-ocid="hero.primary_button"
            >
              Shop Now <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/products"
              search={{ category: undefined }}
              className="inline-flex items-center justify-center border border-foreground text-foreground font-display font-bold uppercase tracking-widest text-xs px-10 py-4 hover:border-gold hover:text-gold transition-all"
              data-ocid="hero.secondary_button"
            >
              Explore Collection
            </Link>
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="h-8 w-px bg-gold opacity-60" />
        </motion.div>
      </section>

      <section
        className="max-w-screen-xl mx-auto px-6 py-24"
        data-ocid="featured.section"
      >
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-[10px] font-display font-semibold uppercase tracking-[0.3em] text-gold mb-3">
              Handpicked
            </p>
            <h2 className="font-display font-black uppercase text-4xl md:text-5xl tracking-tight text-foreground">
              Featured
              <br />
              Pieces
            </h2>
          </div>
          <Link
            to="/products"
            search={{ category: undefined }}
            className="hidden sm:inline-flex items-center gap-2 text-xs font-display font-semibold uppercase tracking-widest text-muted-foreground hover:text-gold transition-colors"
            data-ocid="featured.link"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            data-ocid="featured.loading_state"
          >
            {SKELETON_KEYS.map((k) => (
              <div key={k} className="space-y-3">
                <Skeleton className="aspect-square w-full bg-card-dark" />
                <Skeleton className="h-3 w-1/2 bg-card-dark" />
                <Skeleton className="h-4 w-3/4 bg-card-dark" />
                <Skeleton className="h-3 w-1/3 bg-card-dark" />
              </div>
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.slice(0, 8).map((product, i) => (
              <ProductCard
                key={product.id.toString()}
                product={product}
                index={i}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20" data-ocid="featured.empty_state">
            <p className="text-muted-foreground font-display uppercase tracking-widest text-sm">
              Loading products...
            </p>
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            to="/products"
            search={{ category: undefined }}
            className="inline-flex items-center gap-2 border border-border text-foreground font-display font-bold uppercase tracking-widest text-xs px-10 py-4 hover:border-gold hover:text-gold transition-all"
            data-ocid="featured.link"
          >
            View Full Collection <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <section className="border-y border-border bg-card-dark py-12">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-12 md:gap-20">
            {["BALENCIAGA", "DIOR", "SP5DER", "AMIRI", "RAY-BAN"].map(
              (brand) => (
                <span
                  key={brand}
                  className="font-display font-black text-sm tracking-[0.3em] text-muted-foreground hover:text-gold transition-colors cursor-default"
                >
                  {brand}
                </span>
              ),
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
