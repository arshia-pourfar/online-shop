export interface Order {
    id: string;
    customer: string;
    total: number;
    status: 'pending' | 'completed' | 'delivered' | 'cancelled';
    createdAt: string;
} 