// pages/api/categories.ts
import { NextApiRequest, NextApiResponse } from 'next';
import pool from './db'; // فرض بر اینه که pool از پکیج pg اینجوری ساخته شده

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const result = await pool.query('SELECT * FROM "Category"');
        res.json(result.rows);
    } catch (err) {
        console.error('[getCategories]', err);
        res.status(500).json({ error: 'Failed to get categories' });
    }
}
