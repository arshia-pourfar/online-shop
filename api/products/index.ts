import type { NextApiRequest, NextApiResponse } from 'next';
import pool from '../db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const result = await pool.query(`
        SELECT p.*, json_build_object('id', c.id, 'name', c.name, 'slug', c.slug, 'imageSrc', c."imageSrc") AS category
        FROM "Product" p
        LEFT JOIN "Category" c ON p."categoryId" = c.id
        ORDER BY p.id DESC
      `);
      return res.json(result.rows);
    } catch (error) {
      console.error('[getAllProducts]', error);
      return res.status(500).json({ error: 'Failed to fetch products' });
    }
  } else if (req.method === 'POST') {
    const { name, price, stock, description, status, imageUrl, categoryId } = req.body;

    if (
      typeof name !== 'string' ||
      typeof price !== 'number' ||
      typeof stock !== 'number' ||
      typeof categoryId !== 'number'
    ) {
      return res.status(400).json({ error: 'Invalid product data' });
    }

    try {
      const insertQuery = `
        INSERT INTO "Product" (name, price, stock, description, status, "imageUrl", "categoryId")
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
      `;

      const insertResult = await pool.query(insertQuery, [
        name,
        price,
        stock,
        description || null,
        status || null,
        imageUrl || null,
        categoryId,
      ]);

      return res.status(201).json(insertResult.rows[0]);
    } catch (error) {
      console.error('[createProduct]', error);
      return res.status(500).json({ error: 'Failed to create product' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
