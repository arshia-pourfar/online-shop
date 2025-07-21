import { Request, Response } from 'express';
import prisma from '../../prisma/prisma'; // مسیر درست به فایل prisma.ts

// گرفتن تمام محصولات با اطلاعات دسته‌بندی
export const getAllProducts = async (_: Request, res: Response) => {
    try {
        const products = await prisma.product.findMany({
            include: {
                category: true, // اطلاعات دسته‌بندی هم همراه محصول بیاد
            },
        });
        res.json(products);
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error('[getAllProducts]', err.message);
        }
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};

// گرفتن یک محصول با آیدی
export const getProductById = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid product id' });
    }

    try {
        const product = await prisma.product.findUnique({
            where: { id },
            include: { category: true },
        });

        if (!product) return res.status(404).json({ error: 'Product not found' });

        res.json(product);
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error('[getProductById]', err.message);
        }
        res.status(500).json({ error: 'Failed to fetch product' });
    }
};

// ساخت محصول جدید
export const createProduct = async (req: Request, res: Response) => {
    const { name, price, description, imageUrl, categoryId } = req.body;

    // اعتبارسنجی ساده
    if (
        typeof name !== 'string' ||
        typeof price !== 'number' ||
        typeof categoryId !== 'number' ||
        (description && typeof description !== 'string') ||
        (imageUrl && typeof imageUrl !== 'string')
    ) {
        return res.status(400).json({ error: 'Invalid product data' });
    }

    try {
        const newProduct = await prisma.product.create({
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
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error('[createProduct]', err.message);
        }
        res.status(500).json({ error: 'Failed to create product' });
    }
};

// حذف محصول
export const deleteProduct = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid product id' });
    }

    try {
        await prisma.product.delete({ where: { id } });
        res.json({ message: 'Product deleted' });
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error('[deleteProduct]', err.message);
        }
        res.status(500).json({ error: 'Failed to delete product' });
    }
};
