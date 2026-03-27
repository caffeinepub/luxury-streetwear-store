import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Edit2,
  KeyRound,
  Loader2,
  Package,
  Plus,
  ShoppingBag,
  Trash2,
  Upload,
} from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import type { Product, ProductInput } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAddProduct,
  useAllOrders,
  useAllProducts,
  useDeleteProduct,
  useIsAdmin,
  useSeedProducts,
  useSetStripeSecretKey,
  useUpdateProduct,
} from "../hooks/useQueries";
import { useStorageClient } from "../hooks/useStorageClient";
import type { StorageClient } from "../utils/StorageClient";

const emptyForm: ProductInput = {
  name: "",
  brand: "",
  category: "Sneakers",
  price: 0,
  description: "",
  imageUrl: "",
  stock: 0n,
  featured: false,
};

function ProductForm({
  initial,
  onSubmit,
  isPending,
  onClose,
  storageClient,
}: {
  initial: ProductInput;
  onSubmit: (data: ProductInput) => void;
  isPending: boolean;
  onClose: () => void;
  storageClient: StorageClient | null;
}) {
  const [form, setForm] = useState<ProductInput>(initial);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof ProductInput>(key: K, value: ProductInput[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !storageClient) return;
    setUploading(true);
    setUploadProgress(0);
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const { hash } = await storageClient.putFile(bytes, setUploadProgress);
      const url = await storageClient.getDirectURL(hash);
      set("imageUrl", url);
      toast.success("Photo uploaded successfully");
    } catch {
      toast.error("Failed to upload photo");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
      className="space-y-4"
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-[10px] font-display uppercase tracking-widest text-muted-foreground block mb-1">
            Name
          </Label>
          <Input
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            required
            className="bg-background border-border text-foreground rounded-none"
            data-ocid="admin.input"
          />
        </div>
        <div>
          <Label className="text-[10px] font-display uppercase tracking-widest text-muted-foreground block mb-1">
            Brand
          </Label>
          <Input
            value={form.brand}
            onChange={(e) => set("brand", e.target.value)}
            required
            className="bg-background border-border text-foreground rounded-none"
            data-ocid="admin.input"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-[10px] font-display uppercase tracking-widest text-muted-foreground block mb-1">
            Category
          </Label>
          <Input
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
            required
            className="bg-background border-border text-foreground rounded-none"
            data-ocid="admin.input"
          />
        </div>
        <div>
          <Label className="text-[10px] font-display uppercase tracking-widest text-muted-foreground block mb-1">
            Price ($)
          </Label>
          <Input
            type="number"
            value={form.price}
            onChange={(e) => set("price", Number(e.target.value))}
            min={0}
            step={0.01}
            required
            className="bg-background border-border text-foreground rounded-none"
            data-ocid="admin.input"
          />
        </div>
      </div>
      <div>
        <Label className="text-[10px] font-display uppercase tracking-widest text-muted-foreground block mb-1">
          Description
        </Label>
        <Textarea
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          rows={3}
          className="bg-background border-border text-foreground rounded-none resize-none"
          data-ocid="admin.textarea"
        />
      </div>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Label className="text-[10px] font-display uppercase tracking-widest text-muted-foreground">
            Photo
          </Label>
          {form.imageUrl && (
            <img
              src={form.imageUrl}
              alt="preview"
              className="w-10 h-10 object-cover border border-border"
            />
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          data-ocid="admin.upload_button"
        />
        <button
          type="button"
          disabled={uploading || !storageClient}
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 border border-border text-foreground font-display font-bold uppercase tracking-widest text-xs px-4 py-2 hover:bg-foreground hover:text-background transition-all disabled:opacity-50 mb-2"
          data-ocid="admin.upload_button"
        >
          {uploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          {uploading ? `Uploading ${uploadProgress}%` : "Upload Photo"}
        </button>
        {uploading && (
          <div className="w-full bg-border h-0.5 mb-2">
            <div
              className="bg-foreground h-0.5 transition-all"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}
        <Input
          value={form.imageUrl}
          onChange={(e) => set("imageUrl", e.target.value)}
          placeholder="https://... (or upload above)"
          className="bg-background border-border text-foreground rounded-none"
          data-ocid="admin.input"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-[10px] font-display uppercase tracking-widest text-muted-foreground block mb-1">
            Stock
          </Label>
          <Input
            type="number"
            value={Number(form.stock)}
            onChange={(e) => set("stock", BigInt(e.target.value || "0"))}
            min={0}
            className="bg-background border-border text-foreground rounded-none"
            data-ocid="admin.input"
          />
        </div>
        <div className="flex items-end gap-3 pb-1">
          <Switch
            checked={form.featured}
            onCheckedChange={(v) => set("featured", v)}
            data-ocid="admin.switch"
          />
          <Label className="text-[10px] font-display uppercase tracking-widest text-muted-foreground">
            Featured
          </Label>
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 flex items-center justify-center gap-2 bg-foreground text-background font-display font-bold uppercase tracking-widest text-xs py-3 hover:opacity-80 transition-opacity disabled:opacity-50"
          data-ocid="admin.submit_button"
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Check className="w-4 h-4" />
          )}
          {isPending ? "Saving..." : "Save Product"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-6 border border-border text-foreground font-display font-bold uppercase tracking-widest text-xs hover:border-foreground hover:bg-foreground hover:text-background transition-all"
          data-ocid="admin.cancel_button"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function AdminPage() {
  const { login, identity, isLoggingIn } = useInternetIdentity();
  const { data: isAdmin, isLoading: isAdminLoading } = useIsAdmin();
  const { data: products, isLoading: productsLoading } = useAllProducts();
  const { data: orders, isLoading: ordersLoading } = useAllOrders();
  const addProduct = useAddProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const seedProducts = useSeedProducts();
  const storageClient = useStorageClient();

  const [addOpen, setAddOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [stripeKey, setStripeKey] = useState("");
  const setStripeSecretKey = useSetStripeSecretKey();
  const [sortAsc, setSortAsc] = useState(true);

  const handleAdd = async (data: ProductInput) => {
    try {
      await addProduct.mutateAsync(data);
      setAddOpen(false);
      toast.success("Product added successfully");
    } catch {
      toast.error("Failed to add product");
    }
  };

  const handleEdit = async (data: ProductInput) => {
    if (!editProduct) return;
    try {
      await updateProduct.mutateAsync({ id: editProduct.id, input: data });
      setEditProduct(null);
      toast.success("Product updated successfully");
    } catch {
      toast.error("Failed to update product");
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteProduct.mutateAsync(id);
      toast.success("Product deleted");
    } catch {
      toast.error("Failed to delete product");
    }
  };

  const handleSeed = async () => {
    try {
      await seedProducts.mutateAsync();
      toast.success("Products seeded!");
    } catch {
      toast.error("Failed to seed products");
    }
  };

  if (!identity) {
    return (
      <main
        className="pt-16 min-h-screen flex items-center justify-center"
        data-ocid="admin.section"
      >
        <div className="text-center">
          <h2 className="font-display font-black uppercase text-4xl tracking-tight text-foreground mb-4">
            Admin Panel
          </h2>
          <p className="text-muted-foreground mb-8">
            Please login to access the admin panel.
          </p>
          <button
            type="button"
            onClick={login}
            disabled={isLoggingIn}
            className="flex items-center gap-2 mx-auto bg-foreground text-background font-display font-bold uppercase tracking-widest text-xs px-10 py-4 hover:opacity-80 transition-opacity disabled:opacity-50"
            data-ocid="admin.primary_button"
          >
            {isLoggingIn && <Loader2 className="w-4 h-4 animate-spin" />}
            Login to Continue
          </button>
        </div>
      </main>
    );
  }

  if (isAdminLoading) {
    return (
      <main
        className="pt-16 min-h-screen flex items-center justify-center"
        data-ocid="admin.loading_state"
      >
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main
        className="pt-16 min-h-screen flex items-center justify-center"
        data-ocid="admin.error_state"
      >
        <div className="text-center">
          <h2 className="font-display font-black uppercase text-4xl tracking-tight text-foreground mb-4">
            Access Denied
          </h2>
          <p className="text-muted-foreground">
            You don't have admin privileges.
          </p>
        </div>
      </main>
    );
  }

  const handleSaveStripeKey = async () => {
    if (!stripeKey.trim()) {
      toast.error("Please enter a Stripe secret key.");
      return;
    }
    try {
      await setStripeSecretKey.mutateAsync(stripeKey);
      toast.success("Stripe secret key saved successfully.");
      setStripeKey("");
    } catch {
      toast.error("Failed to save Stripe key. Please try again.");
    }
  };

  const sortedProducts = products
    ? [...products].sort((a, b) =>
        sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name),
      )
    : [];

  return (
    <main className="pt-16" data-ocid="admin.section">
      <div className="max-w-screen-xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-12">
          <div>
            <p className="text-[10px] font-display font-semibold uppercase tracking-[0.4em] text-muted-foreground mb-2">
              Management
            </p>
            <h1 className="font-display font-black uppercase text-4xl tracking-tight text-foreground">
              Admin Panel
            </h1>
          </div>
          <div className="flex gap-3">
            {products && products.length === 0 && (
              <button
                type="button"
                onClick={handleSeed}
                disabled={seedProducts.isPending}
                className="flex items-center gap-2 border border-border text-foreground font-display font-bold uppercase tracking-widest text-xs px-6 py-3 hover:bg-foreground hover:text-background transition-all"
                data-ocid="admin.secondary_button"
              >
                {seedProducts.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Package className="w-4 h-4" />
                )}
                Seed Products
              </button>
            )}
            <Dialog open={addOpen} onOpenChange={setAddOpen}>
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-2 bg-foreground text-background font-display font-bold uppercase tracking-widest text-xs px-6 py-3 hover:opacity-80 transition-opacity"
                  data-ocid="admin.open_modal_button"
                >
                  <Plus className="w-4 h-4" /> Add Product
                </button>
              </DialogTrigger>
              <DialogContent
                className="bg-background border-border max-w-lg rounded-none"
                data-ocid="admin.dialog"
              >
                <DialogHeader>
                  <DialogTitle className="font-display font-black uppercase tracking-tight text-foreground">
                    Add Product
                  </DialogTitle>
                </DialogHeader>
                <ProductForm
                  initial={emptyForm}
                  onSubmit={handleAdd}
                  isPending={addProduct.isPending}
                  onClose={() => setAddOpen(false)}
                  storageClient={storageClient}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Dialog
          open={!!editProduct}
          onOpenChange={(v) => !v && setEditProduct(null)}
        >
          <DialogContent
            className="bg-background border-border max-w-lg rounded-none"
            data-ocid="admin.dialog"
          >
            <DialogHeader>
              <DialogTitle className="font-display font-black uppercase tracking-tight text-foreground">
                Edit Product
              </DialogTitle>
            </DialogHeader>
            {editProduct && (
              <ProductForm
                initial={{
                  name: editProduct.name,
                  brand: editProduct.brand,
                  category: editProduct.category,
                  price: editProduct.price,
                  description: editProduct.description,
                  imageUrl: editProduct.imageUrl,
                  stock: editProduct.stock,
                  featured: editProduct.featured,
                }}
                onSubmit={handleEdit}
                isPending={updateProduct.isPending}
                onClose={() => setEditProduct(null)}
                storageClient={storageClient}
              />
            )}
          </DialogContent>
        </Dialog>

        <Tabs defaultValue="products" className="w-full" data-ocid="admin.tab">
          <TabsList className="bg-card-dark border border-border rounded-none h-auto p-0 mb-8">
            <TabsTrigger
              value="products"
              className="font-display font-semibold uppercase text-xs tracking-widest px-8 py-3 rounded-none data-[state=active]:bg-foreground data-[state=active]:text-background"
              data-ocid="admin.tab"
            >
              <Package className="w-4 h-4 mr-2" /> Products
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="font-display font-semibold uppercase text-xs tracking-widest px-8 py-3 rounded-none data-[state=active]:bg-foreground data-[state=active]:text-background"
              data-ocid="admin.tab"
            >
              <ShoppingBag className="w-4 h-4 mr-2" /> Orders
            </TabsTrigger>
            <TabsTrigger
              value="stripe"
              className="font-display font-semibold uppercase text-xs tracking-widest px-8 py-3 rounded-none data-[state=active]:bg-foreground data-[state=active]:text-background"
              data-ocid="admin.tab"
            >
              <KeyRound className="w-4 h-4 mr-2" /> Stripe
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            {productsLoading ? (
              <div className="space-y-2" data-ocid="admin.loading_state">
                {["r1", "r2", "r3", "r4", "r5"].map((k) => (
                  <Skeleton key={k} className="h-16 w-full bg-card-dark" />
                ))}
              </div>
            ) : (
              <div
                className="border border-border overflow-x-auto"
                data-ocid="admin.table"
              >
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-card-dark">
                      <th className="text-left px-4 py-3">
                        <button
                          type="button"
                          onClick={() => setSortAsc((v) => !v)}
                          className="flex items-center gap-1 text-[10px] font-display font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                          data-ocid="admin.button"
                        >
                          Name{" "}
                          {sortAsc ? (
                            <ChevronUp className="w-3 h-3" />
                          ) : (
                            <ChevronDown className="w-3 h-3" />
                          )}
                        </button>
                      </th>
                      <th className="text-left px-4 py-3 text-[10px] font-display font-semibold uppercase tracking-widest text-muted-foreground hidden sm:table-cell">
                        Brand
                      </th>
                      <th className="text-left px-4 py-3 text-[10px] font-display font-semibold uppercase tracking-widest text-muted-foreground hidden md:table-cell">
                        Category
                      </th>
                      <th className="text-left px-4 py-3 text-[10px] font-display font-semibold uppercase tracking-widest text-muted-foreground">
                        Price
                      </th>
                      <th className="text-left px-4 py-3 text-[10px] font-display font-semibold uppercase tracking-widest text-muted-foreground hidden md:table-cell">
                        Stock
                      </th>
                      <th className="text-left px-4 py-3 text-[10px] font-display font-semibold uppercase tracking-widest text-muted-foreground hidden lg:table-cell">
                        Featured
                      </th>
                      <th className="text-right px-4 py-3 text-[10px] font-display font-semibold uppercase tracking-widest text-muted-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedProducts.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="text-center py-16 text-muted-foreground text-sm"
                          data-ocid="admin.empty_state"
                        >
                          No products found. Click "Seed Products" to populate.
                        </td>
                      </tr>
                    ) : (
                      sortedProducts.map((product, i) => (
                        <motion.tr
                          key={product.id.toString()}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.03 }}
                          className="border-b border-border hover:bg-card-dark transition-colors"
                          data-ocid={`admin.row.${i + 1}`}
                        >
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-image-mat shrink-0 overflow-hidden">
                                <img
                                  src={
                                    product.imageUrl ||
                                    `https://placehold.co/100x100/f2f2f2/111111?text=${encodeURIComponent(product.name)}`
                                  }
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <span className="font-display font-semibold text-xs text-foreground truncate max-w-[140px]">
                                {product.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-xs text-muted-foreground hidden sm:table-cell">
                            {product.brand}
                          </td>
                          <td className="px-4 py-4 text-xs text-muted-foreground hidden md:table-cell">
                            {product.category}
                          </td>
                          <td className="px-4 py-4 text-xs font-display font-semibold text-foreground">
                            ${product.price.toLocaleString()}
                          </td>
                          <td className="px-4 py-4 text-xs text-muted-foreground hidden md:table-cell">
                            {product.stock.toString()}
                          </td>
                          <td className="px-4 py-4 hidden lg:table-cell">
                            {product.featured ? (
                              <span className="text-[10px] font-display font-semibold uppercase tracking-widest bg-foreground text-background px-2 py-0.5">
                                Yes
                              </span>
                            ) : (
                              <span className="text-[10px] text-muted-foreground">
                                —
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => setEditProduct(product)}
                                className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                                data-ocid={`admin.edit_button.${i + 1}`}
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <button
                                    type="button"
                                    className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                                    data-ocid={`admin.delete_button.${i + 1}`}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </AlertDialogTrigger>
                                <AlertDialogContent
                                  className="bg-background border-border rounded-none"
                                  data-ocid="admin.dialog"
                                >
                                  <AlertDialogHeader>
                                    <AlertDialogTitle className="font-display font-black uppercase tracking-tight text-foreground">
                                      Delete Product?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription className="text-muted-foreground">
                                      This will permanently delete{" "}
                                      <strong className="text-foreground">
                                        {product.name}
                                      </strong>
                                      . This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel
                                      className="bg-transparent border-border text-foreground rounded-none font-display font-bold uppercase tracking-widest text-xs hover:border-foreground hover:bg-foreground hover:text-background"
                                      data-ocid="admin.cancel_button"
                                    >
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(product.id)}
                                      className="bg-destructive text-destructive-foreground rounded-none font-display font-bold uppercase tracking-widest text-xs hover:opacity-90"
                                      data-ocid="admin.confirm_button"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="orders">
            {ordersLoading ? (
              <div className="space-y-2" data-ocid="admin.loading_state">
                {["o1", "o2", "o3", "o4", "o5"].map((k) => (
                  <Skeleton key={k} className="h-16 w-full bg-card-dark" />
                ))}
              </div>
            ) : (
              <div
                className="border border-border overflow-x-auto"
                data-ocid="admin.table"
              >
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-card-dark">
                      <th className="text-left px-4 py-3 text-[10px] font-display font-semibold uppercase tracking-widest text-muted-foreground">
                        Order ID
                      </th>
                      <th className="text-left px-4 py-3 text-[10px] font-display font-semibold uppercase tracking-widest text-muted-foreground hidden sm:table-cell">
                        Customer
                      </th>
                      <th className="text-left px-4 py-3 text-[10px] font-display font-semibold uppercase tracking-widest text-muted-foreground hidden md:table-cell">
                        Email
                      </th>
                      <th className="text-left px-4 py-3 text-[10px] font-display font-semibold uppercase tracking-widest text-muted-foreground">
                        Total
                      </th>
                      <th className="text-left px-4 py-3 text-[10px] font-display font-semibold uppercase tracking-widest text-muted-foreground hidden sm:table-cell">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {!orders || orders.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="text-center py-16 text-muted-foreground text-sm"
                          data-ocid="admin.empty_state"
                        >
                          No orders yet.
                        </td>
                      </tr>
                    ) : (
                      orders.map((order, i) => (
                        <tr
                          key={order.id.toString()}
                          className="border-b border-border hover:bg-card-dark transition-colors"
                          data-ocid={`admin.row.${i + 1}`}
                        >
                          <td className="px-4 py-4 text-xs font-display font-bold text-foreground">
                            #{order.id.toString()}
                          </td>
                          <td className="px-4 py-4 text-xs text-foreground hidden sm:table-cell">
                            {order.customerName}
                          </td>
                          <td className="px-4 py-4 text-xs text-muted-foreground hidden md:table-cell">
                            {order.customerEmail}
                          </td>
                          <td className="px-4 py-4 text-xs font-display font-semibold text-foreground">
                            ${order.total.toLocaleString()}
                          </td>
                          <td className="px-4 py-4 hidden sm:table-cell">
                            <span className="text-[10px] font-display font-semibold uppercase tracking-widest border border-border px-2 py-0.5 text-muted-foreground">
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="stripe">
            <div className="max-w-lg">
              <div className="border border-border bg-card-dark p-8">
                <div className="flex items-center gap-3 mb-6">
                  <KeyRound className="w-5 h-5 text-foreground" />
                  <h2 className="font-display font-bold uppercase text-sm tracking-widest text-foreground">
                    Stripe Settings
                  </h2>
                </div>
                <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
                  Enter your Stripe secret key to enable real payments. Use{" "}
                  <span className="text-foreground font-mono">sk_test_...</span>{" "}
                  for testing or{" "}
                  <span className="text-foreground font-mono">sk_live_...</span>{" "}
                  for production.
                </p>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="stripe-key"
                      className="text-[10px] font-display uppercase tracking-widest text-muted-foreground mb-1.5 block"
                    >
                      Stripe Secret Key
                    </label>
                    <input
                      id="stripe-key"
                      type="password"
                      value={stripeKey}
                      onChange={(e) => setStripeKey(e.target.value)}
                      placeholder="sk_live_... or sk_test_..."
                      className="w-full bg-background border border-border text-foreground placeholder:text-muted-foreground focus:border-foreground outline-none px-4 py-3 text-sm font-mono"
                      data-ocid="admin.input"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSaveStripeKey}
                    disabled={setStripeSecretKey.isPending}
                    className="flex items-center gap-2 bg-foreground text-background font-display font-bold uppercase tracking-widest text-xs px-8 py-3 hover:opacity-80 transition-opacity disabled:opacity-50"
                    data-ocid="admin.save_button"
                  >
                    {setStripeSecretKey.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" /> Save Key
                      </>
                    )}
                  </button>
                  {setStripeSecretKey.isSuccess && (
                    <p
                      className="text-xs text-foreground font-display uppercase tracking-widest"
                      data-ocid="admin.success_state"
                    >
                      Key saved successfully.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
