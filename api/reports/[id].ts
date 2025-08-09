import type { NextApiRequest, NextApiResponse } from 'next';
import pool from '../db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
    if (typeof id !== 'string') return res.status(400).json({ message: 'Invalid report id' });

    if (req.method === 'PUT') {
        const { title, type, reportDate, authorId, status, fileUrl } = req.body;

        try {
            const existing = await pool.query('SELECT * FROM "Report" WHERE id=$1', [id]);
            if (existing.rowCount === 0) return res.status(404).json({ message: 'Report not found' });

            const updateQuery = `
        UPDATE "Report"
        SET title=$1, type=$2, "reportDate"=$3, "authorId"=$4, status=$5, "fileUrl"=$6
        WHERE id=$7
        RETURNING *;
      `;
            const result = await pool.query(updateQuery, [
                title,
                type,
                reportDate ? new Date(reportDate) : null,
                authorId,
                status,
                fileUrl,
                id,
            ]);
            return res.json(result.rows[0]);
        } catch (error) {
            console.error('Error updating report:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    } else if (req.method === 'POST') {
        // تغییر وضعیت به ANSWERED
        try {
            const existing = await pool.query('SELECT * FROM "Report" WHERE id=$1', [id]);
            if (existing.rowCount === 0) return res.status(404).json({ message: 'Report not found' });

            const result = await pool.query(
                `UPDATE "Report" SET status='ANSWERED' WHERE id=$1 RETURNING *`,
                [id]
            );
            return res.status(200).json(result.rows[0]);
        } catch (error) {
            console.error('Error answering report:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    } else if (req.method === 'PATCH') {
        // تغییر وضعیت به BLOCKED
        try {
            const existing = await pool.query('SELECT * FROM "Report" WHERE id=$1', [id]);
            if (existing.rowCount === 0) return res.status(404).json({ message: 'Report not found' });

            const result = await pool.query(
                `UPDATE "Report" SET status='BLOCKED' WHERE id=$1 RETURNING *`,
                [id]
            );
            return res.status(200).json(result.rows[0]);
        } catch (error) {
            console.error('Error blocking report:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    } else if (req.method === 'DELETE') {
        try {
            const existing = await pool.query('SELECT * FROM "Report" WHERE id=$1', [id]);
            if (existing.rowCount === 0) return res.status(404).json({ message: 'Report not found' });

            await pool.query('DELETE FROM "Report" WHERE id=$1', [id]);
            return res.status(200).json({ message: 'Report deleted successfully' });
        } catch (error) {
            console.error('Error deleting report:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    } else {
        res.setHeader('Allow', ['PUT', 'POST', 'PATCH', 'DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
