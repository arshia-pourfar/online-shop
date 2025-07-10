import axios from 'axios';
const API_BASE = 'http://localhost:5000';

export async function fetchProducts() {
    const res = await axios.get(`${API_BASE}/products`);
    return res.data;
}

export async function createProduct(productData: {
    name: string;
    price: number;
    description?: string;
    imageUrl?: string;
}) {
    const res = await axios.post(`${API_BASE}/products`, productData);
    return res.data;
} 