import type { NextApiRequest, NextApiResponse } from 'next';
import pool from '../db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const result = await pool.query(`
        SELECT o.id, o."customerName", o.status, o.total, o."shippingAddress", o."createdAt",
               json_agg(json_build_object(
                 'id', oi.id,
                 'quantity', oi.quantity,
                 'productId', oi."productId"
               )) AS items
        FROM "Order" o
        LEFT JOIN "OrderItem" oi ON o.id = oi."orderId"
        GROUP BY o.id
        ORDER BY o."createdAt" DESC;
      `);
            res.status(200).json(result.rows);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch orders' });
        }
    } else if (req.method === 'POST') {
        const { userId, customerName, shippingAddress, total, status, items } = req.body;

        if (!userId || !customerName || !shippingAddress || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        try {
            await pool.query('BEGIN');

            const orderInsertText = `
        INSERT INTO "Order" ("userId", "customerName", "shippingAddress", total, status)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id;
      `;
            const orderResult = await pool.query(orderInsertText, [
                userId,
                customerName,
                shippingAddress,
                total,
                status,
            ]);
            const orderId = orderResult.rows[0].id;

            const orderItemsInsertText = `
        INSERT INTO "OrderItem" ("orderId", "productId", quantity)
        VALUES ($1, $2, $3);
      `;

            for (const item of items) {
                await pool.query(orderItemsInsertText, [orderId, item.productId, item.quantity]);
            }

            await pool.query('COMMIT');

            res.status(201).json({ message: 'Order created', orderId });
        } catch (error) {
            await pool.query('ROLLBACK');
            console.error(error);
            res.status(500).json({ error: 'Failed to create order' });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
