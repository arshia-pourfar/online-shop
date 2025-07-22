import { Product } from "types/product";

const API_BASE = 'http://localhost:5000/api';

export async function saveProduct(product: Product) {
    const payload = {
        name: product.name,
        price: Number(product.price),
        description: product.description || "",
        imageUrl: product.imageUrl,
        categoryId: typeof product.category === "object" ? product.category.id : Number(product.category),
    };

    const method = product.id ? "PUT" : "POST";
    const url = product.id ? `${API_BASE}/products/${product.id}` : `${API_BASE}/products`;

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
