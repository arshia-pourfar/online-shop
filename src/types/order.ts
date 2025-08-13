import { User } from './user';

export type OrderItem = {
    id: number;
    productId: number;
    productName: string;
    quantity: number;
    price: number;
};

export interface CartItem {
    id: string; // اگر Product.id رو به UUID تغییر بدی، این درست می‌مونه
    name: string;
    imageUrl: string | null;
    description?: string | null;
    price: number;
    quantity: number;
    orderId?: string;
}

export type Order = {
    id: string;
    userId: string;
    total: number;
    createdAt: string;
    user?: User;
    customerName: string;
    status: string;
    items: OrderItem[];
    shippingAddress: string;
};

export type OrderField = keyof Order; // کلیدهای مستقیم Order
export type SortableField = keyof Order | "user.email" | "user.phone";