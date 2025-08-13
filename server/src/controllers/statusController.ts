// server/src/controller/statusController.ts
import { Request, Response } from "express";

export const getProductStatuses = (req: Request, res: Response) => {
    const statuses = [
        "AVAILABLE",
        "OUT_OF_STOCK",
        "DISCONTINUED",
        "COMING_SOON",
        "HIDDEN",
    ];
    res.json(statuses);
};
export const getCustomerStatuses = (req: Request, res: Response) => {
    const statuses = [
        "ACTIVE",
        "INACTIVE",
        "PENDING",
        "SUSPENDED",
    ];
    res.json(statuses);
};
export const getOrderStatuses = (req: Request, res: Response) => {
    const statuses = [
        "PENDING",
        "PROCESSING",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED",
    ];
    res.json(statuses);
};