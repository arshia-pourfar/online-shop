import { Request, Response } from 'express';
import prisma from '../../prisma/prisma';

export const getAllUsers = async (_: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error('[getAllUsers]', err.message);
        }
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error('[getUserById]', err.message);
        }
        res.status(500).json({ error: 'Failed to fetch user' });
    }
};

export const createUser = async (req: Request, res: Response) => {
    const { name, email, password, role } = req.body;
    try {
        const newUser = await prisma.user.create({
            data: { name, email, password, role },
        });
        res.status(201).json(newUser);
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error('[createUser]', err.message);
        }
        res.status(500).json({ error: 'Failed to create user' });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.user.delete({ where: { id } });
        res.json({ message: 'User deleted' });
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error('[deleteUser]', err.message);
        }
        res.status(500).json({ error: 'Failed to delete user' });
    }
};
