"use client";
import Header from "@/components/Header";
// import Pagination from "@/components/Pagination";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Product } from "../../types/product";
import { getProducts } from "@/lib/api/products";
import ProductModal from "@/components/EditAddProductModal";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import SortableTH from "@/components/Sortable";
import { getCategories } from "@/lib/api/categories";
import { Category } from "../../types/category";
import { getStatuses } from "@/lib/api/statuses";

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [statuses, setStatuses] = useState<string[]>([]);

    // State ها
    const [search, setSearch] = useState("");
    const [filterCategory, setFilterCategory] = useState<string>("");
    const [filterStatus, setFilterStatus] = useState<string>("");
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

    // بارگذاری داده‌ها
    useEffect(() => {
        getProducts().then(setProducts);
        getCategories().then(setCategories);
        getStatuses().then(setStatuses);
    }, []);

    // کمک‌گیرنده برای گرفتن شناسه دسته‌بندی از محصول
    const getCategoryId = (category: Category | string | number) => {
        if (typeof category === "object" && category !== null && "id" in category) {
            return category.id.toString();
        }
        return category.toString();
    };

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

        const categoryId = getCategoryId(p.category);
        const matchCategory = !filterCategory || categoryId === filterCategory;

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
    // const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // انتخاب همه / انتخاب تک محصول
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

    // کامپوننت نمایش وضعیت با رنگ و آیکون
    const StatusBadge = ({ status }: { status: string }) => {
        const active = status.toLowerCase() === "active" || status.toLowerCase() === "available";
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
    // const goToPage = (page: number) => {
    //     if (page < 1 || page > pageCount) return;
    //     setCurrentPage(page);
    //     setSelectedIds([]);
    // };

    return (
        <div className="w-full h-full flex flex-col">
            <Header />
            <div className="p-8 bg-primary-bg text-primary-text font-sans">
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
                        {categories.map((category: Category) => (
                            <option key={category.id} value={category.id.toString()}>
                                {category.name}
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
                        {statuses.map((st: string) => (
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
                                <SortableTH title="Image" onClick={() => { }} sortable={false} width="w-16" />
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
                                            {p.imageUrl ? (
                                                <Image
                                                    src={`/products/${p.imageUrl}`}
                                                    alt={p.name}
                                                    width={50}
                                                    height={50}
                                                    className="w-12 h-12 object-contain rounded cursor-pointer"
                                                    title="Click to enlarge"
                                                    onClick={() => window.open(`/products/${p.imageUrl}`, "_blank")}
                                                />
                                            ) : (
                                                <div className="w-12 h-12 bg-gray-300 rounded flex items-center justify-center text-sm text-gray-600">
                                                    No Image
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-2 py-2 font-semibold">{p.name}</td>
                                        <td className="px-2 py-2">${p.price.toFixed(2)}</td>
                                        <td className="px-2 py-2">{p.stock}</td>
                                        <td className="px-2 py-2">
                                            {typeof p.category === "object" && p.category !== null
                                                ? p.category.name
                                                : categories.find((c) => c.id.toString() === p.category.toString())?.name ||
                                                p.category}
                                        </td>
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
                {/* <Pagination currentPage={currentPage} pageCount={pageCount} onPageChange={goToPage} /> */}

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
        </div>
    );
}
