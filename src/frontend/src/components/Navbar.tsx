import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Search, ShoppingCart, User, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function Navbar() {
  const { totalItems } = useCart();
  const { login, clear, identity } = useInternetIdentity();
  const { location } = useRouterState();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: "New Arrivals", category: undefined },
    { label: "Sneakers", category: "Sneakers" },
    { label: "Hoodies", category: "Hoodies" },
    { label: "Jeans", category: "Jeans" },
    { label: "Accessories", category: "Accessories" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface border-b border-border">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="font-display font-black text-2xl tracking-[0.15em] text-foreground hover:text-gold transition-colors"
          data-ocid="nav.link"
        >
          LUXE
        </Link>

        <nav
          className="hidden lg:flex items-center gap-8"
          aria-label="Main navigation"
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to="/products"
              search={{ category: link.category }}
              className={`text-xs font-display font-semibold uppercase tracking-widest transition-colors hover:text-gold ${
                location.pathname === "/products"
                  ? "text-gold"
                  : "text-muted-foreground"
              }`}
              data-ocid="nav.link"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            to="/products"
            search={{ category: undefined }}
            className="text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
            data-ocid="nav.link"
            aria-label="Search products"
          >
            <Search className="w-5 h-5" />
          </Link>

          <button
            type="button"
            onClick={identity ? clear : login}
            className="text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
            title={identity ? "Logout" : "Login"}
            data-ocid="nav.link"
          >
            <User className="w-5 h-5" />
          </button>

          <Link
            to="/cart"
            className="relative text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="nav.link"
            aria-label="Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-background text-[10px] font-bold font-display w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          <button
            type="button"
            className="lg:hidden text-foreground"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-surface border-t border-border overflow-hidden"
          >
            <nav className="px-4 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to="/products"
                  search={{ category: link.category }}
                  onClick={() => setMobileOpen(false)}
                  className="text-xs font-display font-semibold uppercase tracking-widest text-muted-foreground hover:text-gold transition-colors"
                  data-ocid="nav.link"
                >
                  {link.label}
                </Link>
              ))}
              <button
                type="button"
                onClick={identity ? clear : login}
                className="text-xs font-display font-semibold uppercase tracking-widest text-muted-foreground hover:text-gold transition-colors text-left"
                data-ocid="nav.link"
              >
                {identity ? "Logout" : "Login"}
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
