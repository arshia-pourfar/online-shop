import type { NextApiRequest, NextApiResponse } from 'next';
import pool from '../db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const result = await pool.query(`
        SELECT r.*, json_build_object('name', u.name) AS author
        FROM "Report" r
        LEFT JOIN "User" u ON r."authorId" = u.id
        ORDER BY r."createdAt" DESC
      `);
      return res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error getting reports:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
