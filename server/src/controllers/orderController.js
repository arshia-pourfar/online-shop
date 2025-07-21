"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrder = exports.createOrder = exports.getOrderById = exports.getAllOrders = void 0;
const prisma_1 = __importDefault(require("../../prisma/prisma"));
const getAllOrders = (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield prisma_1.default.order.findMany({
            include: {
                items: true,
                user: true,
            },
        });
        res.json(orders);
    }
    catch (err) {
        if (err instanceof Error) {
            console.error('[getAllOrders]', err.message);
        }
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});
exports.getAllOrders = getAllOrders;
const getOrderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const order = yield prisma_1.default.order.findUnique({
            where: { id },
            include: {
                items: true,
                user: true,
            },
        });
        if (!order)
            return res.status(404).json({ error: 'Order not found' });
        res.json(order);
    }
    catch (err) {
        if (err instanceof Error) {
            console.error('[getOrderById]', err.message);
        }
        res.status(500).json({ error: 'Failed to fetch order' });
    }
});
exports.getOrderById = getOrderById;
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, items, total, status } = req.body;
    try {
        const newOrder = yield prisma_1.default.order.create({
            data: {
                userId,
                total,
                status,
                items: {
                    create: items.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                    })),
                },
            },
        });
        res.status(201).json(newOrder);
    }
    catch (err) {
        if (err instanceof Error) {
            console.error('[createOrder]', err.message);
        }
        res.status(500).json({ error: 'Failed to create order' });
    }
});
exports.createOrder = createOrder;
const deleteOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prisma_1.default.order.delete({ where: { id } });
        res.json({ message: 'Order deleted' });
    }
    catch (err) {
        if (err instanceof Error) {
            console.error('[deleteOrder]', err.message);
        }
        res.status(500).json({ error: 'Failed to delete order' });
    }
});
exports.deleteOrder = deleteOrder;
