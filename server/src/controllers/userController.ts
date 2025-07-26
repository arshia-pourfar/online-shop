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
    // Ensure all fields sent from the frontend are destructured
    const { name, email, password, phone, status, role } = req.body;
    try {
        // In a real application, you would hash the password here before saving.
        // For seeding or simple cases, it might be plain, but for production, hash it!
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password, // Consider hashing this password before storing in production
                phone,    // Now accepting phone
                status,   // Now accepting status
                role,     // Now accepting role
            },
        });
        res.status(201).json(newUser);
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error('[createUser]', err.message);
            // More specific error handling for unique constraint violations (e.g., duplicate email)
            if (err.message.includes('Unique constraint failed on the fields: (`email`)')) {
                return res.status(409).json({ error: 'User with this email already exists.' });
            }
        }
        res.status(500).json({ error: 'Failed to create user' });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    // Destructure all fields that can be updated from the request body
    const { name, email, phone, status, role } = req.body;
    try {
        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                name,
                email,
                phone,
                status,
                role,
                // Password update should be a separate, secure endpoint
            },
        });
        res.json(updatedUser);
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error('[updateUser]', err.message);
            // Handle specific errors, e.g., user not found
            if (err.message.includes('RecordNotFound') || err.message.includes('No User found')) {
                return res.status(404).json({ error: 'User not found' });
            }
            if (err.message.includes('Unique constraint failed on the fields: (`email`)')) {
                return res.status(409).json({ error: 'Email already in use by another user.' });
            }
        }
        res.status(500).json({ error: 'Failed to update user' });
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
            // Handle specific errors, e.g., user not found
            if (err.message.includes('RecordNotFound') || err.message.includes('No User found')) {
                return res.status(404).json({ error: 'User not found' });
            }
        }
        res.status(500).json({ error: 'Failed to delete user' });
    }
};
