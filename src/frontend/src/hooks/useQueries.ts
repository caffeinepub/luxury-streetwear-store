import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { OrderItem, ProductInput } from "../backend";
import { useActor } from "./useActor";

export function useAllProducts() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useFeaturedProducts() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["featured-products"],
    queryFn: async () => {
      if (!actor) return [];
      const featured = await actor.getFeaturedProducts();
      if (featured.length > 0) return featured;
      return actor.getAllProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useProductById(id: bigint | undefined) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["product", id?.toString()],
    queryFn: async () => {
      if (!actor || id === undefined) return null;
      return actor.getProductById(id);
    },
    enabled: !!actor && !isFetching && id !== undefined,
  });
}

export function useProductsByCategory(category: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["products-by-category", category],
    queryFn: async () => {
      if (!actor) return [];
      if (category === "All") return actor.getAllProducts();
      return actor.getProductsByCategory(category);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["is-admin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllOrders() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllOrders();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSeedProducts() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.seedProductsOnce();
    },
  });
}

export function useAddProduct() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: ProductInput) => {
      if (!actor) throw new Error("No actor");
      return actor.addProduct(input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["featured-products"] });
    },
  });
}

export function useUpdateProduct() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: bigint; input: ProductInput }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateProduct(id, input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["featured-products"] });
    },
  });
}

export function useDeleteProduct() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteProduct(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["featured-products"] });
    },
  });
}

export function usePlaceOrder() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      customerName,
      customerEmail,
      items,
    }: {
      customerName: string;
      customerEmail: string;
      items: OrderItem[];
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.placeOrder(customerName, customerEmail, items);
    },
  });
}

export function useCreateStripeCheckout() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      customerName,
      customerEmail,
      items,
      successUrl,
      cancelUrl,
    }: {
      customerName: string;
      customerEmail: string;
      items: OrderItem[];
      successUrl: string;
      cancelUrl: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return (actor as any).createStripeCheckout(
        customerName,
        customerEmail,
        items,
        successUrl,
        cancelUrl,
      );
    },
  });
}

export function useSetStripeSecretKey() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (key: string) => {
      if (!actor) throw new Error("No actor");
      return (actor as any).setStripeSecretKey(key);
    },
  });
}
