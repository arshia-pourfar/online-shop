import { Product } from '../../types/product';
const API_BASE = 'http://localhost:5000';

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
