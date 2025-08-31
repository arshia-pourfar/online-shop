import { User } from './user';

export type OrderItem = {
    id: number;
    productId: number;
    productName: string;
    quantity: number;
    product?: {
        imageUrl: string;
        price: number;
        name: string;
        description: string;
    };
};

export type CartItem = {
    id: number;
    quantity: number;
    product: {
        id: number;
        name: string;
        price: number;
        imageUrl: string;
        description: string;
    };
};

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