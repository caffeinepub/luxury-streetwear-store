import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ProductInput {
    featured: boolean;
    name: string;
    description: string;
    stock: bigint;
    imageUrl: string;
    category: string;
    brand: string;
    price: number;
}
export interface OrderItem {
    productId: bigint;
    quantity: bigint;
    price: number;
}
export interface Order {
    id: bigint;
    customerName: string;
    status: string;
    total: number;
    createdAt: bigint;
    items: Array<OrderItem>;
    customerEmail: string;
}
export interface Product {
    id: bigint;
    featured: boolean;
    name: string;
    description: string;
    stock: bigint;
    imageUrl: string;
    category: string;
    brand: string;
    price: number;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addProduct(input: ProductInput): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteProduct(productId: bigint): Promise<void>;
    getAllOrders(): Promise<Array<Order>>;
    getAllProducts(): Promise<Array<Product>>;
    getAllProductsSortedByCategory(): Promise<Array<Product>>;
    getCallerUserRole(): Promise<UserRole>;
    getFeaturedProducts(): Promise<Array<Product>>;
    getOrderById(orderId: bigint): Promise<Order | null>;
    getOrderCount(): Promise<bigint>;
    getProductById(productId: bigint): Promise<Product | null>;
    getProductCount(): Promise<bigint>;
    getProductsByCategory(category: string): Promise<Array<Product>>;
    getProductsByCategoryAndPriceRange(category: string, minPrice: number, maxPrice: number): Promise<Array<Product>>;
    getProductsByPriceRange(minPrice: number, maxPrice: number): Promise<Array<Product>>;
    isCallerAdmin(): Promise<boolean>;
    placeOrder(customerName: string, customerEmail: string, items: Array<OrderItem>): Promise<bigint>;
    seedProductsOnce(): Promise<void>;
    updateProduct(productId: bigint, product: ProductInput): Promise<void>;
}
