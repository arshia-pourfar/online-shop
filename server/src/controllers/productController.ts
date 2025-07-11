import { Request, Response } from 'express';
import prisma from '../../prisma/prisma';

export const getAllProducts = async (_: Request, res: Response) => {
    try {
        const products = await prisma.product.findMany();
        res.json(products);
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error('[getAllProducts]', err.message);
        }
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};

export const getProductById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const product = await prisma.product.findUnique({ where: { id } });
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json(product);
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error('[getProductById]', err.message);
        }
        res.status(500).json({ error: 'Failed to fetch product' });
    }
};

export const createProduct = async (req: Request, res: Response) => {
    const { name, price, description } = req.body;
    try {
        const newProduct = await prisma.product.create({
            data: { name, price, description },
        });
        res.status(201).json(newProduct);
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error('[createProduct]', err.message);
        }
        res.status(500).json({ error: 'Failed to create product' });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
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
