/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect } from "react";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import OrderModal from "@/components/EditAddOrderModal";
import Header from "@/components/Header";
import Pagination from "@/components/Pagination";
import SortableTH from "@/components/Sortable";
import OrderStatusBadge from "@/components/ProductStatusBadge";
import { getOrders } from "@/lib/api/orders";
import { getOrderStatuses } from "@/lib/api/statuses";
import { Order, SortableField } from "types/order";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faEdit, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";

const OrdersPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [orderStatuses, setOrderStatuses] = useState<Order["status"][]>([]);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState<Order["status"] | "">("");
    const [filterMinTotalAmount, setFilterMinTotalAmount] = useState<number | "">("");
    // const [sortField, setSortField] = useState<keyof Order | null>(null);
    const [sortAsc, setSortAsc] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const [sortField, setSortField] = useState<SortableField | null>(null);

    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState<"add" | "edit" | "view">("add");
    const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState<string | "bulk" | null>(null);
    const [deleteConfirmMessage, setDeleteConfirmMessage] = useState("");

    const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
    const [feedbackType, setFeedbackType] = useState<"success" | "error" | null>(null);

    useEffect(() => {
        getOrders().then(setOrders);
        getOrderStatuses().then(setOrderStatuses);
    }, []);

    // const totalOrders = orders.length;
    // const pendingOrders = orders.filter((o) => o.status === "PENDING").length;
    // const processingOrders = orders.filter((o) => o.status === "PROCESSING").length;
    // const shippedOrders = orders.filter((o) => o.status === "SHIPPED").length;
    // const deliveredOrders = orders.filter((o) => o.status === "DELIVERED").length;
    // const cancelledOrders = orders.filter((o) => o.status === "CANCELLED").length;

    function isNestedField(field: SortableField): field is "user.email" | "user.phone" {
        return field === "user.email" || field === "user.phone";
    }
    function getSortableValue(order: Order, field: SortableField): string | number {
        if (isNestedField(field)) {
            switch (field) {
                case "user.email":
                    return order.user?.email ?? "";
                case "user.phone":
                    return order.user?.phone ?? "";
            }
        }

        return order[field] as string | number;
    }

    function sortOrders(orders: Order[], field: SortableField, asc: boolean): Order[] {
        return [...orders].sort((a, b) => {
            const valA = getSortableValue(a, field);
            const valB = getSortableValue(b, field);

            if (field === "orderDate") {
                const dateA = new Date(valA as string).getTime();
                const dateB = new Date(valB as string).getTime();
                return asc ? dateA - dateB : dateB - dateA;
            }

            if (typeof valA === "number" && typeof valB === "number") {
                return asc ? valA - valB : valB - valA;
            }

            const strA = String(valA).toLowerCase();
            const strB = String(valB).toLowerCase();
            return asc ? strA.localeCompare(strB) : strB.localeCompare(strA);
        });
    }
    let filteredOrders = orders.filter((order) => {
        const q = search.trim().toLowerCase();
        const matchesSearch =
            !q || order.id.toLowerCase().includes(q) || order.customerName.toLowerCase().includes(q);
        const matchesStatus = !filterStatus || order.status === filterStatus;
        const matchesMinAmount =
            filterMinTotalAmount === "" || order.totalAmount >= filterMinTotalAmount;
        return matchesSearch && matchesStatus && matchesMinAmount;
    });

    if (sortField) {
        filteredOrders = sortOrders(filteredOrders, sortField, sortAsc);
    }
    // let filteredOrders = orders.filter((order) => {
    //     const q = search.trim().toLowerCase();
    //     const matchesSearch =
    //         !q || order.id.toLowerCase().includes(q) || order.customerName.toLowerCase().includes(q);
    //     const matchesStatus = !filterStatus || order.status === filterStatus;
    //     const matchesMinAmount =
    //         filterMinTotalAmount === "" || order.totalAmount >= filterMinTotalAmount;
    //     return matchesSearch && matchesStatus && matchesMinAmount;
    // });

    // if (sortField) {
    //     filteredOrders = filteredOrders.sort((a, b) => {
    //         let valA = a[sortField];
    //         let valB = b[sortField];

    //         if (valA === null || valA === undefined) valA = "";
    //         if (valB === null || valB === undefined) valB = "";

    //         if (sortField === "orderDate") {
    //             const dateA = new Date(valA as string).getTime();
    //             const dateB = new Date(valB as string).getTime();
    //             return sortAsc ? dateA - dateB : dateB - dateA;
    //         }

    //         if (typeof valA === "number" && typeof valB === "number") {
    //             return sortAsc ? valA - valB : valB - valA;
    //         }

    //         const strA = String(valA).toLowerCase();
    //         const strB = String(valB).toLowerCase();
    //         return sortAsc ? strA.localeCompare(strB) : strB.localeCompare(strA);
    //     });
    // }

    const pageCount = Math.ceil(filteredOrders.length / itemsPerPage);
    const paginatedOrders = filteredOrders.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const toggleSelectAll = () => {
        if (selectedIds.length === paginatedOrders.length && paginatedOrders.length > 0) {
            setSelectedIds([]);
        } else {
            setSelectedIds(paginatedOrders.map((o) => o.id));
        }
    };

    const toggleSelectId = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
        );
    };

    const confirmDelete = (id: string) => {
        setDeleteTargetId(id);
        setDeleteConfirmMessage("Are you sure you want to delete this order?");
        setShowDeleteConfirm(true);
    };

    const handleBulkDelete = () => {
        if (selectedIds.length === 0) return;
        setDeleteTargetId("bulk");
        setDeleteConfirmMessage(`Are you sure you want to delete ${selectedIds.length} selected orders?`);
        setShowDeleteConfirm(true);
    };

    const executeDelete = async () => {
        if (deleteTargetId === null) return;

        try {
            let successMessage = "";
            if (deleteTargetId === "bulk") {
                const deleteRequests = selectedIds.map((id) =>
                    fetch(`http://localhost:5000/api/orders/${id}`, { method: "DELETE" })
                );
                const responses = await Promise.all(deleteRequests);
                const allOk = responses.every((res) => res.ok);
                if (!allOk) throw new Error("Some orders could not be deleted.");

                setOrders((prev) => prev.filter((o) => !selectedIds.includes(o.id)));
                setSelectedIds([]);
                successMessage = `${selectedIds.length} orders deleted successfully.`;
            } else {
                const res = await fetch(`http://localhost:5000/api/orders/${deleteTargetId}`, {
                    method: "DELETE",
                });
                if (!res.ok) throw new Error("Order deletion failed.");

                setOrders((prev) => prev.filter((o) => o.id !== deleteTargetId));
                setSelectedIds((prev) => prev.filter((id) => id !== deleteTargetId));
                successMessage = "Order deleted successfully.";
            }

            setFeedbackMessage(successMessage);
            setFeedbackType("success");
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "An unexpected error occurred.";
            setFeedbackMessage(`Deletion failed: ${message}`);
            setFeedbackType("error");
        } finally {
            setShowDeleteConfirm(false);
            setDeleteTargetId(null);
            setDeleteConfirmMessage("");
            setTimeout(() => {
                setFeedbackMessage(null);
                setFeedbackType(null);
            }, 3000);
        }
    };

    const handleSave = (order: Order) => {
        if (modalType === "add") {
            setOrders([order, ...orders]);
        } else {
            setOrders(orders.map((o) => (o.id === order.id ? order : o)));
        }
        setShowModal(false);
        setFeedbackMessage("Order saved successfully.");
        setFeedbackType("success");
    };

    const onSortClick = (field: SortableField) => {
        if (sortField === field) {
            setSortAsc(!sortAsc);
        } else {
            setSortField(field);
            setSortAsc(true);
        }
    };


    const goToPage = (page: number) => {
        if (page < 1 || page > pageCount) return;
        setCurrentPage(page);
        setSelectedIds([]);
    };

    return (
        <div className="w-full h-full flex flex-col">
            <Header />
            <div className="p-8 bg-primary-bg text-primary-text font-sans">
                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6 flex-wrap">
                    <input
                        type="text"
                        placeholder="Search by customer name, email, or phone..."
                        className="flex-1 min-w-64 rounded-md border border-secondary-text/30 bg-secondary-bg/20 p-3 text-primary-text placeholder-secondary-text shadow-sm focus:border-accent focus:ring-2 focus:ring-accent transition"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                    <div className="relative inline-block min-w-32 max-w-44 w-full">
                        <select
                            className="appearance-none w-full rounded-md border border-secondary-text/30 bg-secondary-bg/20 p-3 pr-10 text-secondary-text shadow-sm focus:border-accent focus:ring-2 focus:ring-accent transition"
                            value={filterStatus}
                            onChange={(e) => {
                                setFilterStatus(e.target.value);
                                setCurrentPage(1);
                            }}
                        >
                            <option value="">All Statuses</option>
                            {orderStatuses.map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-secondary-text">
                            <FontAwesomeIcon icon={faAngleDown} />
                        </div>
                    </div>
                </div>

                {/* Bulk Actions */}
                <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                        <label className="gap-2 select-none inline-flex items-center cursor-pointer group">
                            <div className="w-5 h-5 rounded-md border-2 border-gray-400 group-hover:border-primary flex items-center justify-center transition-all duration-200 peer-checked:border-primary peer-checked:bg-primary">
                                <input
                                    type="checkbox"
                                    checked={selectedIds.length === paginatedOrders.length && paginatedOrders.length > 0}
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
                            className={`flex items-center justify-center text-center gap-2 px-4 py-3 rounded-md text-white transition ${selectedIds.length === 0 ? "bg-gray-600 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
                                }`}
                        >
                            <FontAwesomeIcon icon={faTrash} className="text-sm" />
                            Delete Selected ({selectedIds.length})
                        </button>
                    </div>
                    <button
                        className="flex items-center justify-center text-center gap-2 bg-accent text-white px-4 py-3 rounded-md hover:bg-accent/90 transition"
                        onClick={() => {
                            setModalType("add");
                            setCurrentOrder(null);
                            setShowModal(true);
                        }}
                    >
                        <FontAwesomeIcon icon={faPlus} className="text-sm" />
                        Add Order
                    </button>
                </div>

                {/* Feedback */}
                {feedbackMessage && (
                    <div className={`p-3 rounded-md text-sm font-medium text-center mb-4 ${feedbackType === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"} shadow-md`}>
                        {feedbackMessage}
                    </div>
                )}

                {/* Orders Table */}
                <div className="overflow-x-auto rounded-xl shadow bg-secondary-bg border border-secondary-text/30">
                    <table className="min-w-full text-sm text-left table-fixed">
                        <thead className="bg-primary-bg text-accent select-none">
                            <tr>
                                <th className="w-10 px-2 py-3"></th>
                                <SortableTH
                                    title="Customer"
                                    onClick={() => onSortClick("customerName")}
                                    sortable={true}
                                    sortAsc={sortAsc}
                                    isActive={sortField === "customerName"}
                                    width="w-48"
                                />
                                <SortableTH
                                    title="Email"
                                    onClick={() => onSortClick("user.email")}
                                    sortable={true}
                                    sortAsc={sortAsc}
                                    isActive={sortField === "user.email"}
                                    width="w-64"
                                />
                                <SortableTH
                                    title="Phone"
                                    onClick={() => onSortClick("user.phone")}
                                    sortable={true}
                                    sortAsc={sortAsc}
                                    isActive={sortField === "user.phone"}
                                    width="w-36"
                                />
                                <SortableTH
                                    title="Status"
                                    onClick={() => onSortClick("status")}
                                    sortable={true}
                                    sortAsc={sortAsc}
                                    isActive={sortField === "status"}
                                    width="w-32"
                                />
                                <SortableTH
                                    title="Total"
                                    onClick={() => onSortClick("totalAmount")}
                                    sortable={true}
                                    sortAsc={sortAsc}
                                    isActive={sortField === "totalAmount"}
                                    width="w-28"
                                />
                                <th className="px-2 py-3 w-40">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-6 text-secondary-text">
                                        No orders found.
                                    </td>
                                </tr>
                            ) : (
                                paginatedOrders.map((order) => (
                                    <tr key={order.id} className="border-b last:border-none hover:bg-primary-bg/50 transition">
                                        <td className="px-2 py-2 text-center">
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.includes(order.id)}
                                                onChange={() => toggleSelectId(order.id)}
                                                className="w-4 h-4 accent-primary"
                                            />
                                        </td>
                                        <td className="px-2 py-2 font-semibold">{order.customerName}</td>
                                        <td className="px-2 py-2">{order.user ? order.user.email : "not found"}</td>
                                        <td className="px-2 py-2">{order.user ? order.user.phone : "not found"}</td>
                                        <td className="px-2 py-2">
                                            <OrderStatusBadge status={order.status || "UNKNOWN"} />
                                        </td>
                                        <td className="px-2 py-2 font-bold text-primary-text">
                                            {typeof order.totalAmount === "number"
                                                ? `$${order.totalAmount.toFixed(2)}`
                                                : "N/A"}
                                        </td>
                                        <td className="px-2 h-20 flex items-center gap-2 justify-evenly">
                                            <button
                                                title="Edit"
                                                className="text-yellow-400 hover:text-yellow-500"
                                                onClick={() => {
                                                    setModalType("edit");
                                                    setCurrentOrder(order);
                                                    setShowModal(true);
                                                }}
                                            >
                                                <FontAwesomeIcon icon={faEdit} className="text-xl" />
                                            </button>
                                            <button
                                                title="Delete"
                                                className="text-red-600 hover:text-red-700"
                                                onClick={() => confirmDelete(order.id)}
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

                {/* Pagination */}
                <Pagination
                    currentPage={currentPage}
                    pageCount={pageCount}
                    onPageChange={goToPage}
                />
            </div>

            {/* Modals */}
            {showModal && (
                <OrderModal
                    type={modalType}
                    order={currentOrder}
                    onSave={handleSave}
                    onClose={() => setShowModal(false)}
                    allStatuses={orderStatuses}
                />
            )}

            {showDeleteConfirm && (
                <DeleteConfirmModal
                    show={showDeleteConfirm}
                    message={deleteConfirmMessage}
                    onConfirm={executeDelete}
                    onCancel={() => {
                        setShowDeleteConfirm(false);
                        setDeleteTargetId(null);
                        setDeleteConfirmMessage("");
                    }}
                />
            )}
        </div>

    );
};

export default OrdersPage;