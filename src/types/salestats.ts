export type SaleStats = {
    id: number;         // یا string اگر UUID استفاده می‌کنی
    year: number;
    month: number;      // یا string اگر نام ماه به صورت رشته هست
    orderCount: number;
    revenue: number;
    createdAt: Date;
};