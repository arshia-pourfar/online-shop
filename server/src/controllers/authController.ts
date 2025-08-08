import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import {prisma} from '../../prisma/prisma';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();

export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const secret = process.env.JWT_SECRET!;
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
        res.status(500).json({ error: 'Server error during login' });
    }
};

export const registerUser = async (req: Request, res: Response) => {
    const { name, email, password, phone } = req.body;

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ error: 'User with this email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                phone: phone || '',
                role: 'USER',
                status: 'ACTIVE',
            },
        });

        const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, process.env.JWT_SECRET!, {
            expiresIn: '7d',
        });

        res.status(201).json({
            message: 'Registration successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                role: user.role,
            },
        });
    } catch (err) {
        console.error('Register Error:', err);
        res.status(500).json({ error: 'Server error during registration' });
    }
};
