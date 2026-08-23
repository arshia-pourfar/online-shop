import { Product } from "./product";

export type Favorite = {
    id: number;
    userId: string;
    productId: number;
    createdAt: string;
    product: Product;
};