"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Product } from "types/product";

const categories = ["Shoes", "Bags", "Accessories"];
const statuses = ["Active", "Inactive"];

interface FormState {
    id: number;
    name: string;
    price: number;
    stock: number;
    category: string; // فقط نام دسته بندی
    status: string;
    imageUrl: string;
    description?: string;
}

export default function ProductModal({
    show,
    onClose,
    // onSave,
    product,
    type,
}: {
    show: boolean;
    onClose: () => void;
    onSave: (product: Product) => void;
    product: Product | null;
    type: "add" | "edit";
}) {
    const [form, setForm] = useState<FormState>({
        id: 0,
        name: "",
        price: 0,
        stock: 0,
        category: categories[0],
        status: statuses[0],
        imageUrl: "",
        description: "",
    });

    useEffect(() => {
        if (product) {
            setForm({
                id: product.id,
                name: product.name,
                price: product.price,
                stock: product.stock,
                category: typeof product.category === "string" ? product.category : product.category.name,
                status: product.status,
                imageUrl: product.imageUrl,
                // description: product.description,
            });
        } else {
            setForm({
                id: 0,
                name: "",
                price: 0,
                stock: 0,
                category: categories[0],
                status: statuses[0],
                imageUrl: "",
                description: "",
            });
        }
    }, [product]);

    if (!show) return null;

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
                            onChange={(e) =>
                                setForm({ ...form, price: Number(e.target.value) })
                            }
                        />
                        <input
                            type="number"
                            min={0}
                            className="flex-1 border border-gray-600 rounded px-3 py-2 bg-primary-bg text-primary-text focus:outline-none focus:ring-2 focus:ring-accent"
                            placeholder="Stock"
                            value={form.stock}
                            onChange={(e) =>
                                setForm({ ...form, stock: Number(e.target.value) })
                            }
                        />
                    </div>
                    <div className="flex gap-3">
                        <select
                            className="flex-1 border border-gray-600 rounded px-3 py-2 bg-primary-bg text-primary-text focus:outline-none focus:ring-2 focus:ring-accent"
                            value={form.category}
                            onChange={(e) =>
                                setForm({ ...form, category: e.target.value })
                            }
                        >
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                        <select
                            className="flex-1 border border-gray-600 rounded px-3 py-2 bg-primary-bg text-primary-text focus:outline-none focus:ring-2 focus:ring-accent"
                            value={form.status}
                            onChange={(e) => setForm({ ...form, status: e.target.value })}
                        >
                            {statuses.map((st) => (
                                <option key={st} value={st}>
                                    {st}
                                </option>
                            ))}
                        </select>
                    </div>
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
                        // onClick={() => {
                        //     // موقع ارسال به بیرون، category رو به شکل کامل یا رشته در نظر بگیر
                        //     onSave({
                        //         ...form,
                        //         id: product?.id || Date.now(),
                        //         category: form.category, 
                        //     });
                        // }}
                        disabled={!form.name.trim()}
                    >
                        Save
                    </button>
                </div>
            </div>
        </>
    );
}
