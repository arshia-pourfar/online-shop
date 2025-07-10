import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    // Create a user
    const user = await prisma.user.create({
        data: {
            name: 'Arshia',
            email: 'arshia@example.com',
            password: 'hashedPassword123', // should be hashed
            role: 'ADMIN',
        },
    });

    // Create a product
    const product = await prisma.product.create({
        data: {
            name: 'Headphones',
            price: 199.99,
            description: 'Wireless noise-canceling headphones',
        },
    });

    // Create an order
    const order = await prisma.order.create({
        data: {
            userId: user.id,
            status: 'PENDING',
            total: 199.99,
            items: {
                create: [
                    {
                        productId: product.id,
                        quantity: 1,
                    },
                ],
            },
        },
    });

    // Add a SalesStats entry
    await prisma.salesStats.create({
        data: {
            year: 2025,
            month: 7,
            revenue: 199.99,
            orderCount: 1,
        },
    });

    console.log('✅ Seeding complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
