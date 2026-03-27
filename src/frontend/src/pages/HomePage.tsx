import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import ProductCard from "../components/ProductCard";
import { useFeaturedProducts, useSeedProducts } from "../hooks/useQueries";

const SKELETON_KEYS = ["sk-a", "sk-b", "sk-c", "sk-d"];

const MARQUEE_ITEMS = [
  { brand: "BALENCIAGA", key: "b1" },
  { brand: "DIOR", key: "d1" },
  { brand: "SP5DER", key: "s1" },
  { brand: "AMIRI", key: "a1" },
  { brand: "META", key: "m1" },
  { brand: "CANADA GOOSE", key: "cg1" },
  { brand: "MONCLER", key: "mc1" },
  { brand: "HELLSTAR", key: "hs1" },
  { brand: "BALENCIAGA", key: "b2" },
  { brand: "DIOR", key: "d2" },
  { brand: "SP5DER", key: "s2" },
  { brand: "AMIRI", key: "a2" },
  { brand: "META", key: "m2" },
  { brand: "CANADA GOOSE", key: "cg2" },
  { brand: "MONCLER", key: "mc2" },
  { brand: "HELLSTAR", key: "hs2" },
  { brand: "BALENCIAGA", key: "b3" },
  { brand: "DIOR", key: "d3" },
  { brand: "SP5DER", key: "s3" },
  { brand: "AMIRI", key: "a3" },
  { brand: "META", key: "m3" },
  { brand: "CANADA GOOSE", key: "cg3" },
  { brand: "MONCLER", key: "mc3" },
  { brand: "HELLSTAR", key: "hs3" },
];

export default function HomePage() {
  const { data: products, isLoading } = useFeaturedProducts();
  const { mutate: seed } = useSeedProducts();
  const seeded = useRef(false);
  const [showSuccess, setShowSuccess] = useState(
    () =>
      typeof window !== "undefined" &&
      window.location.search.includes("checkout=success"),
  );

  useEffect(() => {
    if (seeded.current) return;
    seeded.current = true;
    seed();
  }, [seed]);

  useEffect(() => {
    if (!showSuccess) return;
    const url = new URL(window.location.href);
    url.searchParams.delete("checkout");
    window.history.replaceState({}, "", url.toString());
    const timer = setTimeout(() => setShowSuccess(false), 6000);
    return () => clearTimeout(timer);
  }, [showSuccess]);

  return (
    <main>
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -60 }}
            className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center gap-3 bg-foreground text-background py-4 px-6 text-xs font-body font-bold uppercase tracking-widest"
            data-ocid="checkout.success_state"
          >
            <CheckCircle className="w-5 h-5" />
            Payment successful — thank you for your order!
            <button
              type="button"
              onClick={() => setShowSuccess(false)}
              className="ml-4 opacity-70 hover:opacity-100 transition-opacity text-lg leading-none"
              data-ocid="checkout.close_button"
            >
              &times;
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Hero — pure white, typographic ── */}
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background"
        data-ocid="hero.section"
      >
        <div className="relative z-10 max-w-screen-xl mx-auto px-6 text-center">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-[10px] font-body font-bold uppercase tracking-[0.55em] text-muted-foreground mb-10"
          >
            Luxury Streetwear Boutique
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.9,
              delay: 0.25,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="font-display font-black text-[4.5rem] sm:text-[6.5rem] md:text-[9rem] lg:text-[11rem] xl:text-[13rem] leading-[0.85] tracking-tighter uppercase text-foreground mb-10"
          >
            WEAR
            <br />
            THE
            <br />
            CULTURE.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="text-sm font-body text-muted-foreground max-w-sm mx-auto mb-12 leading-relaxed"
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
              className="inline-flex items-center justify-center gap-2 bg-foreground text-background font-body font-black uppercase tracking-[0.18em] text-[11px] px-10 py-4 hover:opacity-80 transition-opacity"
              data-ocid="hero.primary_button"
            >
              Shop Now <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/products"
              search={{ category: undefined }}
              className="inline-flex items-center justify-center border border-border text-foreground font-body font-semibold uppercase tracking-[0.18em] text-[11px] px-10 py-4 hover:border-foreground transition-all"
              data-ocid="hero.secondary_button"
            >
              Explore Collection
            </Link>
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{
            duration: 2.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="h-10 w-px bg-border" />
        </motion.div>
      </section>

      {/* ── Brand Marquee ── */}
      <div className="border-y border-border overflow-hidden py-5 bg-card-dark">
        <div className="marquee-track">
          {MARQUEE_ITEMS.map(({ brand, key }) => (
            <span
              key={key}
              className="inline-flex items-center gap-8 px-10 text-[11px] font-body font-bold uppercase tracking-[0.35em] text-muted-foreground"
            >
              {brand}
              <span className="w-1.5 h-1.5 bg-border inline-block" />
            </span>
          ))}
        </div>
      </div>

      {/* ── Featured Pieces ── */}
      <section
        className="max-w-screen-xl mx-auto px-6 py-28"
        data-ocid="featured.section"
      >
        <div className="flex items-end justify-between mb-16">
          <div>
            <p className="text-[9px] font-body font-bold uppercase tracking-[0.4em] text-muted-foreground mb-4">
              Handpicked
            </p>
            <h2 className="font-display font-black uppercase text-5xl md:text-6xl leading-[0.9] tracking-tighter text-foreground">
              Featured{" "}
              <span className="italic text-muted-foreground">Pieces</span>
            </h2>
          </div>
          <Link
            to="/products"
            search={{ category: undefined }}
            className="hidden sm:inline-flex items-center gap-2 text-[11px] font-body font-semibold uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="featured.link"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
            <p className="text-muted-foreground font-body uppercase tracking-widest text-sm">
              Loading products…
            </p>
          </div>
        )}

        <div className="text-center mt-16">
          <Link
            to="/products"
            search={{ category: undefined }}
            className="inline-flex items-center gap-2 border border-border text-muted-foreground font-body font-semibold uppercase tracking-[0.18em] text-[11px] px-10 py-4 hover:border-foreground hover:text-foreground transition-all"
            data-ocid="featured.link"
          >
            View Full Collection <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
