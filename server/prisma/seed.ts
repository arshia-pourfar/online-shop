/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';
const prisma = new PrismaClient();

async function main() {
    // 1. ایجاد کاربران
    const admin = await prisma.user.create({
        data: {
            name: 'Admin User',
            email: 'admin@test.com',
            password: 'admin123',
            role: 'ADMIN',
        },
    });

    const user1 = await prisma.user.create({
        data: {
            name: 'Ali',
            email: 'ali@test.com',
            password: 'ali123',
            role: 'USER',
        },
    });

    const user2 = await prisma.user.create({
        data: {
            name: 'Sara Ahmadi',
            email: 'sara@test.com',
            password: 'sara123',
            role: 'USER',
        },
    });

    const user3 = await prisma.user.create({
        data: {
            name: 'Reza Karimi',
            email: 'reza@test.com',
            password: 'reza123',
            role: 'USER',
        },
    });

    const user4 = await prisma.user.create({
        data: {
            name: 'Maryam Najafi',
            email: 'maryam@test.com',
            password: 'maryam123',
            role: 'USER',
        },
    });

    // 2. ایجاد محصولات با توضیحات کامل
    const productData = [
        { name: 'Wireless Mouse', price: 29.99, description: 'Ergonomic wireless mouse with adjustable DPI' },
        { name: 'Mechanical Keyboard', price: 89.99, description: 'Backlit mechanical keyboard with blue switches' },
        { name: 'Gaming Monitor', price: 199.99, description: '24-inch Full HD 144Hz gaming monitor' },
        { name: 'USB-C Cable', price: 9.99, description: '1.5m fast charging USB-C cable' },
        { name: 'Laptop Stand', price: 39.99, description: 'Adjustable aluminum laptop stand for all sizes' },
        { name: 'Bluetooth Speaker', price: 49.99, description: 'Portable Bluetooth speaker with deep bass' },
        { name: 'Webcam Full HD', price: 59.99, description: '1080p webcam with built-in microphone' },
        { name: 'Gaming Chair', price: 149.99, description: 'Comfortable gaming chair with lumbar support' },
        { name: 'SSD 1TB', price: 99.99, description: 'Fast 1TB NVMe solid state drive' },
        { name: 'Smartwatch', price: 119.99, description: 'Fitness smartwatch with heart rate monitor' },
        { name: 'Headphones', price: 79.99, description: 'Over-ear noise-cancelling headphones' },
        { name: 'Router Wi-Fi 6', price: 89.99, description: 'Dual-band Wi-Fi 6 router with high speed' },
        { name: 'Power Bank', price: 29.99, description: '10000mAh portable charger with USB-C' },
        { name: 'LED Desk Lamp', price: 19.99, description: 'Touch control LED lamp with brightness settings' },
        { name: 'Wireless Charger', price: 24.99, description: 'Fast wireless charger for all Qi devices' },
    ];

    const products = await Promise.all(
        productData.map((product) =>
            prisma.product.create({ data: product })
        )
    );

    // 3. ایجاد سفارش‌ها

    await prisma.order.create({
        data: {
            userId: user1.id,
            total: products[0].price + products[1].price,
            status: 'DELIVERED',
            items: {
                create: [
                    { productId: products[0].id, quantity: 1 },
                    { productId: products[1].id, quantity: 1 },
                ],
            },
        },
    });

    await prisma.order.create({
        data: {
            userId: user2.id,
            total: products[2].price * 2,
            status: 'PENDING',
            items: {
                create: [
                    { productId: products[2].id, quantity: 2 },
                ],
            },
        },
    });

    await prisma.order.create({
        data: {
            userId: user3.id,
            total: products[3].price + products[4].price + products[5].price,
            status: 'CANCELED',
            items: {
                create: [
                    { productId: products[3].id, quantity: 1 },
                    { productId: products[4].id, quantity: 1 },
                    { productId: products[5].id, quantity: 1 },
                ],
            },
        },
    });

    await prisma.order.create({
        data: {
            userId: user4.id,
            total: products[6].price * 3,
            status: 'SHIPPED',
            items: {
                create: [
                    { productId: products[6].id, quantity: 3 },
                ],
            },
        },
    });

    await prisma.salesStats.createMany({
        data: [
            { year: 2025, month: 'Jan', revenue: 2200, sales: 45 },
            { year: 2025, month: 'Feb', revenue: 1500, sales: 23 },
            { year: 2025, month: 'Mar', revenue: 3100, sales: 15 },
            { year: 2025, month: 'Apr', revenue: 1800, sales: 33 },
            { year: 2025, month: 'May', revenue: 5800, sales: 200 },
            { year: 2025, month: 'Jun', revenue: 2600, sales: 76 },
            { year: 2025, month: 'Jul', revenue: 7400, sales: 35 },
            { year: 2025, month: 'Aug', revenue: 4000, sales: 67 },
            { year: 2025, month: 'Sep', revenue: 1200, sales: 48 },
            { year: 2025, month: 'Oct', revenue: 5100, sales: 41 },
            { year: 2025, month: 'Nov', revenue: 2000, sales: 89 },
            { year: 2025, month: 'Dec', revenue: 8000, sales: 42 },
        ],
    });

    console.log('✅ Seed data generated with 5 users, 15 products, 4 orders.');
}

main()
    .catch((e) => {
        console.error('❌ Error in seeding:', e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());