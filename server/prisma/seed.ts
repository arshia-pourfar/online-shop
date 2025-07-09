import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.create({
        data: {
            name: 'Arshia',
            email: 'arshia@example.com',
            password: 'hashedpass',
        },
    });

    const product1 = await prisma.product.create({
        data: {
            name: 'Headphone',
            price: 120,
        },
    });

    const order = await prisma.order.create({
        data: {
            userId: user.id,
            status: 'PENDING',
            total: 120,
            items: {
                create: [{ productId: product1.id, quantity: 1 }],
            },
        },
    });
    console.log(order);
}

main().then(() => prisma.$disconnect())
    .catch((e) => {
        console.error(e);
        prisma.$disconnect();
    });
