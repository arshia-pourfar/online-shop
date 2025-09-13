import { Request, Response } from 'express';
import { prisma } from '../../prisma/prisma';
import { OrderStatus } from '@prisma/client';

// ===== Helper برای محاسبه total =====
const recalcOrderTotal = async (orderId: string) => {
    const items = await prisma.orderItem.findMany({
        where: { orderId },
        include: { product: true },
    });

    const total = items.reduce(
        (sum, item) => sum + item.quantity * (item.product.price || 0),
        0
    );

    await prisma.order.update({
        where: { id: orderId },
        data: { total },
    });

    return total;
};

// ===== GET /orders =====
export const getAllOrders = async (_: Request, res: Response) => {
    try {
        const orders = await prisma.order.findMany({
            include: {
                items: { include: { product: true } },
                user: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json(orders);
    } catch (err: unknown) {
        console.error('[getAllOrders]', err);
        res.status(500).json({ error: 'Unexpected error occurred' });
    }
};

// ===== GET /orders/user/:userId/all =====
export const getAllOrdersByUser = async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
        const orders = await prisma.order.findMany({
            where: { userId },
            include: {
                items: { include: { product: true } },
                user: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json(orders);
    } catch (err: unknown) {
        console.error('[getAllOrdersByUser]', err);
        res.status(500).json({ error: 'Unexpected error occurred' });
    }
};

// ===== GET /orders/:id =====
export const getOrderById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const order = await prisma.order.findUnique({
            where: { id },
            include: { items: { include: { product: true } }, user: true },
        });
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json(order);
    } catch (err: unknown) {
        console.error('[getOrderById]', err);
        res.status(500).json({ error: 'Unexpected error occurred' });
    }
};

// ===== POST /orders/:orderId/items =====
export const addItemToOrder = async (req: Request, res: Response) => {
    const { orderId } = req.params;
    const { productId, quantity } = req.body;

    try {
        let item;
        const existingItem = await prisma.orderItem.findFirst({
            where: { orderId, productId },
        });

        if (existingItem) {
            item = await prisma.orderItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + quantity },
                include: { product: true },
            });
        } else {
            item = await prisma.orderItem.create({
                data: { orderId, productId, quantity },
                include: { product: true },
            });
        }

        await recalcOrderTotal(orderId); // 👈 بروزرسانی total بعد از تغییر
        res.status(201).json(item);
    } catch (err: unknown) {
        console.error("[addItemToOrder]", err);
        res.status(500).json({ error: "Failed to add item to order" });
    }
};

// ===== DELETE /orders/items/:id =====
export const deleteOrderItem = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid item ID" });

    try {
        const item = await prisma.orderItem.findUnique({ where: { id } });
        if (!item) return res.status(404).json({ error: "Item not found" });

        await prisma.orderItem.delete({ where: { id } });
        await recalcOrderTotal(item.orderId); // 👈 بروزرسانی total بعد از حذف
        res.json({ message: "Item deleted successfully" });
    } catch (err: unknown) {
        console.error("[deleteOrderItem]", err);
        res.status(500).json({ error: "Failed to delete item" });
    }
};

// ===== PATCH /orders/items/:id =====
export const updateOrderItemQuantity = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const { quantity } = req.body;
    if (isNaN(id) || typeof quantity !== "number" || quantity < 1)
        return res.status(400).json({ error: "Invalid input" });

    try {
        const item = await prisma.orderItem.update({
            where: { id },
            data: { quantity },
        });
        await recalcOrderTotal(item.orderId); // 👈 بروزرسانی total بعد از تغییر تعداد
        res.json(item);
    } catch (err: unknown) {
        console.error("[updateOrderItemQuantity]", err);
        res.status(500).json({ error: "Failed to update quantity" });
    }
};

// ===== GET /orders/user/:userId/pending =====
export const getPendingOrderByUser = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const rawStatus = req.query.status as string;
    const status = Object.values(OrderStatus).includes(rawStatus as OrderStatus)
        ? (rawStatus as OrderStatus)
        : OrderStatus.PENDING;

    try {
        const order = await prisma.order.findFirst({
            where: { userId, status },
            include: { items: { include: { product: true } }, user: true },
        });
        res.json(order || null);
    } catch (err: unknown) {
        console.error("[getPendingOrderByUser]", err);
        res.status(500).json({ error: "Failed to fetch pending order" });
    }
};

// ===== POST /orders =====
export const createOrder = async (req: Request, res: Response) => {
    try {
        const { userId, items, status, customerName, addressId } = req.body;
        if (!userId || !customerName || !addressId)
            return res.status(400).json({ error: "Missing required fields" });

        const order = await prisma.order.create({
            data: {
                userId,
                customerName,
                addressId,
                total: 0,
                status: status || "PENDING",
                items: items?.length
                    ? {
                        create: items.map((item: { productId: number; quantity: number }) => ({
                            quantity: item.quantity,
                            product: { connect: { id: item.productId } },
                        })),
                    }
                    : undefined,
            },
            include: { items: { include: { product: true } }, user: true, address: true },
        });

        // بروزرسانی total بعد از ایجاد آیتم‌ها
        await recalcOrderTotal(order.id);

        res.status(201).json(order);
    } catch (err: unknown) {
        console.error('[createOrder]', err);
        res.status(500).json({ error: 'Unexpected error occurred' });
    }
};

// ===== DELETE /orders/:id =====
export const deleteOrder = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.orderItem.deleteMany({ where: { orderId: id } });
        await prisma.order.delete({ where: { id } });
        res.json({ message: 'Order deleted successfully' });
    } catch (err: unknown) {
        console.error('[deleteOrder]', err);
        res.status(500).json({ error: 'Unexpected error occurred' });
    }
};

// ===== PUT /orders/:id =====
export const updateOrder = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { addressId, deliveryTime, status, customerName } = req.body;

    try {
        const updated = await prisma.order.update({
            where: { id },
            data: {
                ...(customerName && { customerName }),
                ...(addressId && { addressId }),
                ...(deliveryTime && { deliveryTime: new Date(deliveryTime) }),
                ...(status && { status }),
            },
            include: { items: { include: { product: true } }, user: true, address: true },
        });

        // بروزرسانی total بعد از هر تغییر احتمالی
        await recalcOrderTotal(updated.id);

        res.json(updated);
    } catch (err: unknown) {
        console.error('[updateOrder]', err);
        res.status(500).json({ error: 'Unexpected error occurred' });
    }
};
