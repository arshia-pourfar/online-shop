"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductStatuses = void 0;
const getProductStatuses = (req, res) => {
    const statuses = [
        "AVAILABLE",
        "OUT_OF_STOCK",
        "DISCONTINUED",
        "COMING_SOON",
        "HIDDEN",
    ];
    res.json(statuses);
};
exports.getProductStatuses = getProductStatuses;
// // controllers/statusController.ts
// import prisma from "../../prisma/prisma";
// import { Request, Response } from "express";
// export const getStatuses = async (req: Request, res: Response) => {
//     try {
//         const statuses = await prisma.productStatus.findMany(); // ✅ دقت به حروف بزرگ و کوچیک مهمه!
//         res.json(statuses);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'خطا در دریافت وضعیت‌ها' });
//     }
// };
