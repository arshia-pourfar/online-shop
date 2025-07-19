import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../../prisma/prisma';
import dotenv from 'dotenv';

dotenv.config();

export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.error('JWT_SECRET is not defined!');
            return res.status(500).json({ error: 'Server error: JWT_SECRET is not defined' });
        }

        const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, secret, { expiresIn: '7d' });

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                role: user.role,
            },
        });
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ error: err instanceof Error ? err.message : 'Server error during login' });
    }
};