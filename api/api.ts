// pages/api/apiHandler.ts
import { NextApiRequest, NextApiResponse } from 'next';
import pool from './db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { action } = req.query;

    if (req.method === 'GET') {
        if (action === 'categories') {
            try {
                const result = await pool.query('SELECT * FROM "Category"');
                return res.json(result.rows);
            } catch (err) {
                console.error('[getCategories]', err);
                return res.status(500).json({ error: 'Failed to get categories' });
            }
        }
        else if (action === 'stats') {
            try {
                const result = await pool.query(`
          SELECT * FROM "SalesStats"
          ORDER BY "month" ASC
          LIMIT 12;
        `);
                return res.json(result.rows);
            } catch (error) {
                console.error('❌ Error fetching monthly stats:', error);
                return res.status(500).json({ error: 'Failed to fetch sales stats' });
            }
        }
        else {
            return res.status(400).json({ error: 'Invalid GET action' });
        }
    }
    else if (req.method === 'POST') {
        if (action === 'login') {
            const { email, password } = req.body;
            try {
                const userResult = await pool.query('SELECT * FROM "User" WHERE email = $1', [email]);
                const user = userResult.rows[0];
                if (!user) return res.status(401).json({ error: 'Invalid email or password' });
                const passwordMatch = await bcrypt.compare(password, user.password);
                if (!passwordMatch) return res.status(401).json({ error: 'Invalid email or password' });
                const secret = process.env.JWT_SECRET!;
                const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, secret, { expiresIn: '7d' });
                return res.json({
                    message: 'Login successful',
                    token,
                    user: { id: user.id, name: user.name, role: user.role }
                });
            } catch (err) {
                console.error('Login Error:', err);
                return res.status(500).json({ error: 'Server error during login' });
            }
        }
        else if (action === 'register') {
            const { name, email, password, phone } = req.body;
            try {
                const emailCheck = await pool.query('SELECT 1 FROM "User" WHERE email = $1', [email]);
                if (emailCheck.rowCount && emailCheck.rowCount > 0) {
                    return res.status(409).json({ error: 'User with this email already exists' });
                }
                const hashedPassword = await bcrypt.hash(password, 10);
                const insertText = `
          INSERT INTO "User" (name, email, password, phone, role, status)
          VALUES ($1, $2, $3, $4, 'USER', 'ACTIVE')
          RETURNING id, name, role
        `;
                const result = await pool.query(insertText, [name, email, hashedPassword, phone || '']);
                const user = result.rows[0];
                const token = jwt.sign(
                    { id: user.id, role: user.role, name: user.name },
                    process.env.JWT_SECRET!,
                    { expiresIn: '7d' }
                );
                return res.status(201).json({
                    message: 'Registration successful',
                    token,
                    user,
                });
            } catch (error) {
                console.error('Register Error:', error);
                return res.status(500).json({ error: 'Server error during registration' });
            }
        }
        else {
            return res.status(400).json({ error: 'Invalid POST action' });
        }
    }
    else {
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
