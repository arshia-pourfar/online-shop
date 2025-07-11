import { Request, Response } from 'express';
import prisma from '../../prisma/prisma';

export const getAllOrders = async (_: Request, res: Response) => {
    try {
        const orders = await prisma.order.findMany({
            include: {
                items: true,
                user: true,
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

export const getOrderById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                items: true,
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

export const createOrder = async (req: Request, res: Response) => {
    const { userId, items, total, status } = req.body;
    try {
        const newOrder = await prisma.order.create({
            data: {
                userId,
                total,
                status,
                items: {
                    create: items.map((item: { productId: string; quantity: number }) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                    })),
                },
            },
        });
        res.status(201).json(newOrder);
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error('[createOrder]', err.message);
        }
        res.status(500).json({ error: 'Failed to create order' });
    }
};

export const deleteOrder = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.order.delete({ where: { id } });
        res.json({ message: 'Order deleted' });
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error('[deleteOrder]', err.message);
        }
        res.status(500).json({ error: 'Failed to delete order' });
    }
};
