// pages/api/stats.ts
import { NextApiRequest, NextApiResponse } from 'next';
import pool from './db'; // فایل تنظیم اتصال pg

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const result = await pool.query(`
      SELECT * FROM "SalesStats"
      ORDER BY "month" ASC
      LIMIT 12;
    `);
        res.json(result.rows);
    } catch (error) {
        console.error('❌ Error fetching monthly stats:', error);
        res.status(500).json({ error: 'Failed to fetch sales stats' });
    }
}
