// pages/api/register.ts
import { NextApiRequest, NextApiResponse } from 'next';
import pool from './db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

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

        res.status(201).json({
            message: 'Registration successful',
            token,
            user,
        });
    } catch (error) {
        console.error('Register Error:', error);
        res.status(500).json({ error: 'Server error during registration' });
    }
}
