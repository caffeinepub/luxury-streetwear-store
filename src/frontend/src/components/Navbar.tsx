import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, ShoppingCart, User, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function Navbar() {
  const { totalItems } = useCart();
  const { login, clear, identity } = useInternetIdentity();
  const { location } = useRouterState();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "New Arrivals", category: undefined },
    { label: "Sneakers", category: "Sneakers" },
    { label: "Hoodies", category: "Hoodies" },
    { label: "Jeans", category: "Jeans" },
    { label: "Accessories", category: "Accessories" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-background transition-all duration-300 ${
        scrolled ? "border-b border-border" : "border-b border-transparent"
      }`}
    >
      <div className="max-w-screen-xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="font-display font-black text-xl tracking-tighter uppercase text-foreground hover:opacity-60 transition-opacity"
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
              className={`text-[11px] font-body font-semibold tracking-[0.14em] uppercase transition-colors hover:text-foreground ${
                location.pathname === "/products"
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}
              data-ocid="nav.link"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={identity ? clear : login}
            className="text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
            title={identity ? "Logout" : "Login"}
            data-ocid="nav.link"
          >
            <User className="w-4 h-4" />
          </button>

          <Link
            to="/cart"
            className="relative text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="nav.link"
            aria-label="Cart"
          >
            <ShoppingCart className="w-4 h-4" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-foreground text-background text-[9px] font-body font-black w-4 h-4 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          <button
            type="button"
            className="lg:hidden text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="w-4 h-4" />
            ) : (
              <Menu className="w-4 h-4" />
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
            className="lg:hidden bg-background border-t border-border overflow-hidden"
          >
            <nav className="px-6 py-6 flex flex-col gap-5">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to="/products"
                  search={{ category: link.category }}
                  onClick={() => setMobileOpen(false)}
                  className="text-[11px] font-body font-semibold tracking-[0.14em] uppercase text-muted-foreground hover:text-foreground transition-colors"
                  data-ocid="nav.link"
                >
                  {link.label}
                </Link>
              ))}
              <button
                type="button"
                onClick={identity ? clear : login}
                className="text-[11px] font-body font-semibold tracking-[0.14em] uppercase text-muted-foreground hover:text-foreground transition-colors text-left"
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
