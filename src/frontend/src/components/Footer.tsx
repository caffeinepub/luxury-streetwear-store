import { Link } from "@tanstack/react-router";
import { Instagram, Twitter, Youtube } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(window.location.hostname);

  return (
    <footer className="bg-surface border-t border-border mt-24">
      <div className="max-w-screen-xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <div className="font-display font-black text-4xl tracking-[0.15em] text-foreground mb-4">
              LUXE
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Premium streetwear and luxury fashion. Curated for those who
              define their own style.
            </p>
            <div className="flex gap-4 mt-6">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-muted-foreground hover:text-gold transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="text-muted-foreground hover:text-gold transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="text-muted-foreground hover:text-gold transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-display font-bold text-xs uppercase tracking-widest text-foreground mb-4">
              Shop
            </h4>
            <ul className="space-y-3">
              {["Sneakers", "Hoodies", "Jeans", "Accessories"].map((cat) => (
                <li key={cat}>
                  <Link
                    to="/products"
                    search={{ category: cat }}
                    className="text-sm text-muted-foreground hover:text-gold transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/products"
                  search={{ category: undefined }}
                  className="text-sm text-muted-foreground hover:text-gold transition-colors"
                >
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-xs uppercase tracking-widest text-foreground mb-4">
              Support
            </h4>
            <ul className="space-y-3">
              {["Size Guide", "Shipping & Returns", "FAQ", "Contact Us"].map(
                (item) => (
                  <li key={item}>
                    <span className="text-sm text-muted-foreground cursor-default">
                      {item}
                    </span>
                  </li>
                ),
              )}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-xs uppercase tracking-widest text-foreground mb-4">
              Stay Updated
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              Subscribe for exclusive drops and early access.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-background border border-border text-foreground text-sm px-3 py-2 focus:outline-none focus:border-gold placeholder:text-muted-foreground"
              />
              <button
                type="button"
                className="bg-gold text-background text-xs font-display font-bold uppercase tracking-widest px-4 py-2 hover:opacity-90 transition-opacity"
              >
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {year} LUXE. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
