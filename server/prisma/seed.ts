import { PrismaClient, ProductStatus, OrderStatus, ReportStatus, Role, UserStatus } from '@prisma/client';
import 'dotenv/config';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🚀 Starting seeding...');

    // --- 1. Users ---
    const usersData = [
        { name: 'Admin User', email: 'admin@test.com', password: 'admin123', phone: '+989121234567', status: UserStatus.ACTIVE, role: Role.ADMIN },
        { name: 'Ali', email: 'ali@test.com', password: 'ali123', phone: '+989351112233', status: UserStatus.ACTIVE, role: Role.USER },
        { name: 'Sara Ahmadi', email: 'sara@test.com', password: 'sara123', phone: '+989194445566', status: UserStatus.INACTIVE, role: Role.USER },
        { name: 'Reza Karimi', email: 'reza@test.com', password: 'reza123', phone: '+989107778899', status: UserStatus.PENDING, role: Role.USER },
        { name: 'Maryam Najafi', email: 'maryam@test.com', password: 'maryam123', phone: '+989020001122', status: UserStatus.ACTIVE, role: Role.USER },
        { name: 'Suspended User', email: 'suspended@test.com', password: 'suspended123', phone: '+989019998877', status: UserStatus.SUSPENDED, role: Role.USER },
    ];

    const users = [];
    for (const u of usersData) {
        const hashedPassword = await bcrypt.hash(u.password, 10);
        const user = await prisma.user.upsert({
            where: { email: u.email },
            update: {},
            create: { ...u, password: hashedPassword },
        });
        users.push(user);
        console.log(`Upserted user: ${user.name}`);
    }

    // --- 2. Addresses ---
    for (const user of users) {
        const addresses = [
            { title: 'خانه', street: `Street of ${user.name}`, city: 'Tehran', postalCode: '12345', country: 'Iran', userId: user.id },
            { title: 'محل کار', street: `Office of ${user.name}`, city: 'Tehran', postalCode: '67890', country: 'Iran', userId: user.id }
        ];
        for (const addr of addresses) {
            const createdAddress = await prisma.address.create({ data: addr });
            console.log(`Created address for ${user.name}: ${createdAddress.title}`);
        }
    }

    // --- 3. Categories ---
    const categoriesData = [
        { name: "Accessories", slug: "accessories" },
        { name: "Display", slug: "display" },
        { name: "Cables", slug: "cables" },
        { name: "Audio", slug: "audio" },
        { name: "Camera", slug: "camera" },
        { name: "Furniture", slug: "furniture" },
        { name: "Storage", slug: "storage" },
        { name: "Wearables", slug: "wearables" },
        { name: "Networking", slug: "networking" },
        { name: "Power", slug: "power" },
        { name: "Lighting", slug: "lighting" },
        { name: "Charging", slug: "charging" },
    ];

    const categories = [];
    for (const cat of categoriesData) {
        const category = await prisma.category.upsert({
            where: { slug: cat.slug },
            update: {},
            create: cat,
        });
        categories.push(category);
        console.log(`Upserted category: ${category.name}`);
    }

    const categoryMap = new Map(categories.map(c => [c.slug, c.id]));

    // --- 4. Products ---
    const productData = [
        { name: 'Wireless Mouse', price: 29.99, description: 'Ergonomic wireless mouse with adjustable DPI', imageUrl: '61EZQh0-TZL._AC_UY327_FMwebp_QL65_.png', stock: 100, status: ProductStatus.AVAILABLE, category: 'accessories' },
        { name: 'Mechanical Keyboard', price: 89.99, description: 'Backlit mechanical keyboard with blue switches', imageUrl: '61ozM9WWtmL._AC_UY327_FMwebp_QL65_.png', stock: 75, status: ProductStatus.AVAILABLE, category: 'accessories' },
        { name: 'Gaming Monitor', price: 199.99, description: '24-inch Full HD 144Hz gaming monitor', imageUrl: '71u4mAb+V6L._AC_UY327_FMwebp_QL65_.png', stock: 30, status: ProductStatus.AVAILABLE, category: 'display' },
        { name: 'USB-C Cable', price: 9.99, description: '1.5m fast charging USB-C cable', imageUrl: '71TBf2WJmOL._AC_UY327_FMwebp_QL65_.png', stock: 200, status: ProductStatus.AVAILABLE, category: 'cables' },
        { name: 'Laptop Stand', price: 39.99, description: 'Adjustable aluminum laptop stand for all sizes', imageUrl: '81tmTKxscbL._AC_UY327_FMwebp_QL65_.png', stock: 60, status: ProductStatus.AVAILABLE, category: 'accessories' },
        { name: 'Bluetooth Speaker', price: 49.99, description: 'Portable Bluetooth speaker with deep bass', imageUrl: '61068h6mIgL._AC_UY327_FMwebp_QL65_.png', stock: 45, status: ProductStatus.AVAILABLE, category: 'audio' },
    ];

    const products = [];
    for (const p of productData) {
        const product = await prisma.product.create({
            data: {
                name: p.name,
                price: p.price,
                description: p.description,
                imageUrl: p.imageUrl,
                stock: p.stock,
                status: p.status,
                categoryId: categoryMap.get(p.category)!,
            },
        });
        products.push(product);
        console.log(`Created product: ${product.name}`);
    }

    // --- 5. Orders ---
    for (const [i, user] of users.entries()) {
        const userAddress = await prisma.address.findFirst({ where: { userId: user.id } });
        if (!userAddress) continue;

        await prisma.order.create({
            data: {
                userId: user.id,
                customerName: user.name!,
                addressId: userAddress.id,
                total: products[0].price * (i + 1),
                status: i % 2 === 0 ? OrderStatus.DELIVERED : OrderStatus.PENDING,
                items: {
                    create: [
                        { productId: products[i % products.length].id, quantity: i + 1 }
                    ]
                }
            }
        });
        console.log(`Created order for ${user.name}`);
    }

    // --- 6. Reports ---
    const reportsData = [
        { title: "Q2 Sales Report", type: "SALES", reportDate: new Date('2025-07-31'), authorId: users[0].id, status: ReportStatus.GENERATED, fileUrl: "https://example.com/q2.pdf" },
        { title: "Inventory Check", type: "INVENTORY", reportDate: new Date('2025-08-01'), authorId: users[1].id, status: ReportStatus.BLOCKED, fileUrl: null },
        { title: "Customer Activity", type: "CUSTOMER", reportDate: new Date('2025-08-02'), authorId: users[0].id, status: ReportStatus.FAILED, fileUrl: null },
    ];

    for (const r of reportsData) {
        await prisma.report.create({ data: r });
        console.log(`Created report: ${r.title}`);
    }

    console.log('✅ Seed data generated successfully.');
}

main()
    .catch((e) => {
        console.error('❌ Error in seeding:', e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
