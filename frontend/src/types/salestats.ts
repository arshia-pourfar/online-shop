export type SaleStats = {
    id: number;         // or string if using UUID
    year: number;
    month: number;      // or string if month name is a string
    orderCount: number;
    revenue: number;
    createdAt: Date;
};