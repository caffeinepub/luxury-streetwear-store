import { Link } from "@tanstack/react-router";
import { Instagram, Twitter, Youtube } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(window.location.hostname);

  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-screen-xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-14 mb-16">
          {/* Brand column */}
          <div className="md:col-span-1">
            <div className="font-display font-black text-3xl tracking-tighter uppercase text-foreground mb-5">
              LUXE
            </div>
            <p className="text-sm font-body text-muted-foreground leading-relaxed mb-6">
              Premium streetwear and luxury fashion. Curated for those who move
              culture forward.
            </p>
            <div className="flex gap-5">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-body font-black text-[10px] uppercase tracking-[0.3em] text-foreground mb-5">
              Shop
            </h4>
            <ul className="space-y-3">
              {[
                "Sneakers",
                "Hoodies",
                "Jeans",
                "Accessories",
                "New Arrivals",
              ].map((cat) => (
                <li key={cat}>
                  <Link
                    to="/products"
                    search={{
                      category: cat === "New Arrivals" ? undefined : cat,
                    }}
                    className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-body font-black text-[10px] uppercase tracking-[0.3em] text-foreground mb-5">
              Support
            </h4>
            <ul className="space-y-3">
              {["Size Guide", "Shipping & Returns", "FAQ", "Contact Us"].map(
                (item) => (
                  <li key={item}>
                    <span className="text-sm font-body text-muted-foreground cursor-default">
                      {item}
                    </span>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-body font-black text-[10px] uppercase tracking-[0.3em] text-foreground mb-5">
              Stay Updated
            </h4>
            <p className="text-sm font-body text-muted-foreground mb-4 leading-relaxed">
              Subscribe for exclusive drops and early access.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-background border border-border text-foreground text-sm font-body px-3 py-2.5 focus:outline-none focus:border-foreground placeholder:text-muted-foreground transition-colors"
              />
              <button
                type="button"
                className="bg-foreground text-background text-[10px] font-body font-black uppercase tracking-[0.18em] px-4 py-2.5 hover:opacity-80 transition-opacity"
              >
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs font-body text-muted-foreground">
            &copy; {year} LUXE. All rights reserved.
          </p>
          <p className="text-xs font-body text-muted-foreground">
            Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
