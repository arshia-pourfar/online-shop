import type { NextApiRequest, NextApiResponse } from 'next';
import pool from '../db'; // فرض می‌کنیم فایل کانکشن به دیتابیس توی lib/db.ts هست

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
    const productId = Number(id);
    if (isNaN(productId)) return res.status(400).json({ error: 'Invalid product id' });

    if (req.method === 'GET') {
        try {
            const result = await pool.query(
                `
        SELECT p.*, json_build_object('id', c.id, 'name', c.name, 'slug', c.slug, 'imageSrc', c."imageSrc") AS category
        FROM "Product" p
        LEFT JOIN "Category" c ON p."categoryId" = c.id
        WHERE p.id = $1
        `,
                [productId]
            );
            if (result.rowCount === 0) return res.status(404).json({ error: 'Product not found' });
            return res.json(result.rows[0]);
        } catch (error) {
            console.error('[getProductById]', error);
            return res.status(500).json({ error: 'Failed to fetch product' });
        }
    } else if (req.method === 'PUT') {
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
            const updateQuery = `
        UPDATE "Product"
        SET name=$1, price=$2, stock=$3, description=$4, status=$5, "imageUrl"=$6, "categoryId"=$7
        WHERE id=$8
        RETURNING *;
      `;

            const updatedResult = await pool.query(updateQuery, [
                name,
                price,
                stock,
                description || null,
                status || null,
                imageUrl || null,
                categoryId,
                productId,
            ]);

            if (updatedResult.rowCount === 0)
                return res.status(404).json({ error: 'Product not found' });

            return res.json(updatedResult.rows[0]);
        } catch (error) {
            console.error('[updateProduct]', error);
            return res.status(500).json({ error: 'Failed to update product' });
        }
    } else if (req.method === 'DELETE') {
        try {
            await pool.query('BEGIN');

            // حذف آیتم‌های سفارش مرتبط
            await pool.query('DELETE FROM "OrderItem" WHERE "productId" = $1', [productId]);
            const deleteResult = await pool.query('DELETE FROM "Product" WHERE id = $1', [productId]);

            if (deleteResult.rowCount === 0) {
                await pool.query('ROLLBACK');
                return res.status(404).json({ error: 'Product not found' });
            }

            await pool.query('COMMIT');

            return res.json({ message: 'Product deleted successfully' });
        } catch (error) {
            await pool.query('ROLLBACK');
            console.error('[deleteProduct]', error);
            return res.status(500).json({ error: 'Failed to delete product' });
        }
    } else {
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
