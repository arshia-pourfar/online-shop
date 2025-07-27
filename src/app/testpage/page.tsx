"use client";
import { useEffect, useState } from "react";
import { getCategories } from "@/lib/api/categories"; // مسیر خودت رو تنظیم کن
import { getProductStatuses } from "@/lib/api/statuses"; // مسیر خودت رو تنظیم کن
import { Category } from "types/category";
// import { Product } from "types/product";

interface ProductForm {
    id: number;
    name: string;
    price: number;
    stock: number;
    category: string;
    status: string;
    imageUrl: string;
    description: string;
    createdAt?: string;
}

export default function EditAddProductModal() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [statuses, setStatuses] = useState<string[]>([]);
    const [form, setForm] = useState<ProductForm>({
        id: 0,
        name: "",
        price: 0,
        stock: 0,
        category: "",
        status: "",
        imageUrl: "",
        description: "",
    });

    useEffect(() => {
        getCategories().then(setCategories);
        getProductStatuses().then(setStatuses);
    }, []);

    const handleSubmit = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!res.ok) throw new Error("Failed to save product");

            alert("Product saved successfully!");
        } catch (error) {
            console.error("Submit error:", error);
        }
    };

    return (
        <div className="space-y-4 p-4">
            <input
                type="text"
                placeholder="Product name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border px-3 py-2"
            />

            <input
                type="text"
                placeholder="image"
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                className="w-full border px-3 py-2"
            />

            <input
                type="text"
                placeholder="description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full border px-3 py-2"
            />

            <input
                type="number"
                placeholder="Price"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })}
                className="w-full border px-3 py-2"
            />
            <input
                type="number"
                placeholder="stock"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: parseFloat(e.target.value) })}
                className="w-full border px-3 py-2"
            />

            <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full border px-3 py-2"
            >
                <option value="">Choose Category</option>
                {categories.map((cat) => (
                    <option key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                    </option>
                ))}
            </select>

            <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full border px-3 py-2"
            >
                <option value="">Choose Status</option>
                {statuses.map((status) => (
                    <option key={status} value={status}>
                        {status}
                    </option>
                ))}
            </select>


            <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-4 py-2 rounded"
            >
                Save Product
            </button>
        </div>
    );
}
