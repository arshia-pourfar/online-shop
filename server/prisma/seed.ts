// /* eslint-disable @typescript-eslint/no-unused-vars */
// import { PrismaClient } from '@prisma/client';
// import 'dotenv/config';
// const prisma = new PrismaClient();

// async function main() {
//     // 1. ایجاد کاربران
//     const admin = await prisma.user.create({
//         data: {
//             name: 'Admin User',
//             email: 'admin@test.com',
//             password: 'admin123',
//             role: 'ADMIN',
//         },
//     });

//     const user1 = await prisma.user.create({
//         data: {
//             name: 'Ali',
//             email: 'ali@test.com',
//             password: 'ali123',
//             role: 'USER',
//         },
//     });

//     const user2 = await prisma.user.create({
//         data: {
//             name: 'Sara Ahmadi',
//             email: 'sara@test.com',
//             password: 'sara123',
//             role: 'USER',
//         },
//     });

//     const user3 = await prisma.user.create({
//         data: {
//             name: 'Reza Karimi',
//             email: 'reza@test.com',
//             password: 'reza123',
//             role: 'USER',
//         },
//     });

//     const user4 = await prisma.user.create({
//         data: {
//             name: 'Maryam Najafi',
//             email: 'maryam@test.com',
//             password: 'maryam123',
//             role: 'USER',
//         },
//     });

//     // 2. دسته‌ها را ایجاد یا به‌روزرسانی کن
//     const categories = [
//         { id: 1, name: "Accessories", slug: "accessories" },
//         { id: 2, name: "Display", slug: "display" },
//         { id: 3, name: "Cables", slug: "cables" },
//         { id: 4, name: "Audio", slug: "audio" },
//         { id: 5, name: "Camera", slug: "camera" },
//         { id: 6, name: "Furniture", slug: "furniture" },
//         { id: 7, name: "Storage", slug: "storage" },
//         { id: 8, name: "Wearables", slug: "wearables" },
//         { id: 9, name: "Networking", slug: "networking" },
//         { id: 10, name: "Power", slug: "power" },
//         { id: 11, name: "Lighting", slug: "lighting" },
//         { id: 12, name: "Charging", slug: "charging" },
//     ];

//     for (const cat of categories) {
//         await prisma.category.upsert({
//             where: { slug: cat.slug },
//             update: {},
//             create: {
//                 id: cat.id,
//                 name: cat.name,
//                 slug: cat.slug,
//             },
//         });
//     }

//     // 3. گرفتن دسته‌ها برای مپ کردن نام به id
//     const allCategories = await prisma.category.findMany();
//     const categoryMap = new Map(allCategories.map(cat => [cat.slug, cat.id]));

//     // 4. محصولات
//     const productData = [
//         {
//             name: 'Wireless Mouse',
//             price: 29.99,
//             description: 'Ergonomic wireless mouse with adjustable DPI',
//             imageUrl: '61EZQh0-TZL._AC_UY327_FMwebp_QL65_.png',
//             stock: 100,
//             status: 'AVAILABLE',
//             category: 'accessories'
//         },
//         {
//             name: 'Mechanical Keyboard',
//             price: 89.99,
//             description: 'Backlit mechanical keyboard with blue switches',
//             imageUrl: '61ozM9WWtmL._AC_UY327_FMwebp_QL65_.png',
//             stock: 75,
//             status: 'AVAILABLE',
//             category: 'accessories'
//         },
//         {
//             name: 'Gaming Monitor',
//             price: 199.99,
//             description: '24-inch Full HD 144Hz gaming monitor',
//             imageUrl: '71u4mAb+V6L._AC_UY327_FMwebp_QL65_.png',
//             stock: 30,
//             status: 'AVAILABLE',
//             category: 'display'
//         },
//         {
//             name: 'USB-C Cable',
//             price: 9.99,
//             description: '1.5m fast charging USB-C cable',
//             imageUrl: '71TBf2WJmOL._AC_UY327_FMwebp_QL65_.png',
//             stock: 200,
//             status: 'AVAILABLE',
//             category: 'cables'
//         },
//         {
//             name: 'Laptop Stand',
//             price: 39.99,
//             description: 'Adjustable aluminum laptop stand for all sizes',
//             imageUrl: '81tmTKxscbL._AC_UY327_FMwebp_QL65_.png',
//             stock: 60,
//             status: 'AVAILABLE',
//             category: 'accessories'
//         },
//         {
//             name: 'Bluetooth Speaker',
//             price: 49.99,
//             description: 'Portable Bluetooth speaker with deep bass',
//             imageUrl: '61068h6mIgL._AC_UY327_FMwebp_QL65_.png',
//             stock: 45,
//             status: 'AVAILABLE',
//             category: 'audio'
//         },
//         {
//             name: 'Webcam Full HD',
//             price: 59.99,
//             description: '1080p webcam with built-in microphone',
//             imageUrl: '714pdREnqjL._AC_UY327_FMwebp_QL65_.png',
//             stock: 50,
//             status: 'AVAILABLE',
//             category: 'camera'
//         },
//         {
//             name: 'Gaming Chair',
//             price: 149.99,
//             description: 'Comfortable gaming chair with lumbar support',
//             imageUrl: '61PKkJkMS8L._AC_UL480_FMwebp_QL65_.webp',
//             stock: 20,
//             status: 'AVAILABLE',
//             category: 'furniture'
//         },
//         {
//             name: 'SSD 1TB',
//             price: 99.99,
//             description: 'Fast 1TB NVMe solid state drive',
//             imageUrl: '911ujeCkGfL._AC_UY327_FMwebp_QL65_.png',
//             stock: 80,
//             status: 'AVAILABLE',
//             category: 'storage'
//         },
//         {
//             name: 'Smartwatch',
//             price: 119.99,
//             description: 'Fitness smartwatch with heart rate monitor',
//             imageUrl: '61ACOwvUwSL._AC_UY327_FMwebp_QL65_.png',
//             stock: 90,
//             status: 'AVAILABLE',
//             category: 'wearables'
//         },
//         {
//             name: 'Headphones',
//             price: 79.99,
//             description: 'Over-ear noise-cancelling headphones',
//             imageUrl: '51V1bf76cML._AC_UY327_FMwebp_QL65_.png',
//             stock: 70,
//             status: 'AVAILABLE',
//             category: 'audio'
//         },
//         {
//             name: 'Router Wi-Fi 6',
//             price: 89.99,
//             description: 'Dual-band Wi-Fi 6 router with high speed',
//             imageUrl: '41VlTprOFdL._AC_UY327_FMwebp_QL65_.png',
//             stock: 35,
//             status: 'AVAILABLE',
//             category: 'networking'
//         },
//         {
//             name: 'Power Bank',
//             price: 29.99,
//             description: '10000mAh portable charger with USB-C',
//             imageUrl: '516tnauVb+L._AC_UY327_FMwebp_QL65_.png',
//             stock: 150,
//             status: 'AVAILABLE',
//             category: 'power'
//         },
//         {
//             name: 'LED Desk Lamp',
//             price: 19.99,
//             description: 'Touch control LED lamp with brightness settings',
//             imageUrl: '61jVnjd9EIL._AC_UL480_FMwebp_QL65_.png',
//             stock: 40,
//             status: 'AVAILABLE',
//             category: 'lighting'
//         },
//         {
//             name: 'Wireless Charger',
//             price: 24.99,
//             description: 'Fast wireless charger for all Qi devices',
//             imageUrl: '61jj23Nv75L._AC_UY327_FMwebp_QL65_.png',
//             stock: 100,
//             status: 'AVAILABLE',
//             category: 'charging'
//         }
//     ];

//     // 5. ایجاد محصولات با categoryId صحیح
//     const products = [];
//     for (const product of productData) {
//         const categoryId = categoryMap.get(product.category);
//         if (!categoryId) {
//             throw new Error(`Category slug ${product.category} not found`);
//         }
//         const createdProduct = await prisma.product.create({
//             data: {
//                 name: product.name,
//                 price: product.price,
//                 description: product.description,
//                 imageUrl: product.imageUrl,
//                 stock: product.stock,
//                 status: product.status,
//                 categoryId: categoryId,
//             },
//         });
//         products.push(createdProduct);
//     }

//     // 6. ایجاد سفارش‌ها
//     await prisma.order.create({
//         data: {
//             userId: user1.id,
//             total: products[0].price + products[1].price,
//             status: 'DELIVERED',
//             items: {
//                 create: [
//                     { productId: products[0].id, quantity: 1 },
//                     { productId: products[1].id, quantity: 1 },
//                 ],
//             },
//         },
//     });

//     await prisma.order.create({
//         data: {
//             userId: user2.id,
//             total: products[2].price * 2,
//             status: 'PENDING',
//             items: {
//                 create: [
//                     { productId: products[2].id, quantity: 2 },
//                 ],
//             },
//         },
//     });

//     await prisma.order.create({
//         data: {
//             userId: user3.id,
//             total: products[3].price + products[4].price + products[5].price,
//             status: 'CANCELED',
//             items: {
//                 create: [
//                     { productId: products[3].id, quantity: 1 },
//                     { productId: products[4].id, quantity: 1 },
//                     { productId: products[5].id, quantity: 1 },
//                 ],
//             },
//         },
//     });

//     await prisma.order.create({
//         data: {
//             userId: user4.id,
//             total: products[6].price * 3,
//             status: 'SHIPPED',
//             items: {
//                 create: [
//                     { productId: products[6].id, quantity: 3 },
//                 ],
//             },
//         },
//     });

//     // 7. آمار فروش
//     await prisma.salesStats.createMany({
//         data: [
//             { year: 2025, month: 'Jan', revenue: 2200, sales: 45 },
//             { year: 2025, month: 'Feb', revenue: 1500, sales: 23 },
//             { year: 2025, month: 'Mar', revenue: 3100, sales: 15 },
//             { year: 2025, month: 'Apr', revenue: 1800, sales: 33 },
//             { year: 2025, month: 'May', revenue: 5800, sales: 200 },
//             { year: 2025, month: 'Jun', revenue: 2600, sales: 76 },
//             { year: 2025, month: 'Jul', revenue: 7400, sales: 35 },
//             { year: 2025, month: 'Aug', revenue: 4000, sales: 67 },
//             { year: 2025, month: 'Sep', revenue: 1200, sales: 48 },
//             { year: 2025, month: 'Oct', revenue: 5100, sales: 41 },
//             { year: 2025, month: 'Nov', revenue: 2000, sales: 89 },
//             { year: 2025, month: 'Dec', revenue: 8000, sales: 42 },
//         ],
//     });

//     console.log('✅ Seed data generated.');
// }

// main()
//     .catch((e) => {
//         console.error('❌ Error in seeding:', e);
//         process.exit(1);
//     })
//     .finally(() => prisma.$disconnect());
