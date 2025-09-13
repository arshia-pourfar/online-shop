"use client";
import Header from "@/components/Header";
import Pagination from "@/components/Pagination";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Product } from "../../types/product";
import { getProducts } from "@/lib/api/products";
import ProductModal from "@/components/AdminDashboard/EditAddProductModal";
import DeleteConfirmModal from "@/components/AdminDashboard/DeleteConfirmModal"; // Make sure this import is correct
import SortableTH from "@/components/AdminDashboard/Sortable";
import { getCategories } from "@/lib/api/categories";
import { Category } from "../../types/category";
import { getProductStatuses } from "@/lib/api/statuses";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faAngleDown,
    faEdit,
    faPlus,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";
import ProductStatusBadge from "@/components/AdminDashboard/ProductStatusBadge";
import { useAuth } from "@/lib/context/authContext";

export default function ProductsPage() {
    const { user } = useAuth();
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

    // States for Delete Confirmation Modal
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState<number | 'bulk' | null>(null); // Can be product ID or 'bulk'
    const [deleteConfirmMessage, setDeleteConfirmMessage] = useState("");

    // بارگذاری داده‌ها
    useEffect(() => {
        getProducts().then(setProducts);
        getCategories().then(setCategories);
        getProductStatuses().then(setStatuses);
    }, []);

    // کمک‌گیرنده برای گرفتن شناسه دسته‌بندی از محصول
    const getCategoryId = (category: Category | string | number | null | undefined): string => {
        if (typeof category === "object" && category !== null && "id" in category && category.id !== undefined && category.id !== null) {
            return category.id.toString();
        }
        if (typeof category === "string" || typeof category === "number") {
            return category.toString();
        }
        return "";
    };

    // آمار
    const totalProducts = products.length;
    const availableProducts = products.filter((p) => p.status === "AVAILABLE").length;
    const outofstockProducts = products.filter((p) => p.status === "OUT_OF_STOCK").length;
    const discontinuedProducts = products.filter((p) => p.status === "DISCONTINUED").length;
    const comingsoonProducts = products.filter((p) => p.status === "COMING_SOON").length;
    const hiddenProducts = products.filter((p) => p.status === "HIDDEN").length;

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

            // Handle potential null/undefined values for comparison
            if (valA === null || valA === undefined) valA = "";
            if (valB === null || valB === undefined) valB = "";


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

    // انتخاب همه / انتخاب تک محصول
    const toggleSelectAll = () => {
        if (selectedIds.length === paginatedProducts.length && paginatedProducts.length > 0) {
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

    // آماده‌سازی برای حذف گروهی (نمایش مودال)
    const handleBulkDelete = () => {
        if (selectedIds.length === 0) return;
        setDeleteTargetId("bulk");
        setDeleteConfirmMessage(`Are you sure you want to delete ${selectedIds.length} selected products?`);
        setShowDeleteConfirm(true);
    };

    // آماده‌سازی برای حذف تکی (نمایش مودال)
    const prepareDelete = (id: number) => {
        setDeleteTargetId(id);
        setDeleteConfirmMessage("Are you sure you want to delete this product?");
        setShowDeleteConfirm(true);
    };

    // اجرای عملیات حذف (پس از تأیید در مودال)
    const executeDelete = async () => {
        if (deleteTargetId === null) return; // Should not happen if modal is shown correctly

        try {
            if (deleteTargetId === "bulk") {
                const deleteRequests = selectedIds.map((id) =>
                    fetch(`http://localhost:5000/api/products/${id}`, {
                        method: "DELETE",
                    })
                );

                const responses = await Promise.all(deleteRequests);
                const allSuccessful = responses.every((res) => res.ok);

                if (!allSuccessful) {
                    // You might want a more sophisticated error display here
                    console.error("Some products could not be deleted.");
                } else {
                    console.log("Selected products successfully deleted.");
                }

                setProducts((prev) => prev.filter((p) => !selectedIds.includes(p.id)));
                setSelectedIds([]); // Clear selection after deletion
            } else {
                // Individual delete
                const res = await fetch(`http://localhost:5000/api/products/${deleteTargetId}`, {
                    method: "DELETE",
                });

                if (!res.ok) throw new Error("Failed to delete product");

                setProducts((prev) => prev.filter((p) => p.id !== deleteTargetId));
                setSelectedIds((prev) => prev.filter((pid) => pid !== deleteTargetId)); // Also remove from selected
                console.log("Product successfully deleted.");
            }
        } catch (error) {
            console.error("Error during deletion:", error);
            // You might want a more sophisticated error display here
        } finally {
            setShowDeleteConfirm(false); // Always close the confirmation modal
            setDeleteTargetId(null); // Reset target ID
            setDeleteConfirmMessage(""); // Clear message
        }
    };

    // ذخیره محصول در مودال (این تابع از ProductModal فراخوانی می‌شود)
    const handleSave = (product: Product) => {
        // Since ProductModal now handles its own API calls, this function
        // primarily updates the local state after a successful save/update from the modal.
        if (modalType === "add") {
            setProducts([product, ...products]); // Add the new product returned from API
        } else {
            setProducts(products.map((p) => (p.id === product.id ? product : p))); // Update the product
        }
        setShowModal(false); // Close the modal
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

    // تغییر صفحه
    const goToPage = (page: number) => {
        if (page < 1 || page > pageCount) return;
        setCurrentPage(page);
        setSelectedIds([]);
    };

    if (user?.role !== 'ADMIN') {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-accent font-semibold text-lg">
                    You do not have permission to access this page.
                </p>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col">
            <Header />
            <div className="p-8 bg-primary-bg text-primary-text font-sans">
                {/* آمار محصولات */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                    <div className="bg-secondary-bg p-5 rounded-2xl shadow flex flex-col items-center">
                        <div className="text-sm text-secondary-text mb-1">Total Products</div>
                        <div className="text-2xl font-bold text-primary-text">{totalProducts}</div>
                    </div>
                    <div className="bg-secondary-bg p-5 rounded-2xl shadow flex flex-col items-center">
                        <div className="text-sm text-status-positive mb-1">Available Products</div>
                        <div className="text-2xl font-bold text-status-positive">{availableProducts}</div>
                    </div>
                    <div className="bg-secondary-bg p-5 rounded-2xl shadow flex flex-col items-center">
                        <div className="text-sm text-status-negative mb-1">Out of Stock</div>
                        <div className="text-2xl font-bold text-status-negative">{outofstockProducts}</div>
                    </div>
                    <div className="bg-secondary-bg p-5 rounded-2xl shadow flex flex-col items-center">
                        <div className="text-sm text-status-neutral mb-1">Discontinued</div>
                        <div className="text-2xl font-bold text-status-neutral">{discontinuedProducts}</div>
                    </div>
                    <div className="bg-secondary-bg p-5 rounded-2xl shadow flex flex-col items-center">
                        <div className="text-sm text-accent mb-1">Coming Soon</div>
                        <div className="text-2xl font-bold text-accent">{comingsoonProducts}</div>
                    </div>
                    <div className="bg-secondary-bg p-4 rounded-lg shadow flex-1 min-w-[140px] text-center">
                        <div className="text-sm text-secondary-text mb-1">Hidden Products</div>
                        <div className="text-xl font-semibold text-status-hidden">{hiddenProducts}</div>
                    </div>
                </div>

                {/* فیلترها و جستجو */}
                <div className="flex flex-col md:flex-row gap-4 mb-6 flex-wrap">
                    <input
                        type="text"
                        placeholder="Search product name or description..."
                        className="flex-1 min-w-52 rounded-md border border-secondary-text/30 bg-secondary-bg/20 p-3 text-primary-text placeholder-secondary-text shadow-sm focus:border-accent focus:ring-2 focus:ring-accent transition"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                    <div className="relative inline-block min-w-32 max-w-44 w-full">
                        <select
                            className="appearance-none w-full rounded-md border border-secondary-text/30 bg-secondary-bg/20 p-3 pr-10 text-secondary-text shadow-sm focus:border-accent focus:ring-2 focus:ring-accent transition"
                            value={filterCategory}
                            onChange={(e) => {
                                setFilterCategory(e.target.value);
                                setCurrentPage(1);
                            }}
                        >
                            <option value="" className="bg-secondary-bg text-primary-text">All Categories</option>
                            {categories.map((category: Category) => (
                                <option key={category.id} value={category.id.toString()} className="bg-secondary-bg text-primary-text">
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-secondary-text">
                            <FontAwesomeIcon icon={faAngleDown} />
                        </div>
                    </div>
                    <div className="relative inline-block min-w-32 max-w-44 w-full">
                        <select
                            className="appearance-none w-full rounded-md border border-secondary-text/30 bg-secondary-bg/20 p-3 pr-10 text-secondary-text shadow-sm focus:border-accent focus:ring-2 focus:ring-accent transition"
                            value={filterStatus}
                            onChange={(e) => {
                                setFilterStatus(e.target.value);
                                setCurrentPage(1);
                            }}
                        >
                            <option value="" className="bg-secondary-bg text-primary-text">All Statuses </option>
                            {statuses.map((status: string) => (
                                <option key={status} value={status} className="bg-secondary-bg text-primary-text">
                                    {status}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-secondary-text">
                            <FontAwesomeIcon icon={faAngleDown} />
                        </div>
                    </div>
                    <input
                        type="number"
                        min={0}
                        placeholder="Min Price"
                        className="no-spinner w-32 rounded-md border border-secondary-text/30 bg-secondary-bg/20 p-3 text-primary-text shadow-sm focus:border-accent focus:ring-2 focus:ring-accent transition"
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
                        className="no-spinner w-32 rounded-md border border-secondary-text/30 bg-secondary-bg/20 p-3 text-primary-text shadow-sm focus:border-accent focus:ring-2 focus:ring-accent transition"
                        value={filterMaxPrice}
                        onChange={(e) => {
                            const val = e.target.value;
                            setFilterMaxPrice(val === "" ? "" : Number(val));
                            setCurrentPage(1);
                        }}
                    />

                </div>

                {/* عملیات گروهی و دکمه افزودن کنار هم */}
                <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                        <label className="gap-2 select-none inline-flex items-center cursor-pointer group">
                            <div className="w-5 h-5 rounded-md border-2 border-gray-400 group-hover:border-primary flex items-center justify-center transition-all duration-200 peer-checked:border-primary peer-checked:bg-primary">
                                <input
                                    type="checkbox"
                                    checked={selectedIds.length === paginatedProducts.length && paginatedProducts.length > 0}
                                    onChange={toggleSelectAll}
                                    className="peer sr-only"
                                />
                                <svg
                                    className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            </div>
                            Select All
                        </label>
                        <button
                            disabled={selectedIds.length === 0}
                            onClick={handleBulkDelete}
                            className={`flex items-center justify-center text-center gap-2 px-4 py-3 rounded-md text-white transition
                                ${selectedIds.length === 0 ? "bg-gray-600 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"}
                            `}
                        >
                            <FontAwesomeIcon icon={faTrash} className="text-sm" />
                            Delete Selected ({selectedIds.length})
                        </button>
                    </div>
                    <button
                        className="flex items-center justify-center text-center gap-2 bg-accent text-white px-4 py-3 rounded-md hover:bg-accent/90 transition"
                        onClick={() => {
                            setModalType("add");
                            setCurrentProduct(null);
                            setShowModal(true);
                        }}
                    >
                        <FontAwesomeIcon icon={faPlus} className="text-sm" />
                        Add Product
                    </button>
                </div>

                {/* جدول محصولات */}
                <div className="overflow-x-auto rounded-xl shadow bg-secondary-bg border border-secondary-text/30">
                    <table className="min-w-full text-sm text-left table-fixed">
                        <thead className="bg-primary-bg text-accent select-none">
                            <tr>
                                <th className="w-10 px-2 py-3"></th>
                                <SortableTH title="Image" onClick={() => { }} sortable={false} width="w-20" />
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
                                            <label className="gap-2 select-none inline-flex items-center cursor-pointer group">
                                                <div className="w-5 h-5 rounded-md border-2 border-gray-400 group-hover:border-primary flex items-center justify-center transition-all duration-200 peer-checked:border-primary peer-checked:bg-primary">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedIds.includes(p.id)}
                                                        onChange={() => toggleSelectId(p.id)}
                                                        className="peer sr-only"
                                                    />
                                                    <svg
                                                        className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="3"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <polyline points="20 6 9 17 4 12" />
                                                    </svg>
                                                </div>
                                            </label>
                                        </td>
                                        <td className="px-2 py-2">
                                            {p.imageUrl ? (
                                                <Image
                                                    src={`/products/${p.imageUrl}`}
                                                    alt={p.name}
                                                    width={64}
                                                    height={64}
                                                    className="w-16 h-16 object-contain rounded-md cursor-pointer shadow-sm"
                                                    title="Click to enlarge"
                                                    onClick={() => window.open(`/products/${p.imageUrl}`, "_blank")}
                                                />
                                            ) : (
                                                <div className="w-16 h-16 bg-gray-400 rounded-md flex items-center justify-center text-sm text-gray-700">
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
                                                : categories.find((c) => c.id.toString() === p.category?.toString())?.name || p.category || ""}
                                        </td>
                                        <td className="px-2 py-2">
                                            <ProductStatusBadge status={p.status} />
                                        </td>
                                        <td className="px-2 h-20 flex items-center gap-2 justify-evenly">
                                            <button
                                                title="Edit"
                                                className="text-yellow-400 hover:text-yellow-500"
                                                onClick={() => {
                                                    setModalType("edit");
                                                    setCurrentProduct(p);
                                                    setShowModal(true);
                                                }}
                                            >
                                                <FontAwesomeIcon icon={faEdit} className="text-xl" />
                                            </button>
                                            <button
                                                title="Delete"
                                                className="text-red-600 hover:text-red-700"
                                                onClick={() => prepareDelete(p.id)}
                                            >
                                                <FontAwesomeIcon icon={faTrash} className="text-xl" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* صفحه‌بندی */}
                <Pagination currentPage={currentPage} pageCount={pageCount} onPageChange={goToPage} />

                {/* مودال‌ها */}
                <ProductModal
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    onSave={handleSave}
                    product={currentProduct}
                    type={modalType}
                />
                {/* Delete Confirmation Modal (Moved outside the loop and controlled by state) */}
                {showDeleteConfirm && (
                    <DeleteConfirmModal
                        show={showDeleteConfirm}
                        message={deleteConfirmMessage}
                        onCancel={() => {
                            setShowDeleteConfirm(false);
                            setDeleteTargetId(null); // Reset target ID on cancel
                            setDeleteConfirmMessage(""); // Clear message
                        }}
                        onConfirm={executeDelete} // Pass the function to execute deletion
                    />
                )}
            </div>
        </div>
    );
}