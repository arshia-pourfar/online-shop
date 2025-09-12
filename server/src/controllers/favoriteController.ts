import { Request, Response } from 'express';
import { prisma } from '../../prisma/prisma';

// گرفتن علاقه‌مندی‌های یک کاربر
export const getFavoritesByUser = async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
        const favorites = await prisma.favorite.findMany({
            where: { userId },
            include: {
                product: {
                    include: { category: true },
                },
            },
        });

        res.json(favorites);
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error('[getFavoritesByUser]', err.message);
        }
        res.status(500).json({ error: 'خطا در دریافت علاقه‌مندی‌ها' });
    }
};

// افزودن محصول به علاقه‌مندی‌ها
export const addFavorite = async (req: Request, res: Response) => {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
        return res.status(400).json({ error: 'userId و productId الزامی هستند' });
    }

    try {
        const existing = await prisma.favorite.findUnique({
            where: {
                userId_productId: { userId, productId },
            },
        });

        if (existing) {
            return res.status(409).json({ error: 'این محصول قبلاً به علاقه‌مندی‌ها اضافه شده است' });
        }

        const favorite = await prisma.favorite.create({
            data: {
                userId,
                productId,
            },
        });

        res.status(201).json(favorite);
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error('[addFavorite]', err.message);
        }
        res.status(500).json({ error: 'خطا در افزودن علاقه‌مندی' });
    }
};

// حذف محصول از علاقه‌مندی‌ها
export const removeFavorite = async (req: Request, res: Response) => {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
        return res.status(400).json({ error: 'userId و productId الزامی هستند' });
    }

    try {
        await prisma.favorite.delete({
            where: {
                userId_productId: { userId, productId },
            },
        });

        res.json({ message: 'محصول از علاقه‌مندی‌ها حذف شد' });
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error('[removeFavorite]', err.message);
            if (err.message.includes('Record to delete does not exist')) {
                return res.status(404).json({ error: 'این علاقه‌مندی وجود ندارد' });
            }
        }
        res.status(500).json({ error: 'خطا در حذف علاقه‌مندی' });
    }
};