import { Request, Response } from 'express';
import { prisma } from '../../prisma/prisma';
import { getOrderStatuses, OrderStatusType } from '../utils/status.utils'; // مسیر رو با توجه به ساختار پروژه تنظیم کن

// GET /orders - دریافت همه سفارش‌ها
export const getAllOrders = async (_: Request, res: Response) => {
    try {
        const orders = await prisma.order.findMany({
            include: {
                items: {
                    include: {
                        product: true,
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
            console.error('[createOrder] Full error:', err.message);
            res.status(500).json({ error: err.message });
        } else {
            console.error('[createOrder] Unknown error:', err);
            res.status(500).json({ error: 'Unexpected error occurred' });
        }
    }
};

// GET /orders/:id - دریافت سفارش خاص
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
            console.error('[createOrder] Full error:', err.message);
            res.status(500).json({ error: err.message });
        } else {
            console.error('[createOrder] Unknown error:', err);
            res.status(500).json({ error: 'Unexpected error occurred' });
        }
    }
};

export const addItemToOrder = async (req: Request, res: Response) => {
    const { orderId } = req.params;
    const { productId, quantity } = req.body;

    try {
        const existingItem = await prisma.orderItem.findFirst({
            where: {
                orderId,
                productId,
            },
        });

        let item;

        if (existingItem) {
            item = await prisma.orderItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + quantity },
                include: { product: true },
            });
        } else {
            item = await prisma.orderItem.create({
                data: {
                    orderId,
                    productId,
                    quantity,
                },
                include: { product: true },
            });
        }

        res.status(201).json(item);
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error("[addItemToOrder]", err.message);
        }
        res.status(500).json({ error: "Failed to add item to order" });
    }
};

// DELETE /api/orders/items/:id - حذف آیتم از سفارش
export const deleteOrderItem = async (req: Request, res: Response) => {
    const rawId = req.params.id;
    const id = parseInt(rawId, 10);

    if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid item ID" });
    }

    try {
        await prisma.orderItem.delete({
            where: { id },
        });

        res.json({ message: "Item deleted successfully" });
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error("[deleteOrderItem]", err.message);
        }
        res.status(500).json({ error: "Failed to delete item" });
    }
};

export const updateOrderItemQuantity = async (req: Request, res: Response) => {
    const rawId = req.params.id;
    const id = parseInt(rawId, 10);
    const { quantity } = req.body;

    if (isNaN(id) || typeof quantity !== "number" || quantity < 1) {
        return res.status(400).json({ error: "Invalid input" });
    }

    try {
        const updated = await prisma.orderItem.update({
            where: { id },
            data: { quantity },
        });

        res.json(updated);
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error("[updateOrderItemQuantity]", err.message);
        }
        res.status(500).json({ error: "Failed to update quantity" });
    }
};


export const getPendingOrderByUser = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const rawStatus = req.query.status as string;

    // remove for vercel
    // const status = Object.values(OrderStatus).includes(rawStatus as OrderStatus)
    //     ? (rawStatus as OrderStatus)
    //     : OrderStatus.PENDING;

    const validStatuses = getOrderStatuses();
    const status: OrderStatusType = validStatuses.includes(rawStatus as OrderStatusType)
        ? (rawStatus as OrderStatusType)
        : "PENDING";

    try {
        const order = await prisma.order.findFirst({
            where: {
                userId,
                status: status, // اینجا فقط رشته می‌فرستی، نه enum
            },
            include: {
                items: { include: { product: true } },
                user: true,
            },
        });


        if (!order) return res.status(200).json(null);
        res.json(order);
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error("[getPendingOrderByUser]", err.message);
        }
        res.status(500).json({ error: "Failed to fetch pending order" });
    }
};

// POST /orders - ساخت سفارش جدید
export const createOrder = async (req: Request, res: Response) => {
    try {
        const { userId, items, total, status, customerName, shippingAddress } = req.body;

        console.log("Incoming payload:", req.body);

        if (!userId || !customerName || !shippingAddress || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const order = await prisma.order.create({
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
                            connect: { id: item.productId },
                        },
                    })),
                },
            },
            include: {
                items: { include: { product: true } },
                user: true,
            },
        });

        res.status(201).json(order);
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error('[createOrder] Full error:', err.message);
            res.status(500).json({ error: err.message });
        } else {
            console.error('[createOrder] Unknown error:', err);
            res.status(500).json({ error: 'Unexpected error occurred' });
        }
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
            console.error('[createOrder] Full error:', err.message);
            res.status(500).json({ error: err.message });
        } else {
            console.error('[createOrder] Unknown error:', err);
            res.status(500).json({ error: 'Unexpected error occurred' });
        }
    }
};