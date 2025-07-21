import { Request, Response } from 'express';
import prisma from '../../prisma/prisma';

// گرفتن همه دسته‌بندی‌ها
export const getCategories = async (req: Request, res: Response) => {
    try {
        const categories = await prisma.category.findMany(); 
        res.json(categories);
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error('[getAllCategories]', err.message);
        }
        res.status(500).json({ error: 'Failed to get categories' });
    }
};

// ساخت دسته‌بندی جدید
// export const createCategory = async (req: Request, res: Response) => {
//     const { name } = req.body;

//     if (typeof name !== 'string') {
//         return res.status(400).json({ error: 'Invalid category name' });
//     }

//     try {
//         const newCategory = await prisma.category.create({
//             data: { name },
//         });

//         res.status(201).json(newCategory);
//     } catch (err: unknown) {
//         if (err instanceof Error) {
//             console.error('[createCategory]', err.message);
//         }
//         res.status(500).json({ error: 'Failed to create category' });
//     }
// };
