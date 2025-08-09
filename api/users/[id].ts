import type { NextApiRequest, NextApiResponse } from 'next';
import pool from '../db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (typeof id !== 'string') return res.status(400).json({ error: 'Invalid user id' });

  if (req.method === 'GET') {
    try {
      const result = await pool.query('SELECT * FROM "User" WHERE id=$1', [id]);
      if (result.rowCount === 0) return res.status(404).json({ error: 'User not found' });
      return res.json(result.rows[0]);
    } catch (error) {
      console.error('[getUserById]', error);
      return res.status(500).json({ error: 'Failed to fetch user' });
    }
  } else if (req.method === 'PUT') {
    const { name, email, phone, status, role } = req.body;
    try {
      // بررسی اینکه ایمیل منحصر بفرد است یا نه:
      const emailCheck = await pool.query(
        'SELECT id FROM "User" WHERE email=$1 AND id<>$2',
        [email, id]
      );
      if (emailCheck.rowCount && emailCheck.rowCount > 0) {
        return res.status(409).json({ error: 'Email already in use by another user.' });
      }


      const updateQuery = `
        UPDATE "User" SET name=$1, email=$2, phone=$3, status=$4, role=$5 WHERE id=$6 RETURNING *;
      `;
      const result = await pool.query(updateQuery, [name, email, phone, status, role, id]);
      if (result.rowCount === 0) return res.status(404).json({ error: 'User not found' });
      return res.json(result.rows[0]);
    } catch (error) {
      console.error('[updateUser]', error);
      return res.status(500).json({ error: 'Failed to update user' });
    }
  } else if (req.method === 'DELETE') {
    try {
      // حذف داده‌های وابسته اول
      const ordersResult = await pool.query('SELECT id FROM "Order" WHERE "userId"=$1', [id]);
      const orderIds = ordersResult.rows.map(r => r.id);

      if (orderIds.length > 0) {
        await pool.query('DELETE FROM "OrderItem" WHERE "orderId" = ANY($1)', [orderIds]);
        await pool.query('DELETE FROM "Order" WHERE "userId"=$1', [id]);
      }

      // حذف کاربر
      const deleteResult = await pool.query('DELETE FROM "User" WHERE id=$1 RETURNING *', [id]);
      if (deleteResult.rowCount === 0) return res.status(404).json({ error: 'User not found' });

      return res.json({ message: 'User deleted successfully.', user: deleteResult.rows[0] });
    } catch (error) {
      console.error('[deleteUser]', error);
      return res.status(500).json({ error: 'Failed to delete user' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
