"use client";
import Header from "@/components/Header";
import Image from "next/image";
import React, { useState, useEffect } from "react";
// import type { PaginationProps } from "@/components/pagination"
// import Pagination from "@/components/pagination"

// const handlePageChange = (page: number) => {
//     console.log("Page changed to:", page)
// }

// // اینم استفاده از تایپ
// const paginationData: PaginationProps = {
//     currentPage: 2,
//     totalPages: 10,
//     onPageChange: handlePageChange,
// }

interface Product {
    id: number;
    name: string;
    price: number;
    stock: number;
    status: string;
    category: string;
    image: string;
    description?: string;
}

const fakeProducts: Product[] = [
    {
        id: 1,
        name: "Running Shoes",
        price: 120,
        stock: 15,
        status: "Active",
        category: "Shoes",
        image: "/products/41VlTprOFdL._AC_UY327_FMwebp_QL65_.png",
        description: "Comfortable running shoes for daily use",
    },
    {
        id: 2,
        name: "Handbag",
        price: 85,
        stock: 8,
        status: "Inactive",
        category: "Bags",
        image: "/products/61ozM9WWtmL._AC_UY327_FMwebp_QL65_.png",
        description: "Elegant leather handbag",
    },
    {
        id: 3,
        name: "Wrist Watch",
        price: 250,
        stock: 5,
        status: "Active",
        category: "Accessories",
        image: "/products/71u4mAb+V6L._AC_UY327_FMwebp_QL65_.png",
        description: "Luxury wrist watch with leather strap",
    },
    {
        id: 4,
        name: "Running Shoes",
        price: 120,
        stock: 15,
        status: "Active",
        category: "Shoes",
        image: "/products/41VlTprOFdL._AC_UY327_FMwebp_QL65_.png",
        description: "Comfortable running shoes for daily use",
    },
    {
        id: 5,
        name: "Handbag",
        price: 85,
        stock: 8,
        status: "Inactive",
        category: "Bags",
        image: "/products/61ozM9WWtmL._AC_UY327_FMwebp_QL65_.png",
        description: "Elegant leather handbag",
    },
    {
        id: 6,
        name: "Wrist Watch",
        price: 250,
        stock: 5,
        status: "Active",
        category: "Accessories",
        image: "/products/71u4mAb+V6L._AC_UY327_FMwebp_QL65_.png",
        description: "Luxury wrist watch with leather strap",
    },
    {
        id: 7,
        name: "Running Shoes",
        price: 120,
        stock: 15,
        status: "Active",
        category: "Shoes",
        image: "/products/41VlTprOFdL._AC_UY327_FMwebp_QL65_.png",
        description: "Comfortable running shoes for daily use",
    },
    {
        id: 8,
        name: "Handbag",
        price: 85,
        stock: 8,
        status: "Inactive",
        category: "Bags",
        image: "/products/61ozM9WWtmL._AC_UY327_FMwebp_QL65_.png",
        description: "Elegant leather handbag",
    },
    {
        id: 9,
        name: "Wrist Watch",
        price: 250,
        stock: 5,
        status: "Active",
        category: "Accessories",
        image: "/products/71u4mAb+V6L._AC_UY327_FMwebp_QL65_.png",
        description: "Luxury wrist watch with leather strap",
    },
];

const categories = ["Shoes", "Bags", "Accessories"];
const statuses = ["Active", "Inactive"];

export default function ProductsPage() {
    // State ها
    const [products, setProducts] = useState<Product[]>(fakeProducts);
    const [search, setSearch] = useState("");
    const [filterCategory, setFilterCategory] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [filterMinPrice, setFilterMinPrice] = useState<number | "">("");
    const [filterMaxPrice, setFilterMaxPrice] = useState<number | "">("");
    const [sortField, setSortField] = useState<keyof Product | null>(null);
    const [sortAsc, setSortAsc] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    // مودال‌ها
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState<"add" | "edit">("add");
    const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

    // آمار
    const totalProducts = products.length;
    const activeProducts = products.filter((p) => p.status === "Active").length;
    const inactiveProducts = totalProducts - activeProducts;

    // فیلتر کردن محصولات
    let filteredProducts = products.filter((p) => {
        const matchSearch =
            !search ||
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            (p.description && p.description.toLowerCase().includes(search.toLowerCase()));
        const matchCategory = !filterCategory || p.category === filterCategory;
        const matchStatus = !filterStatus || p.status === filterStatus;
        const matchMinPrice = filterMinPrice === "" || p.price >= filterMinPrice;
        const matchMaxPrice = filterMaxPrice === "" || p.price <= filterMaxPrice;
        return matchSearch && matchCategory && matchStatus && matchMinPrice && matchMaxPrice;
    });

    // مرتب‌سازی
    if (sortField) {
        filteredProducts = filteredProducts.sort((a, b) => {
            let valA = a[sortField];
            let valB = b[sortField];
            if (typeof valA === "string") valA = valA.toLowerCase();
            if (typeof valB === "string") valB = valB.toLowerCase();

            if (valA! < valB!) return sortAsc ? -1 : 1;
            if (valA! > valB!) return sortAsc ? 1 : -1;
            return 0;
        });
    }

    // صفحه‌بندی
    const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // انتخاب همه / یک محصول
    const toggleSelectAll = () => {
        if (selectedIds.length === paginatedProducts.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(paginatedProducts.map((p) => p.id));
        }
    };

    const toggleSelectId = (id: number) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter((sid) => sid !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    // حذف چند محصول
    const handleBulkDelete = () => {
        if (
            selectedIds.length > 0 &&
            window.confirm(`Delete ${selectedIds.length} selected products?`)
        ) {
            setProducts(products.filter((p) => !selectedIds.includes(p.id)));
            setSelectedIds([]);
        }
    };

    // کپی محصول
    const handleCopy = (product: Product) => {
        const copy = { ...product, id: Date.now(), name: product.name + " (Copy)" };
        setProducts([copy, ...products]);
    };

    // ذخیره محصول در مودال
    const handleSave = (product: Product) => {
        if (modalType === "add") {
            setProducts([{ ...product, id: Date.now() }, ...products]);
        } else {
            setProducts(products.map((p) => (p.id === product.id ? product : p)));
        }
        setShowModal(false);
    };

    // باز کردن مودال حذف تاییدیه
    const confirmDelete = (id: number) => {
        setDeleteTargetId(id);
        setShowDeleteConfirm(true);
    };

    // حذف قطعی
    const handleDelete = () => {
        if (deleteTargetId !== null) {
            setProducts(products.filter((p) => p.id !== deleteTargetId));
            setShowDeleteConfirm(false);
            setDeleteTargetId(null);
            setSelectedIds(selectedIds.filter((id) => id !== deleteTargetId));
        }
    };

    // مرتب‌سازی با کلیک روی ستون
    const onSortClick = (field: keyof Product) => {
        if (sortField === field) {
            setSortAsc(!sortAsc);
        } else {
            setSortField(field);
            setSortAsc(true);
        }
    };

    // ----------------- کامپوننت مودال افزودن/ویرایش -----------------
    function ProductModal({
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
        const [form, setForm] = useState<Product>(
            product || {
                id: 0,
                name: "",
                price: 0,
                stock: 0,
                category: categories[0],
                status: statuses[0],
                image: "",
                description: "",
            }
        );

        useEffect(() => {
            if (product) setForm(product);
            else
                setForm({
                    id: 0,
                    name: "",
                    price: 0,
                    stock: 0,
                    category: categories[0],
                    status: statuses[0],
                    image: "",
                    description: "",
                });
        }, [product]);

        if (!show) return null;

        return (
            <div className="flex flex-col w-full h-full ">
                <Header />
                <div className="bg-primary-bg rounded-xl p-6 w-full max-w-lg shadow-xl border border-gray-700 overflow-auto max-h-[90vh]">
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
                            value={form.description}
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
                            value={form.image}
                            onChange={(e) => setForm({ ...form, image: e.target.value })}
                        />
                        {form.image && (
                            <Image
                                src={form.image}
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
                            onClick={() => onSave({ ...form, id: product?.id || Date.now() })}
                            disabled={!form.name.trim()}
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // مودال تایید حذف
    function DeleteConfirmModal({
        show,
        onCancel,
        onConfirm,
    }: {
        show: boolean;
        onCancel: () => void;
        onConfirm: () => void;
    }) {
        if (!show) return null;
        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-primary-bg rounded-xl p-6 max-w-sm w-full shadow-lg border border-gray-700">
                    <h3 className="text-xl font-semibold mb-4 text-red-500">
                        Confirm Delete
                    </h3>
                    <p className="mb-6 text-primary-text">
                        Are you sure you want to delete this product?
                    </p>
                    <div className="flex justify-end gap-3">
                        <button
                            className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600 text-primary-text"
                            onClick={onCancel}
                        >
                            Cancel
                        </button>
                        <button
                            className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 text-white"
                            onClick={onConfirm}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // نمایش وضعیت با رنگ و آیکون
    const StatusBadge = ({ status }: { status: string }) => {
        const active = status === "Active";
        return (
            <span
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${active ? "bg-green-600 text-white" : "bg-red-600 text-white"
                    }`}
            >
                {active ? (
                    <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        viewBox="0 0 24 24"
                    >
                        <path d="M5 13l4 4L19 7" />
                    </svg>
                ) : (
                    <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        viewBox="0 0 24 24"
                    >
                        <path d="M6 18L18 6M6 6l12 12" />
                    </svg>
                )}
                {status}
            </span>
        );
    };

    // تغییر صفحه
    const goToPage = (page: number) => {
        if (page < 1 || page > pageCount) return;
        setCurrentPage(page);
        setSelectedIds([]);
    };

    return (
        <div className="p-6 bg-primary-bg min-h-screen text-primary-text font-sans max-w-7xl mx-auto">
            {/* عنوان و دکمه افزودن */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <h1 className="text-3xl font-bold text-accent">Product Management</h1>
                <button
                    className="flex items-center gap-2 bg-accent text-white px-5 py-2 rounded hover:bg-accent/80 transition"
                    onClick={() => {
                        setModalType("add");
                        setCurrentProduct(null);
                        setShowModal(true);
                    }}
                >
                    <i className="fa fa-plus" /> Add Product
                </button>
            </div>

            {/* آمار محصولات */}
            <div className="flex flex-wrap gap-4 mb-6">
                <div className="bg-secondary-bg p-4 rounded shadow flex-1 min-w-[140px]">
                    <div className="text-sm text-secondary-text mb-1">Total Products</div>
                    <div className="text-xl font-bold">{totalProducts}</div>
                </div>
                <div className="bg-secondary-bg p-4 rounded shadow flex-1 min-w-[140px]">
                    <div className="text-sm text-secondary-text mb-1">Active Products</div>
                    <div className="text-xl font-bold text-green-400">{activeProducts}</div>
                </div>
                <div className="bg-secondary-bg p-4 rounded shadow flex-1 min-w-[140px]">
                    <div className="text-sm text-secondary-text mb-1">Inactive Products</div>
                    <div className="text-xl font-bold text-red-400">{inactiveProducts}</div>
                </div>
            </div>

            {/* فیلترها و جستجو */}
            <div className="flex flex-col md:flex-row gap-3 mb-4 flex-wrap">
                <input
                    type="text"
                    placeholder="Search product name or description..."
                    className="border border-gray-600 rounded px-3 py-2 flex-1 min-w-[200px] bg-primary-bg text-primary-text focus:outline-none focus:ring-2 focus:ring-accent"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setCurrentPage(1);
                    }}
                />
                <select
                    className="border border-gray-600 rounded px-3 py-2 bg-primary-bg text-primary-text min-w-[130px]"
                    value={filterCategory}
                    onChange={(e) => {
                        setFilterCategory(e.target.value);
                        setCurrentPage(1);
                    }}
                >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>
                <select
                    className="border border-gray-600 rounded px-3 py-2 bg-primary-bg text-primary-text min-w-[130px]"
                    value={filterStatus}
                    onChange={(e) => {
                        setFilterStatus(e.target.value);
                        setCurrentPage(1);
                    }}
                >
                    <option value="">All Statuses</option>
                    {statuses.map((st) => (
                        <option key={st} value={st}>
                            {st}
                        </option>
                    ))}
                </select>
                <input
                    type="number"
                    min={0}
                    placeholder="Min Price"
                    className="border border-gray-600 rounded px-3 py-2 bg-primary-bg text-primary-text w-[120px]"
                    value={filterMinPrice}
                    onChange={(e) => {
                        const val = e.target.value;
                        setFilterMinPrice(val === "" ? "" : Number(val));
                        setCurrentPage(1);
                    }}
                />
                <input
                    type="number"
                    min={0}
                    placeholder="Max Price"
                    className="border border-gray-600 rounded px-3 py-2 bg-primary-bg text-primary-text w-[120px]"
                    value={filterMaxPrice}
                    onChange={(e) => {
                        const val = e.target.value;
                        setFilterMaxPrice(val === "" ? "" : Number(val));
                        setCurrentPage(1);
                    }}
                />
            </div>

            {/* عملیات گروهی */}
            <div className="flex items-center gap-4 mb-4 flex-wrap">
                <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                    <input
                        type="checkbox"
                        checked={selectedIds.length === paginatedProducts.length && paginatedProducts.length > 0}
                        onChange={toggleSelectAll}
                    />
                    Select All
                </label>
                <button
                    disabled={selectedIds.length === 0}
                    onClick={handleBulkDelete}
                    className={`px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-600`}
                >
                    Delete Selected ({selectedIds.length})
                </button>
            </div>

            {/* جدول محصولات */}
            <div className="overflow-x-auto rounded-xl shadow bg-secondary-bg">
                <table className="min-w-full text-sm text-left table-fixed">
                    <thead className="bg-primary-bg text-accent">
                        <tr>
                            <th className="w-10 px-2 py-3">
                                <input
                                    type="checkbox"
                                    checked={selectedIds.length === paginatedProducts.length && paginatedProducts.length > 0}
                                    onChange={toggleSelectAll}
                                />
                            </th>
                            <SortableTH
                                title="Image"
                                onClick={() => { }}
                                sortable={false}
                                width="w-16"
                            />
                            <SortableTH
                                title="Name"
                                onClick={() => onSortClick("name")}
                                sortable={true}
                                sortAsc={sortAsc}
                                isActive={sortField === "name"}
                                width="w-48"
                            />
                            <SortableTH
                                title="Price"
                                onClick={() => onSortClick("price")}
                                sortable={true}
                                sortAsc={sortAsc}
                                isActive={sortField === "price"}
                                width="w-24"
                            />
                            <SortableTH
                                title="Stock"
                                onClick={() => onSortClick("stock")}
                                sortable={true}
                                sortAsc={sortAsc}
                                isActive={sortField === "stock"}
                                width="w-20"
                            />
                            <SortableTH
                                title="Category"
                                onClick={() => onSortClick("category")}
                                sortable={true}
                                sortAsc={sortAsc}
                                isActive={sortField === "category"}
                                width="w-28"
                            />
                            <SortableTH
                                title="Status"
                                onClick={() => onSortClick("status")}
                                sortable={true}
                                sortAsc={sortAsc}
                                isActive={sortField === "status"}
                                width="w-28"
                            />
                            <th className="px-2 py-3 w-40">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedProducts.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="text-center py-6 text-secondary-text">
                                    No products found.
                                </td>
                            </tr>
                        ) : (
                            paginatedProducts.map((p) => (
                                <tr
                                    key={p.id}
                                    className="border-b last:border-none hover:bg-primary-bg/50 transition"
                                >
                                    <td className="px-2 py-2 text-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(p.id)}
                                            onChange={() => toggleSelectId(p.id)}
                                        />
                                    </td>
                                    <td className="px-2 py-2">
                                        <Image
                                            src={p.image}
                                            alt={p.name}
                                            width={50}
                                            height={50}
                                            className="w-12 h-12 object-contain rounded cursor-pointer"
                                            title="Click to enlarge"
                                            onClick={() => window.open(p.image, "_blank")}
                                        />
                                    </td>
                                    <td className="px-2 py-2 font-semibold">{p.name}</td>
                                    <td className="px-2 py-2">${p.price.toFixed(2)}</td>
                                    <td className="px-2 py-2">{p.stock}</td>
                                    <td className="px-2 py-2">{p.category}</td>
                                    <td className="px-2 py-2">
                                        <StatusBadge status={p.status} />
                                    </td>
                                    <td className="px-2 py-2 flex gap-2">
                                        <button
                                            title="Edit"
                                            className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
                                            onClick={() => {
                                                setModalType("edit");
                                                setCurrentProduct(p);
                                                setShowModal(true);
                                            }}
                                        >
                                            <i className="fa fa-edit" />
                                        </button>
                                        <button
                                            title="Delete"
                                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                                            onClick={() => confirmDelete(p.id)}
                                        >
                                            <i className="fa fa-trash" />
                                        </button>
                                        <button
                                            title="Copy"
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                                            onClick={() => handleCopy(p)}
                                        >
                                            <i className="fa fa-copy" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* صفحه‌بندی */}
            <Pagination
                currentPage={currentPage}
                pageCount={pageCount}
                onPageChange={goToPage}
            />
            {/* مودال‌ها */}
            <ProductModal
                show={showModal}
                onClose={() => setShowModal(false)}
                onSave={handleSave}
                product={currentProduct}
                type={modalType}
            />
            <DeleteConfirmModal
                show={showDeleteConfirm}
                onCancel={() => setShowDeleteConfirm(false)}
                onConfirm={handleDelete}
            />
        </div>
    );
}

// کامپوننت TH جدول با قابلیت مرتب‌سازی
function SortableTH({
    title,
    onClick,
    sortable,
    sortAsc,
    isActive,
    width,
}: {
    title: string;
    onClick: () => void;
    sortable: boolean;
    sortAsc?: boolean;
    isActive?: boolean;
    width?: string;
}) {
    return (
        <th
            className={`${width || "w-auto"} px-2 py-3 cursor-pointer select-none user-select-none`}
            onClick={sortable ? onClick : undefined}
            title={sortable ? "Click to sort" : undefined}
        >
            <div className="flex items-center gap-1 select-none">
                {title}
                {sortable && (
                    <span>
                        {isActive ? (
                            sortAsc ? (
                                <i className="fa fa-sort-up" />
                            ) : (
                                <i className="fa fa-sort-down" />
                            )
                        ) : (
                            <i className="fa fa-sort" />
                        )}
                    </span>
                )}
            </div>
        </th>
    );
}

// کامپوننت صفحه‌بندی ساده
function Pagination({
    currentPage,
    pageCount,
    onPageChange,
}: {
    currentPage: number;
    pageCount: number;
    onPageChange: (page: number) => void;
}) {
    const pages = [];
    for (let i = 1; i <= pageCount; i++) {
        pages.push(i);
    }

    return (
        <nav
            aria-label="Pagination"
            className="mt-6 flex justify-center items-center gap-2 flex-wrap"
        >
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded bg-gray-700 text-primary-text disabled:opacity-50"
            >
                Prev
            </button>
            {pages.map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-3 py-1 rounded ${page === currentPage
                        ? "bg-accent text-white"
                        : "bg-secondary-bg text-primary-text hover:bg-accent/70"
                        }`}
                >
                    {page}
                </button>
            ))}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === pageCount}
                className="px-3 py-1 rounded bg-gray-700 text-primary-text disabled:opacity-50"
            >
                Next
            </button>
        </nav>
    );
}
