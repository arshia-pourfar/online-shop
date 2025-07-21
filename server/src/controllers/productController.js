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
exports.deleteProduct = exports.createProduct = exports.getProductById = exports.getAllProducts = void 0;
const prisma_1 = __importDefault(require("../../prisma/prisma")); // مسیر درست به فایل prisma.ts
// گرفتن تمام محصولات با اطلاعات دسته‌بندی
const getAllProducts = (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield prisma_1.default.product.findMany({
            include: {
                category: true, // اطلاعات دسته‌بندی هم همراه محصول بیاد
            },
        });
        res.json(products);
    }
    catch (err) {
        if (err instanceof Error) {
            console.error('[getAllProducts]', err.message);
        }
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});
exports.getAllProducts = getAllProducts;
// گرفتن یک محصول با آیدی
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid product id' });
    }
    try {
        const product = yield prisma_1.default.product.findUnique({
            where: { id },
            include: { category: true },
        });
        if (!product)
            return res.status(404).json({ error: 'Product not found' });
        res.json(product);
    }
    catch (err) {
        if (err instanceof Error) {
            console.error('[getProductById]', err.message);
        }
        res.status(500).json({ error: 'Failed to fetch product' });
    }
});
exports.getProductById = getProductById;
// ساخت محصول جدید
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, price, description, imageUrl, categoryId } = req.body;
    // اعتبارسنجی ساده
    if (typeof name !== 'string' ||
        typeof price !== 'number' ||
        typeof categoryId !== 'number' ||
        (description && typeof description !== 'string') ||
        (imageUrl && typeof imageUrl !== 'string')) {
        return res.status(400).json({ error: 'Invalid product data' });
    }
    try {
        const newProduct = yield prisma_1.default.product.create({
            data: {
                name,
                price,
                description,
                imageUrl,
                category: {
                    connect: { id: categoryId },
                },
            },
        });
        res.status(201).json(newProduct);
    }
    catch (err) {
        if (err instanceof Error) {
            console.error('[createProduct]', err.message);
        }
        res.status(500).json({ error: 'Failed to create product' });
    }
});
exports.createProduct = createProduct;
// حذف محصول
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid product id' });
    }
    try {
        yield prisma_1.default.product.delete({ where: { id } });
        res.json({ message: 'Product deleted' });
    }
    catch (err) {
        if (err instanceof Error) {
            console.error('[deleteProduct]', err.message);
        }
        res.status(500).json({ error: 'Failed to delete product' });
    }
});
exports.deleteProduct = deleteProduct;
