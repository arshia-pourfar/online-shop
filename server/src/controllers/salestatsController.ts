import { Request, Response } from 'express';
import prisma from '../../prisma/prisma';

export const getMonthlyStats = async (_: Request, res: Response) => {
    try {
        const stats = await prisma.salesStats.findMany({
            orderBy: { month: 'asc' },
            take: 12,
        });

        res.json(stats);
    } catch (err) {
        console.error('❌ Error fetching monthly stats:', err);
        res.status(500).json({ error: 'Failed to fetch sales stats' });
    }
};
