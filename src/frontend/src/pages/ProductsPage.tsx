import { Skeleton } from "@/components/ui/skeleton";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { useProductsByCategory } from "../hooks/useQueries";

const CATEGORIES = ["All", "Sneakers", "Hoodies", "Jeans", "Accessories"];
const SKELETON_KEYS = [
  "sk-1",
  "sk-2",
  "sk-3",
  "sk-4",
  "sk-5",
  "sk-6",
  "sk-7",
  "sk-8",
];

export default function ProductsPage() {
  const { category: catParam } = useSearch({ from: "/products" });
  const navigate = useNavigate({ from: "/products" });

  const initialCat =
    catParam && CATEGORIES.includes(catParam) ? catParam : "All";
  const [activeCategory, setActiveCategory] = useState(initialCat);

  useEffect(() => {
    const cat = catParam && CATEGORIES.includes(catParam) ? catParam : "All";
    setActiveCategory(cat);
  }, [catParam]);

  const { data: products, isLoading } = useProductsByCategory(activeCategory);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    navigate({
      search: { category: cat === "All" ? undefined : cat },
    });
  };

  return (
    <main className="pt-16">
      <section className="bg-card-dark border-b border-border py-16">
        <div className="max-w-screen-xl mx-auto px-6">
          <p className="text-[10px] font-display font-semibold uppercase tracking-[0.4em] text-gold mb-4">
            Collection
          </p>
          <h1 className="font-display font-black uppercase text-5xl md:text-6xl tracking-tight text-foreground">
            All Products
          </h1>
        </div>
      </section>

      <section className="sticky top-16 z-30 bg-surface border-b border-border">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="flex gap-0 overflow-x-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryChange(cat)}
                className={`relative shrink-0 font-display font-semibold uppercase text-xs tracking-widest px-6 py-5 transition-colors ${
                  activeCategory === cat
                    ? "text-gold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                data-ocid="products.tab"
              >
                {cat}
                {activeCategory === cat && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-screen-xl mx-auto px-6 py-12">
        {isLoading ? (
          <div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            data-ocid="products.loading_state"
          >
            {SKELETON_KEYS.map((k) => (
              <div key={k} className="space-y-3">
                <Skeleton className="aspect-square w-full bg-card-dark" />
                <Skeleton className="h-3 w-1/2 bg-card-dark" />
                <Skeleton className="h-4 w-3/4 bg-card-dark" />
              </div>
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <>
            <p className="text-xs font-display text-muted-foreground uppercase tracking-widest mb-8">
              {products.length} {products.length === 1 ? "product" : "products"}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product, i) => (
                <ProductCard
                  key={product.id.toString()}
                  product={product}
                  index={i}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-32" data-ocid="products.empty_state">
            <p className="font-display font-bold uppercase tracking-widest text-lg text-foreground mb-2">
              No Products Found
            </p>
            <p className="text-sm text-muted-foreground">
              Try selecting a different category.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

// Suppress unused import warning
export { Link };
