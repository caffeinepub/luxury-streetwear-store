import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "@tanstack/react-router";
import { Loader2, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "../context/CartContext";
import { usePlaceOrder } from "../hooks/useQueries";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice } =
    useCart();
  const placeOrder = usePlaceOrder();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState<bigint | null>(null);

  const handlePlaceOrder = async () => {
    setNameError("");
    setEmailError("");
    let valid = true;
    if (!name.trim()) {
      setNameError("Name is required");
      valid = false;
    }
    if (!email.trim() || !email.includes("@")) {
      setEmailError("Valid email is required");
      valid = false;
    }
    if (!valid) return;

    try {
      const orderItems = items.map((item) => ({
        productId: item.product.id,
        quantity: BigInt(item.quantity),
        price: item.product.price,
      }));
      const orderId = await placeOrder.mutateAsync({
        customerName: name,
        customerEmail: email,
        items: orderItems,
      });
      setOrderSuccess(orderId);
      clearCart();
    } catch {
      toast.error("Failed to place order. Please try again.");
    }
  };

  if (orderSuccess !== null) {
    return (
      <main
        className="pt-16 min-h-screen flex items-center justify-center"
        data-ocid="cart.success_state"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md px-6"
        >
          <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-8">
            <ShoppingBag className="w-8 h-8 text-background" />
          </div>
          <h2 className="font-display font-black uppercase text-4xl tracking-tight text-foreground mb-4">
            Order Placed!
          </h2>
          <p className="text-muted-foreground mb-2">
            Your order #{orderSuccess.toString()} has been received.
          </p>
          <p className="text-sm text-muted-foreground mb-10">
            We'll confirm your order via email shortly.
          </p>
          <Link
            to="/products"
            search={{ category: undefined }}
            className="inline-flex items-center bg-gold text-background font-display font-bold uppercase tracking-widest text-xs px-10 py-4 hover:opacity-90 transition-opacity"
            data-ocid="cart.link"
          >
            Continue Shopping
          </Link>
        </motion.div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main
        className="pt-16 min-h-screen flex items-center justify-center"
        data-ocid="cart.empty_state"
      >
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
          <h2 className="font-display font-black uppercase text-4xl tracking-tight text-foreground mb-4">
            Your Cart is Empty
          </h2>
          <p className="text-muted-foreground mb-10">
            Add some products to get started.
          </p>
          <Link
            to="/products"
            search={{ category: undefined }}
            className="inline-flex bg-gold text-background font-display font-bold uppercase tracking-widest text-xs px-10 py-4 hover:opacity-90 transition-opacity"
            data-ocid="cart.link"
          >
            Shop Now
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-16" data-ocid="cart.section">
      <div className="max-w-screen-xl mx-auto px-6 py-12">
        <h1 className="font-display font-black uppercase text-4xl md:text-5xl tracking-tight text-foreground mb-12">
          Your Cart
        </h1>

        <div className="grid lg:grid-cols-3 gap-12 items-start">
          <div className="lg:col-span-2 border-t border-border">
            <AnimatePresence>
              {items.map((item, i) => (
                <motion.div
                  key={item.product.id.toString()}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex gap-4 py-6 border-b border-border"
                  data-ocid={`cart.item.${i + 1}`}
                >
                  <div className="bg-image-mat w-24 h-24 shrink-0 overflow-hidden">
                    <img
                      src={
                        item.product.imageUrl ||
                        `https://placehold.co/200x200/efefef/1a1a1a?text=${encodeURIComponent(item.product.name)}`
                      }
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-display uppercase tracking-widest text-muted-foreground mb-1">
                      {item.product.brand}
                    </p>
                    <h3 className="font-display font-bold uppercase text-sm text-foreground mb-2 truncate">
                      {item.product.name}
                    </h3>
                    <p className="text-gold font-display font-semibold text-sm">
                      ${item.product.price.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                      data-ocid={`cart.delete_button.${i + 1}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="flex items-center border border-border">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                        className="p-1.5 text-muted-foreground hover:text-foreground"
                        data-ocid={`cart.button.${i + 1}`}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3 text-xs font-display font-bold text-foreground">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                        className="p-1.5 text-muted-foreground hover:text-foreground"
                        data-ocid={`cart.button.${i + 1}`}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-xs font-display text-foreground">
                      ${(item.product.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="bg-card-dark border border-border p-6 sticky top-24">
            <h2 className="font-display font-bold uppercase text-sm tracking-widest text-foreground mb-6">
              Order Summary
            </h2>
            <div className="space-y-3 mb-6">
              {items.map((item) => (
                <div
                  key={item.product.id.toString()}
                  className="flex justify-between text-xs text-muted-foreground"
                >
                  <span className="truncate mr-4">
                    {item.product.name} × {item.quantity}
                  </span>
                  <span className="shrink-0">
                    ${(item.product.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="font-display font-bold uppercase text-xs tracking-widest text-foreground">
                  Total
                </span>
                <span className="font-display font-black text-xl text-gold">
                  ${totalPrice.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <h3 className="font-display font-bold uppercase text-xs tracking-widest text-foreground">
                Contact Info
              </h3>
              <div>
                <Label
                  htmlFor="checkout-name"
                  className="text-[10px] font-display uppercase tracking-widest text-muted-foreground mb-1.5 block"
                >
                  Full Name
                </Label>
                <Input
                  id="checkout-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-gold rounded-none"
                  data-ocid="cart.input"
                />
                {nameError && (
                  <p
                    className="text-[10px] text-destructive mt-1"
                    data-ocid="cart.error_state"
                  >
                    {nameError}
                  </p>
                )}
              </div>
              <div>
                <Label
                  htmlFor="checkout-email"
                  className="text-[10px] font-display uppercase tracking-widest text-muted-foreground mb-1.5 block"
                >
                  Email
                </Label>
                <Input
                  id="checkout-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-gold rounded-none"
                  data-ocid="cart.input"
                />
                {emailError && (
                  <p
                    className="text-[10px] text-destructive mt-1"
                    data-ocid="cart.error_state"
                  >
                    {emailError}
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={placeOrder.isPending}
              className="w-full flex items-center justify-center gap-2 bg-gold text-background font-display font-bold uppercase tracking-widest text-xs py-4 hover:opacity-90 transition-opacity disabled:opacity-50"
              data-ocid="cart.submit_button"
            >
              {placeOrder.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Processing...
                </>
              ) : (
                "Place Order"
              )}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
