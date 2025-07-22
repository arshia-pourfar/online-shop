import { User } from './user';

export type OrderItem = {
    id: string;
    productId: string;
    quantity: number;
};

export type Order = {
    id: string;
    userId: string;
    total: number;
    status: string;
    createdAt: string; // or Date
    items: OrderItem[];
    user?: User;
};
