import { Request, Response } from 'express';
import {prisma} from '../../prisma/prisma'; // مسیر درست به فایل prisma.ts

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
    const { name, price, stock, description, status, imageUrl, categoryId } = req.body;

    // اعتبارسنجی ساده
    if (
        typeof name !== 'string' ||
        typeof price !== 'number' ||
        typeof stock !== 'number' ||
        typeof categoryId !== 'number' ||
        (status && typeof status !== 'string') ||
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
                stock,
                description,
                status,
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
            console.error('[createProduct - Full]', err); // ← این خط رو اضافه کن
        }
        res.status(500).json({ error: 'Failed to create product' });
    }
};

// حذف محصول
export const deleteProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    console.log(`[Backend] Received DELETE request for product ID: ${id}`); // Log received ID
    try {
        // Ensure the ID is parsed to an integer if your Prisma schema uses Int for product ID
        const productId = parseInt(id, 10);
        if (isNaN(productId)) {
            console.error(`[deleteProduct] Invalid product ID received: ${id}`);
            return res.status(400).json({ error: 'شناسه محصول نامعتبر است.' }); // Invalid product ID
        }

        // IMPORTANT: Delete related OrderItem records first to satisfy foreign key constraint
        // This line was commented out previously but is now active to fix the error.
        await prisma.orderItem.deleteMany({ where: { productId: productId } });
        console.log(`[Backend] Deleted all OrderItems related to product ID: ${productId}`);


        const deletedProduct = await prisma.product.delete({ where: { id: productId } });
        console.log(`[Backend] Product with ID ${productId} deleted successfully.`);
        res.json({ message: 'محصول با موفقیت حذف شد.', deletedProduct }); // Send success message and deleted product data
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error(`[deleteProduct] Error deleting product ID ${id}:`, err.message);
            // Handle specific Prisma errors, e.g., if the record doesn't exist
            if (err.message.includes('RecordNotFound') || err.message.includes('No Product found') || err.message.includes('An operation failed because it depends on one or more records that were required but not found')) {
                return res.status(404).json({ error: 'محصول یافت نشد.' }); // Product not found
            }
            // Handle foreign key constraint errors (if related records exist and no cascade delete)
            // This specific error should now be prevented by deleting OrderItems first.
            if (err.message.includes('Foreign key constraint failed')) {
                return res.status(409).json({ error: 'این محصول دارای سفارشات مرتبط است و نمی‌توان آن را حذف کرد. ابتدا سفارشات مرتبط را حذف کنید.' });
            }
        }
        res.status(500).json({ error: 'خطا در حذف محصول.' }); // Generic server error
    }
};

// ویرایش محصول
export const updateProduct = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { name, price, stock, description, status, imageUrl, categoryId } = req.body;

    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid product id' });
    }

    // اعتبارسنجی ساده
    if (
        typeof name !== 'string' ||
        typeof price !== 'number' ||
        typeof stock !== 'number' ||
        typeof categoryId !== 'number' ||
        (status && typeof status !== 'string') ||
        (description && typeof description !== 'string') ||
        (imageUrl && typeof imageUrl !== 'string')
    ) {
        return res.status(400).json({ error: 'Invalid product data' });
    }

    try {
        const updatedProduct = await prisma.product.update({
            where: { id },
            data: {
                name,
                price,
                stock,
                description,
                status,
                imageUrl,
                category: {
                    connect: { id: categoryId },
                },
            },
        });

        res.json(updatedProduct);
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error('[updateProduct]', err.message);
        }
        res.status(500).json({ error: 'Failed to update product' });
    }
};
