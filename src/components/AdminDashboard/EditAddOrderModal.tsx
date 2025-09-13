"use client";
import React, { useState, useEffect } from "react";
import { Order, OrderItem } from "../../types/order";
import { Address } from "types/address";
import { addOrder, updateOrder } from "@/lib/api/orders";

interface OrderModalProps {
    type: "add" | "edit" | "view";
    order: Order | null;
    onSave: (order: Order) => void;
    onClose: () => void;
    allStatuses: string[];
    allAddresses: Address[];
}

export default function OrderModal({
    type,
    order,
    onSave,
    onClose,
    allStatuses,
    allAddresses,
}: OrderModalProps) {
    const [formData, setFormData] = useState<Partial<Order>>({
        customerName: "",
        createdAt: new Date().toISOString().split("T")[0],
        total: 0,
        status: allStatuses?.[0] ?? "PENDING",
        items: [],
        addressId: allAddresses?.[0]?.id ?? 1,
    });

    const [feedbackMessage, setFeedbackMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // محاسبه توتال
    const calculateTotal = (items: OrderItem[]) =>
        items.reduce(
            (sum, item) => sum + (item.product?.price ?? 0) * (item.quantity ?? 0),
            0
        );


    // وقتی سفارش برای ادیت لود میشه
    useEffect(() => {
        if (type === "edit" && order) {
            setFormData({
                customerName: order.customerName,
                createdAt: order.createdAt.split("T")[0],
                total: calculateTotal(order.items || []),
                status: order.status,
                items: order.items || [],
                userId: order.userId,
                addressId:
                    order.address?.id || order.addressId || allAddresses[0]?.id || 1,
            });
        } else if (type === "add") {
            setFormData({
                customerName: "",
                createdAt: new Date().toISOString().split("T")[0],
                total: 0,
                status: allStatuses[0] || "PENDING",
                items: [],
                addressId: allAddresses[0]?.id || 1,
            });
        }
        setFeedbackMessage("");
    }, [type, order, allStatuses, allAddresses]);

    // هر وقت آیتم‌ها تغییر کردن → توتال دوباره محاسبه میشه
    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            total: calculateTotal(prev.items || []),
        }));
    }, [formData.items]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: name === "addressId" ? Number(value) : value,
        }));

        setFeedbackMessage("");
    };

    // نمایش آیتم‌ها
    const renderItems = () => {
        if (!formData.items || formData.items.length === 0)
            return <p className="text-gray-400">No items added.</p>;

        return formData.items.map((item: OrderItem, idx: number) => (
            <div
                key={idx}
                className="flex justify-between bg-secondary-bg rounded-xl p-3 mb-2 text-primary-text"
            >
                <span>{item.product?.name ?? "Unknown"} (x{item.quantity ?? 0})</span>
                <span>${((item.product?.price ?? 0) * (item.quantity ?? 0)).toFixed(2)}</span>
            </div>
        ));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (
            !formData.customerName?.trim() ||
            !formData.createdAt ||
            !formData.status ||
            !formData.addressId
        ) {
            setFeedbackMessage("Please fill in all required fields.");
            return;
        }

        setIsLoading(true);
        setFeedbackMessage("");

        try {
            const selectedAddress = allAddresses.find(
                (a) => a.id === formData.addressId
            );

            const payload: Partial<Order> = {
                customerName: formData.customerName.trim(),
                createdAt: formData.createdAt,
                status: formData.status,
                total: calculateTotal(formData.items || []),
                items: formData.items,
                addressId: selectedAddress?.id,
            };

            let savedOrder: Order;
            if (type === "add") {
                savedOrder = await addOrder(payload);
            } else {
                savedOrder = await updateOrder(order!.id, payload);
            }

            onSave(savedOrder);
        } catch (err) {
            console.error(err);
            setFeedbackMessage("Failed to save order. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 py-4">
            <div className="bg-secondary-bg rounded-xl p-8 w-full max-w-lg max-h-[90vh] overflow-auto shadow-xl">
                <h2 className="text-2xl font-bold text-accent mb-6">
                    {type === "add" ? "Add New Order" : `Edit Order #${order?.id}`}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Customer Name */}
                    <div>
                        <label className="block mb-2 text-sm font-semibold text-secondary-text">
                            Customer Name
                        </label>
                        <input
                            type="text"
                            name="customerName"
                            value={formData.customerName || ""}
                            onChange={handleChange}
                            required
                            className="w-full p-4 rounded-xl border border-gray-600 bg-secondary-bg text-primary-text"
                        />
                    </div>

                    {/* Order Date */}
                    <div>
                        <label className="block mb-2 text-sm font-semibold text-secondary-text">
                            Order Date
                        </label>
                        <input
                            type="date"
                            name="createdAt"
                            value={formData.createdAt || ""}
                            onChange={handleChange}
                            required
                            className="w-full p-4 rounded-xl border border-gray-600 bg-secondary-bg text-primary-text"
                        />
                    </div>

                    {/* Total Amount (ReadOnly) */}
                    <div>
                        <label className="block mb-2 text-sm font-semibold text-secondary-text">
                            Total Amount
                        </label>
                        <input
                            type="number"
                            name="total"
                            value={formData.total || 0}
                            readOnly
                            className="w-full p-4 rounded-xl border border-gray-600 bg-gray-800 text-primary-text"
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block mb-2 text-sm font-semibold text-secondary-text">
                            Status
                        </label>
                        <select
                            name="status"
                            value={formData.status || allStatuses[0]}
                            onChange={handleChange}
                            required
                            className="w-full p-4 rounded-xl border border-gray-600 bg-secondary-bg text-primary-text"
                        >
                            {allStatuses.map((st) => (
                                <option key={st} value={st}>
                                    {st}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block mb-2 text-sm font-semibold text-secondary-text">
                            Shipping Address
                        </label>
                        <select
                            name="addressId"
                            value={formData.addressId || allAddresses[0]?.id}
                            onChange={handleChange}
                            className="w-full p-4 rounded-xl border border-gray-600 bg-secondary-bg text-primary-text"
                        >
                            {allAddresses.map((addr) => (
                                <option key={addr.id} value={addr.id}>
                                    {addr.street}, {addr.city}, {addr.postalCode}, {addr.country}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Items */}
                    <div>
                        <label className="block mb-2 text-sm font-semibold text-secondary-text">
                            Order Items
                        </label>
                        <div className="max-h-40 overflow-auto">{renderItems()}</div>
                    </div>

                    {/* Feedback */}
                    {feedbackMessage && (
                        <p className="text-accent font-medium text-sm">{feedbackMessage}</p>
                    )}

                    {/* Buttons */}
                    <div className="flex justify-end gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="px-5 py-3 rounded-xl bg-gray-600 text-white"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-5 py-3 rounded-xl bg-accent text-white"
                        >
                            {isLoading
                                ? "Saving..."
                                : type === "add"
                                    ? "Create Order"
                                    : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
