import { Request, Response } from 'express';
import prisma from '../../prisma/prisma';
import bcrypt from 'bcrypt';

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
    // هش کردن پسورد قبل از ذخیره
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        // In a real application, you would hash the password here before saving.
        // For seeding or simple cases, it might be plain, but for production, hash it!
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                phone,
                status,
                role,
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
    console.log(`[Backend] Received DELETE request for user ID: ${id}`);
    try {
        // =====================================================================================
        // CRITICAL STEP: Handle ALL related records that have foreign key constraints
        // pointing to this user BEFORE attempting to delete the user.
        //
        // You MUST uncomment and ADAPT these lines based on YOUR ACTUAL `schema.prisma` relationships.
        // If a User has Orders, Reviews, CartItems, etc., you need to delete them first.
        //
        // ALTERNATIVE: If you want automatic deletion, add `onDelete: Cascade` to the
        // foreign key definitions in your `schema.prisma` for these relationships,
        // then run `npx prisma migrate dev`. If you do this, you might not need these `deleteMany` calls.
        // =====================================================================================

        // First, find all orders associated with this user
        const userOrders = await prisma.order.findMany({
            where: { userId: id },
            select: { id: true } // Only select the ID for efficiency
        });

        // Get an array of order IDs
        // Explicitly type 'order' to resolve 'implicitly has an 'any' type' error
        const orderIds = userOrders.map((order: { id: string }) => order.id);

        // 1. Delete related OrderItems for these orders (if any)
        if (orderIds.length > 0) {
            await prisma.orderItem.deleteMany({
                where: {
                    orderId: {
                        in: orderIds // Delete order items where orderId is in the list of user's order IDs
                    }
                }
            });
            console.log(`[Backend] Deleted all OrderItems related to orders of user ID: ${id}`);
        }

        // 2. Delete related Orders (if any)
        await prisma.order.deleteMany({ where: { userId: id } });
        console.log(`[Backend] Deleted all Orders related to user ID: ${id}`);

        // Example: If a User can have CartItems
        // await prisma.cartItem.deleteMany({ where: { userId: id } });
        // console.log(`[Backend] Deleted all CartItems related to user ID: ${id}`);

        // Example: If a User can have Reviews
        // await prisma.review.deleteMany({ where: { userId: id } });
        // console.log(`[Backend] Deleted all Reviews related to user ID: ${id}`);


        // =====================================================================================
        // After handling all related records, delete the user
        // =====================================================================================
        const deletedUser = await prisma.user.delete({ where: { id } }); // Capture the deleted user
        console.log(`[Backend] User with ID ${id} deleted successfully.`);
        res.json({ message: 'User deleted successfully.', deletedUser }); // Send success message and deleted user data
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error('[deleteUser]', err.message);
            // Handle specific errors, e.g., user not found
            if (err.message.includes('RecordNotFound') || err.message.includes('No User found') || err.message.includes('An operation failed because it depends on one or more records that were required but not found')) {
                return res.status(404).json({ error: 'User not found.' });
            }
            // If a foreign key constraint still fails, it means there's another related model
            // that hasn't been handled by `deleteMany` or `onDelete: Cascade` in your schema.
            if (err.message.includes('Foreign key constraint failed')) {
                return res.status(409).json({ error: 'Cannot delete user due to related records. Please check associated data (e.g., orders, reviews, cart items).' });
            }
        }
        res.status(500).json({ error: 'Failed to delete user.' });
    }
};