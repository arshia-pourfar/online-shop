// import { PrismaClient, ProductStatus, OrderStatus, ReportStatus, Role, UserStatus } from '@prisma/client'; // Import enums
// import 'dotenv/config';
// import bcrypt from 'bcrypt';

// const prisma = new PrismaClient();

// async function main() {
//     console.log('🚀 Starting seeding...');

//     // 1. Create or Upsert Users to prevent unique constraint errors on re-runs
//     const hashedAdminPassword = await bcrypt.hash('admin123', 10);
//     const admin = await prisma.user.upsert({
//         where: { email: 'admin@test.com' },
//         update: {},
//         create: {
//             name: 'Admin User',
//             email: 'admin@test.com',
//             password: hashedAdminPassword,
//             phone: '+989121234567',
//             status: UserStatus.ACTIVE,
//             role: Role.ADMIN,
//         },
//     });
//     console.log(`Upserted user: ${admin.name}`);


//     const hashedPassword1 = await bcrypt.hash('ali123', 10);
//     const user1 = await prisma.user.upsert({
//         where: { email: 'ali@test.com' },
//         update: {},
//         create: {
//             name: 'Ali',
//             email: 'ali@test.com',
//             password: hashedPassword1,
//             phone: '+989351112233',
//             status: UserStatus.ACTIVE,
//             role: Role.USER,
//         },
//     });
//     console.log(`Upserted user: ${user1.name}`);


//     const hashedPassword2 = await bcrypt.hash('sara123', 10);
//     const user2 = await prisma.user.upsert({
//         where: { email: 'sara@test.com' },
//         update: {},
//         create: {
//             name: 'Sara Ahmadi',
//             email: 'sara@test.com',
//             password: hashedPassword2,
//             phone: '+989194445566',
//             status: UserStatus.INACTIVE,
//             role: Role.USER,
//         },
//     });
//     console.log(`Upserted user: ${user2.name}`);


//     const hashedPassword3 = await bcrypt.hash('reza123', 10);
//     const user3 = await prisma.user.upsert({
//         where: { email: 'reza@test.com' },
//         update: {},
//         create: {
//             name: 'Reza Karimi',
//             email: 'reza@test.com',
//             password: hashedPassword3,
//             phone: '+989107778899',
//             status: UserStatus.PENDING,
//             role: Role.USER,
//         },
//     });
//     console.log(`Upserted user: ${user3.name}`);


//     const hashedPassword4 = await bcrypt.hash('maryam123', 10);
//     const user4 = await prisma.user.upsert({
//         where: { email: 'maryam@test.com' },
//         update: {},
//         create: {
//             name: 'Maryam Najafi',
//             email: 'maryam@test.com',
//             password: hashedPassword4,
//             phone: '+989020001122',
//             status: UserStatus.ACTIVE,
//             role: Role.USER,
//         },
//     });
//     console.log(`Upserted user: ${user4.name}`);


//     const hashedPassword5 = await bcrypt.hash('suspended123', 10);
//     const user5 = await prisma.user.upsert({
//         where: { email: 'suspended@test.com' },
//         update: {},
//         create: {
//             name: 'Suspended User',
//             email: 'suspended@test.com',
//             password: hashedPassword5,
//             phone: '+989019998877',
//             status: UserStatus.SUSPENDED,
//             role: Role.USER,
//         },
//     });
//     console.log(`Upserted user: ${user5.name}`);


//     // 2. Create or Update Categories
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
//         console.log(`Upserted category: ${cat.name}`);
//     }

//     // 3. Get Categories for mapping name to id
//     const allCategories = await prisma.category.findMany();
//     const categoryMap = new Map(allCategories.map(cat => [cat.slug, cat.id]));

//     // 4. Products data
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

//     // 5. Create products with correct categoryId and explicit ProductStatus casting
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
//                 status: product.status as ProductStatus, // Explicitly cast to ProductStatus
//                 categoryId: categoryId,
//             },
//         });
//         products.push(createdProduct);
//         console.log(`Created product: ${createdProduct.name}`);
//     }

//     // 6. Create Orders with new fields and updated status values
//     await prisma.order.create({
//         data: {
//             userId: admin.id,
//             customerName: admin.name || 'Admin User', // Added customerName
//             shippingAddress: '123 Admin Street, City, Country', // Added shippingAddress
//             total: products[0].price + products[1].price,
//             status: OrderStatus.DELIVERED, // Use enum member
//             items: {
//                 create: [
//                     { productId: products[0].id, quantity: 1 },
//                     { productId: products[1].id, quantity: 1 },
//                 ],
//             },
//         },
//     });
//     console.log(`Created order for ${admin.name}`);

//     await prisma.order.create({
//         data: {
//             userId: user1.id,
//             customerName: user1.name || 'Ali', // Added customerName
//             shippingAddress: '456 User1 Road, Town, Country', // Added shippingAddress
//             total: products[2].price * 2,
//             status: OrderStatus.PENDING, // Use enum member
//             items: {
//                 create: [
//                     { productId: products[2].id, quantity: 2 },
//                 ],
//             },
//         },
//     });
//     console.log(`Created order for ${user1.name}`);

//     await prisma.order.create({
//         data: {
//             userId: user2.id,
//             customerName: user2.name || 'Sara Ahmadi', // Added customerName
//             shippingAddress: '789 User2 Avenue, Village, Country', // Added shippingAddress
//             total: products[3].price + products[4].price + products[5].price,
//             status: OrderStatus.CANCELLED, // Use enum member (corrected spelling)
//             items: {
//                 create: [
//                     { productId: products[3].id, quantity: 1 },
//                     { productId: products[4].id, quantity: 1 },
//                     { productId: products[5].id, quantity: 1 },
//                 ],
//             },
//         },
//     });
//     console.log(`Created order for ${user2.name}`);

//     await prisma.order.create({
//         data: {
//             userId: user3.id,
//             customerName: user3.name || 'Reza Karimi', // Added customerName
//             shippingAddress: '101 User3 Lane, Hamlet, Country', // Added shippingAddress
//             total: products[6].price * 3,
//             status: OrderStatus.SHIPPED, // Use enum member
//             items: {
//                 create: [
//                     { productId: products[6].id, quantity: 3 },
//                 ],
//             },
//         },
//     });
//     console.log(`Created order for ${user3.name}`);

//     // Adding more diverse orders for other users
//     await prisma.order.create({
//         data: {
//             userId: user4.id,
//             customerName: user4.name || 'Maryam Najafi', // Added customerName
//             shippingAddress: '202 User4 Street, City, Country', // Added shippingAddress
//             total: products[7].price + products[8].price,
//             status: OrderStatus.PROCESSING, // Use enum member (new status)
//             items: {
//                 create: [
//                     { productId: products[7].id, quantity: 1 },
//                     { productId: products[8].id, quantity: 1 },
//                 ],
//             },
//         },
//     });
//     console.log(`Created order for ${user4.name}`);

//     await prisma.order.create({
//         data: {
//             userId: user5.id,
//             customerName: user5.name || 'Suspended User', // Added customerName
//             shippingAddress: '303 User5 Road, Town, Country', // Added shippingAddress
//             total: products[9].price,
//             status: OrderStatus.PENDING, // Use enum member
//             items: {
//                 create: [
//                     { productId: products[9].id, quantity: 1 },
//                 ],
//             },
//         },
//     });
//     console.log(`Created order for ${user5.name}`);


//     // 7. Sales Statistics
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
//     console.log('Created sales statistics.');

//     // 8. Create Reports
//     console.log('📄 Creating reports...');
//     await prisma.report.createMany({
//         data: [
//             {
//                 title: "Q2 Sales Report",
//                 type: "SALES",
//                 reportDate: new Date('2025-07-31T10:00:00Z'),
//                 authorId: admin.id,
//                 status: ReportStatus.GENERATED,
//                 fileUrl: "https://example.com/reports/q2-sales-report.pdf"
//             },
//             {
//                 title: "Monthly Inventory Check",
//                 type: "INVENTORY",
//                 reportDate: new Date('2025-08-01T15:30:00Z'),
//                 authorId: user1.id,
//                 status: ReportStatus.BLOCKED,
//                 fileUrl: null
//             },
//             {
//                 title: "Customer Activity Analysis",
//                 type: "CUSTOMER",
//                 reportDate: new Date('2025-08-02T11:45:00Z'),
//                 authorId: admin.id,
//                 status: ReportStatus.FAILED,
//                 fileUrl: null
//             },
//             {
//                 title: "Weekly Sales Summary",
//                 type: "SALES",
//                 reportDate: new Date('2025-08-05T09:00:00Z'),
//                 authorId: admin.id,
//                 status: ReportStatus.IN_PROGRESS,
//                 fileUrl: null
//             },
//             {
//                 title: "Feedback Digest",
//                 type: "CUSTOMER",
//                 reportDate: new Date('2025-08-04T12:00:00Z'),
//                 authorId: user2.id,
//                 status: ReportStatus.HIDDEN,
//                 fileUrl: null
//             },
//             {
//                 title: "Server Health Report",
//                 type: "SYSTEM",
//                 reportDate: new Date('2025-08-04T18:00:00Z'),
//                 authorId: admin.id,
//                 status: ReportStatus.ANSWERED,
//                 fileUrl: "https://example.com/reports/server-health-report.pdf"
//             }
//         ]
//     });
//     console.log('✅ Created 6 sample reports.');

//     console.log('✅ Seed data generated successfully.');
// }

// main()
//     .catch((e) => {
//         console.error('❌ Error in seeding:', e);
//         process.exit(1);
//     })
//     .finally(() => prisma.$disconnect());
