// pages/api/orders/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import pool from '../db'; // مسیر فایل اتصال به دیتابیس

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    if (typeof id !== 'string') {
        return res.status(400).json({ error: 'Invalid order ID' });
    }

    if (req.method === 'GET') {
        try {
            const result = await pool.query(
                `
        SELECT o.id, o."customerName", o.status, o.total, o."shippingAddress", o."createdAt",
          json_agg(json_build_object(
            'id', oi.id,
            'quantity', oi.quantity,
            'productId', oi."productId"
          )) AS items
        FROM "Order" o
        LEFT JOIN "OrderItem" oi ON o.id = oi."orderId"
        WHERE o.id = $1
        GROUP BY o.id;
        `,
                [id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Order not found' });
            }

            return res.status(200).json(result.rows[0]);
        } catch (error) {
            console.error('[getOrderById]', error);
            return res.status(500).json({ error: 'Failed to fetch order' });
        }
    } else if (req.method === 'DELETE') {
        try {
            await pool.query('BEGIN');
            await pool.query(`DELETE FROM "OrderItem" WHERE "orderId" = $1`, [id]); // حذف آیتم‌های سفارش
            const result = await pool.query(`DELETE FROM "Order" WHERE id = $1 RETURNING *`, [id]);
            await pool.query('COMMIT');

            if (result.rowCount === 0) {
                return res.status(404).json({ error: 'Order not found' });
            }

            return res.json({ message: 'Order deleted successfully' });
        } catch (error) {
            await pool.query('ROLLBACK');
            console.error('[deleteOrder]', error);
            return res.status(500).json({ error: 'Failed to delete order' });
        }
    } else {
        res.setHeader('Allow', ['GET', 'DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
