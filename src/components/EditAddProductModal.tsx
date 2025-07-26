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
    const [categories, setCategories] = useState<{ id: number; name: string }[]>(
        []
    );
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
                    : categories.find((cat) => cat.id === (product as { categoryId?: number }).categoryId)
                        ?.name || "";

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
            <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50"></div>
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <div className="bg-primary-bg rounded-3xl p-10 max-w-xl w-full shadow-2xl border border-gray-700 max-h-[90vh] overflow-auto">
                    <h2 className="text-3xl font-extrabold text-accent mb-8 text-center tracking-wide">
                        {type === "add" ? "Add New Product" : "Edit Product"}
                    </h2>
                    <div className="space-y-6">
                        {/* Name */}
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-secondary-text mb-1"
                            >
                                Product Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                className="w-full rounded-xl border border-gray-600 bg-secondary-bg text-primary-text px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-accent transition duration-300 ease-in-out"
                                placeholder="Product Name"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label
                                htmlFor="description"
                                className="block text-sm font-medium text-secondary-text mb-1"
                            >
                                Description
                            </label>
                            <textarea
                                id="description"
                                rows={3}
                                className="w-full rounded-xl border border-gray-600 bg-secondary-bg text-primary-text px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-accent transition duration-300 ease-in-out resize-none"
                                placeholder="Description"
                                value={form.description ?? ""}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                            />
                        </div>

                        {/* Price & Stock */}
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label
                                    htmlFor="price"
                                    className="block text-sm font-medium text-secondary-text mb-1"
                                >
                                    Price
                                </label>
                                <input
                                    id="price"
                                    type="number"
                                    min={0}
                                    className="w-full rounded-xl border border-gray-600 bg-secondary-bg text-primary-text px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-accent transition duration-300 ease-in-out"
                                    placeholder="Price"
                                    value={form.price}
                                    onChange={(e) =>
                                        setForm({ ...form, price: Number(e.target.value) })
                                    }
                                />
                            </div>
                            <div className="flex-1">
                                <label
                                    htmlFor="stock"
                                    className="block text-sm font-medium text-secondary-text mb-1"
                                >
                                    Stock
                                </label>
                                <input
                                    id="stock"
                                    type="number"
                                    min={0}
                                    className="w-full rounded-xl border border-gray-600 bg-secondary-bg text-primary-text px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-accent transition duration-300 ease-in-out"
                                    placeholder="Stock"
                                    value={form.stock}
                                    onChange={(e) =>
                                        setForm({ ...form, stock: Number(e.target.value) })
                                    }
                                />
                            </div>
                        </div>

                        {/* Category */}
                        <div>
                            <label
                                htmlFor="category"
                                className="block text-sm font-medium text-secondary-text mb-1"
                            >
                                Category
                            </label>
                            <select
                                id="category"
                                className="w-full rounded-xl border border-gray-600 bg-secondary-bg text-primary-text px-4 py-3 focus:outline-none focus:ring-4 focus:ring-accent transition duration-300 ease-in-out"
                                value={form.category}
                                onChange={(e) => setForm({ ...form, category: e.target.value })}
                            >
                                <option value="">Choose Category</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.name}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Status */}
                        <div>
                            <label
                                htmlFor="status"
                                className="block text-sm font-medium text-secondary-text mb-1"
                            >
                                Status
                            </label>
                            <select
                                id="status"
                                className="w-full rounded-xl border border-gray-600 bg-secondary-bg text-primary-text px-4 py-3 focus:outline-none focus:ring-4 focus:ring-accent transition duration-300 ease-in-out"
                                value={form.status}
                                onChange={(e) => setForm({ ...form, status: e.target.value })}
                            >
                                <option value="">Choose Status</option>
                                {statuses.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Image URL */}
                        <div>
                            <label
                                htmlFor="imageUrl"
                                className="block text-sm font-medium text-secondary-text mb-1"
                            >
                                Image URL
                            </label>
                            <input
                                id="imageUrl"
                                type="text"
                                className="w-full rounded-xl border border-gray-600 bg-secondary-bg text-primary-text px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-accent transition duration-300 ease-in-out"
                                placeholder="Image URL"
                                value={form.imageUrl}
                                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                            />
                            {form.imageUrl && (
                                <Image
                                    src={`/products/${form.imageUrl}`}
                                    width={128}
                                    height={128}
                                    alt="Preview"
                                    className="w-32 h-32 object-contain mt-3 rounded-2xl"
                                />
                            )}
                        </div>
                    </div>
                    <div className="flex justify-end gap-6 mt-10">
                        <button
                            className="px-6 py-3 rounded-3xl bg-gray-700 text-white font-semibold hover:bg-gray-600 shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            className={`px-6 py-3 rounded-3xl font-semibold text-white shadow-lg transition duration-300 ease-in-out transform hover:scale-105 ${form.name.trim()
                                    ? "bg-accent hover:bg-accent/90 cursor-pointer"
                                    : "bg-gray-600 opacity-70 cursor-not-allowed"
                                }`}
                            onClick={handleSubmit}
                            disabled={!form.name.trim()}
                        >
                            Save Product
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
