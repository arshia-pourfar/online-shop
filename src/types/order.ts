import { User } from './user';

export type OrderItem = {
    id: string;
    productId: number;
    productName: string;
    quantity: number;
    price: number;
};

export type Order = {
    id: string;
    userId: string;
    total: number;
    createdAt: string; // or Date
    user?: User;
    customerId: number | string;
    customerName: string;
    orderDate: string; // ISO string format for easy sorting and display
    totalAmount: number;
    status: string;
    items: OrderItem[];
    shippingAddress: string;
};

export type SortableField = keyof Order | "email";