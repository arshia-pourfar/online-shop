"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Product } from "types/product";
import { getCategories } from "@/lib/api/categories";
import { getStatuses } from "@/lib/api/statuses";

interface FormState {
    id: number;
    name: string;
    price: number;
    stock: number;
    status: string;
    category: string;
    imageUrl: string;
    description?: string;
}

export default function ProductModal({
    show,
    onClose,
    onSave,
    product,
    type,
}: {
    show: boolean;
    onClose: () => void;
    onSave: (product: Product) => void;
    product: Product | null;
    type: "add" | "edit";
}) {
    const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
    const [statuses, setStatuses] = useState<string[]>([]);
    const [form, setForm] = useState<FormState>({
        id: 0,
        name: "",
        price: 0,
        stock: 0,
        status: "",
        category: "",
        imageUrl: "",
        description: "",
    });

    useEffect(() => {
        getCategories().then(setCategories);
        getStatuses().then(setStatuses);
    }, []);

    useEffect(() => {
        if (product) {
            const categoryName =
                typeof product.category === "string"
                    ? product.category
                    : categories.find((cat) => cat.id === (product as { categoryId?: number }).categoryId)?.name || "";

            setForm({
                id: product.id,
                name: product.name,
                price: product.price,
                stock: product.stock || 0,
                category: categoryName,
                imageUrl: product.imageUrl,
                status: product.status,
                description: product.description ?? "",
            });
        } else {
            setForm({
                id: 0,
                name: "",
                price: 0,
                stock: 0,
                category: "",
                imageUrl: "",
                status: "",
                description: "",
            });
        }
    }, [product, categories]);

    if (!show) return null;

    const handleSubmit = async () => {
        try {
            const categoryId = categories.find((cat) => cat.name === form.category)?.id;

            if (!form.name.trim() || isNaN(form.price) || !categoryId) {
                alert("اطلاعات ورودی کامل و معتبر نیست.");
                return;
            }

            const payload = {
                name: form.name.trim(),
                price: Number(form.price),
                stock: Number(form.stock),
                categoryId,
                status: form.status,
                description: form.description?.trim() ?? null,
                imageUrl: form.imageUrl?.trim() ?? null,
            };

            const res = await fetch(
                type === "edit"
                    ? `http://localhost:5000/api/products/${form.id}`
                    : "http://localhost:5000/api/products",
                {
                    method: type === "edit" ? "PUT" : "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                }
            );


            if (!res.ok) {
                const errorData = await res.json();
                throw new Error("Failed to save product: " + JSON.stringify(errorData));
            }

            const savedProduct = await res.json();
            onSave(savedProduct);
            onClose();
        } catch (error) {
            if (error instanceof Error) {
                console.error("[createProduct]", error.message);
                alert("خطا در ذخیره محصول: " + error.message);
            }
        }
    };

    return (
        <>
            <div className="fixed z-50 top-0 left-0 w-screen h-screen bg-black/50 backdrop-blur-sm"></div>
            <div className="bg-primary-bg rounded-xl p-6 w-full max-w-xl shadow-xl border border-gray-700 overflow-auto max-h-[90vh] z-50 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <h2 className="text-2xl font-semibold mb-6 text-accent">
                    {type === "add" ? "Add New Product" : "Edit Product"}
                </h2>
                <div className="space-y-4">
                    <input
                        type="text"
                        className="w-full border border-gray-600 rounded px-3 py-2 bg-primary-bg text-primary-text focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder="Product Name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                    <textarea
                        rows={3}
                        className="w-full border border-gray-600 rounded px-3 py-2 bg-primary-bg text-primary-text focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                        placeholder="Description"
                        value={form.description ?? ""}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                    <div className="flex gap-3">
                        <input
                            type="number"
                            min={0}
                            className="flex-1 border border-gray-600 rounded px-3 py-2 bg-primary-bg text-primary-text focus:outline-none focus:ring-2 focus:ring-accent"
                            placeholder="Price"
                            value={form.price}
                            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                        />
                        <input
                            type="number"
                            min={0}
                            className="flex-1 border border-gray-600 rounded px-3 py-2 bg-primary-bg text-primary-text focus:outline-none focus:ring-2 focus:ring-accent"
                            placeholder="Stock"
                            value={form.stock}
                            onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                        />
                    </div>
                    <select
                        className="w-full border border-gray-600 rounded px-3 py-2 bg-primary-bg text-primary-text focus:outline-none focus:ring-2 focus:ring-accent"
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                    >
                        <option value="">انتخاب دسته‌بندی</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.name}>
                                {cat.name}
                            </option>
                        ))}
                    </select>

                    <select
                        className="w-full border border-gray-600 rounded px-3 py-2 bg-primary-bg text-primary-text focus:outline-none focus:ring-2 focus:ring-accent"
                        value={form.status}
                        onChange={(e) => setForm({ ...form, status: e.target.value })}
                    >
                        {statuses.map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                    <input
                        type="text"
                        className="w-full border border-gray-600 rounded px-3 py-2 bg-primary-bg text-primary-text focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder="Image URL"
                        value={form.imageUrl}
                        onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                    />
                    {form.imageUrl && (
                        <Image
                            src={`/products/${form.imageUrl}`}
                            width={50}
                            height={50}
                            alt="Preview"
                            className="w-32 h-32 object-contain mt-2 rounded"
                        />
                    )}
                </div>
                <div className="flex justify-end gap-3 mt-6">
                    <button
                        className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600 text-primary-text"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="bg-accent text-white px-4 py-2 rounded hover:bg-accent/80"
                        onClick={handleSubmit}
                        disabled={!form.name.trim()}
                    >
                        Save
                    </button>
                </div>
            </div>
        </>
    );
}
