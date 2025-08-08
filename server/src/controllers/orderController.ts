// src/controllers/orderController.ts

import { Request, Response } from 'express';
import {prisma} from '../../prisma/prisma';

// GET /orders - دریافت همه سفارش‌ها
export const getAllOrders = async (_: Request, res: Response) => {
    try {
        const orders = await prisma.order.findMany({
            include: {
                items: {
                    include: {
                        product: true, // اگر نیاز دارید اطلاعات محصول هم باشد
                    },
                },
                user: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        res.json(orders);
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error('[getAllOrders]', err.message);
        }
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};

// GET /orders/:id - دریافت سفارش بر اساس آیدی
export const getOrderById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                user: true,
            },
        });
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json(order);
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error('[getOrderById]', err.message);
        }
        res.status(500).json({ error: 'Failed to fetch order' });
    }
};

// POST /orders - ساخت سفارش جدید
export const createOrder = async (req: Request, res: Response) => {
    const { userId, items, total, status, customerName, shippingAddress } = req.body;

    if (!userId || !customerName || !shippingAddress || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const newOrder = await prisma.order.create({
            data: {
                userId,
                customerName,
                shippingAddress,
                total,
                status,
                items: {
                    create: items.map((item: { productId: number; quantity: number }) => ({
                        quantity: item.quantity,
                        product: {
                            connect: {
                                id: item.productId,
                            },
                        },
                    })),
                },
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                user: true,
            },
        });

        res.status(201).json(newOrder);
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error("[createOrder]", err.message);
        }
        res.status(500).json({ error: "Failed to create order" });
    }
};


// DELETE /orders/:id - حذف سفارش
export const deleteOrder = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.order.delete({ where: { id } });
        res.json({ message: 'Order deleted successfully' });
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error('[deleteOrder]', err.message);
        }
        res.status(500).json({ error: 'Failed to delete order' });
    }
};
