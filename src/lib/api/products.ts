import { Product } from '../../types/product';
const API_BASE = 'https://order-dashboard-backend.vercel.app';

// Fetch all products
export async function getProducts(): Promise<Product[]> {
    const res = await fetch(`${API_BASE}/api/products`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
}

// Fetch a specific product
export async function getProductById(id: string): Promise<Product> {
    const res = await fetch(`${API_BASE}/api/products/${id}`);
    if (!res.ok) throw new Error('Failed to fetch product');
    return res.json();
}

export async function saveProduct(product: Product) {
    const payload = {
        name: product.name,
        price: Number(product.price),
        description: product.description || "",
        imageUrl: product.imageUrl,
        categoryId: typeof product.category === "object" ? product.category.id : Number(product.category),
    };

    const method = product.id ? "PUT" : "POST";
    const url = product.id ? `${API_BASE}/api/products/${product.id}` : `${API_BASE}/api/products`;

    const res = await fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to save product: ${errorText}`);
    }

    return await res.json();
}

// Create a new product
export async function createProduct(data: {
    name: string;
    price: number;
    description?: string;
}): Promise<Product> {
    const res = await fetch(`${API_BASE}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create product');
    return res.json();
}

// Delete a product
export async function deleteProduct(id: number): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/api/products/${id}`, {
        method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete product');
    return res.json();
}
