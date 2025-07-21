import { Category } from "./category";

// src/types/product.ts
export type Product = {
    id: number;
    name: string;
    price: number;
    stock: number;
    category: Category | string;
    status: string;
    imageUrl: string;
    description: string | null;
    createdAt?: string;
};
