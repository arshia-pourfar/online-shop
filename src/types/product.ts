// src/types/product.ts
export type Product = {
    id: string;
    name: string;
    price: number;
    description: string | null;
    imageUrl: string | null;
    createdAt: string; // یا Date
};
