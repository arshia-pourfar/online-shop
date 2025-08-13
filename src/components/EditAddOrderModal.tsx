"use client";
import React, { useState, useEffect } from "react";
import { Order, OrderItem } from "../types/order";

interface OrderModalProps {
    type: "add" | "edit" | "view";
    order: Order | null;
    onSave: (order: Order) => void;
    onClose: () => void;
    allStatuses: string[];
}

export default function OrderModal(
    {
        type,
        order,
        onSave,
        onClose,
        allStatuses,
    }: OrderModalProps) {
    const [formData, setFormData] = useState<Partial<Order>>({
        customerName: "",
        createdAt: new Date().toISOString().split("T")[0],
        total: 0,
        status: "PENDING",
        shippingAddress: "",
        items: [],
    });

    const [feedbackMessage, setFeedbackMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (type === "edit" && order) {
            setFormData({
                customerName: order.customerName,
                createdAt: order.createdAt.split("T")[0],
                total: order.total,
                status: order.status,
                shippingAddress: order.shippingAddress,
                items: order.items || [],
            });
        } else if (type === "add") {
            setFormData({
                customerName: "",
                createdAt: new Date().toISOString().split("T")[0],
                total: 0,
                status: allStatuses[0] || "PENDING",
                shippingAddress: "",
                items: [],
            });
        }
        setFeedbackMessage("");
    }, [type, order, allStatuses]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "totalAmount" ? Number(value) : value,
        }));
        setFeedbackMessage("");
    };

    // فقط یک نمایش ساده برای آیتم‌ها (امکان ویرایش آیتم‌ها اضافه نشده)
    const renderItems = () => {
        if (!formData.items || formData.items.length === 0)
            return <p className="text-gray-400">No items added.</p>;

        return formData.items.map((item: OrderItem, idx: number) => (
            <div
                key={idx}
                className="flex justify-between bg-secondary-bg rounded-xl p-3 mb-2 text-primary-text"
            >
                <span>
                    {item.productName} (x{item.quantity})
                </span>
                <span>${item.price.toFixed(2)}</span>
            </div>
        ));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // اعتبارسنجی ساده
        if (!formData.customerName?.trim() || !formData.createdAt || !formData.status) {
            setFeedbackMessage("Please fill in all required fields.");
            return;
        }

        setIsLoading(true);
        setFeedbackMessage("");

        try {
            // شبیه به API call: جایگزین کن با منطق خودت
            // مثلا: const savedOrder = await saveOrderAPI(formData);
            // اینجا فقط فرضی برای نمایش
            const savedOrder: Order = {
                id: order?.id || Date.now().toString(),
                userId: order?.userId || "",  // مقدار مناسب یا خالی
                // customerId: order?.userId || "", // مقدار مناسب یا خالی
                total: formData.total ?? 0, // ممکنه totalAmount همون total باشه
                createdAt: order?.createdAt || new Date().toISOString(),
                customerName: formData.customerName.trim(),
                // orderDate: formData.orderDate,
                // totalAmount: formData.totalAmount || 0,
                status: formData.status,
                shippingAddress: formData.shippingAddress || "",
                items: formData.items || [],
            };


            onSave(savedOrder);
            onClose();
        } catch {
            setFeedbackMessage("Failed to save order. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 py-4">
            <div className="bg-secondary-bg rounded-xl p-8 w-full max-w-lg max-h-[90vh] overflow-auto shadow-xl">
                <h2 className="text-2xl font-bold text-accent mb-6">
                    {type === "add" ? "Add New Order" : `Edit Order #${order?.id}`}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label
                            htmlFor="customerName"
                            className="block mb-2 text-sm font-semibold text-secondary-text"
                        >
                            Customer Name
                        </label>
                        <input
                            type="text"
                            id="customerName"
                            name="customerName"
                            value={formData.customerName || ""}
                            onChange={handleChange}
                            placeholder="Enter customer name"
                            required
                            className="w-full p-4 rounded-xl border border-gray-600 bg-secondary-bg text-primary-text placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-accent transition duration-300"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="orderDate"
                            className="block mb-2 text-sm font-semibold text-secondary-text"
                        >
                            Order Date
                        </label>
                        <input
                            type="date"
                            id="orderDate"
                            name="orderDate"
                            value={formData.createdAt || ""}
                            onChange={handleChange}
                            required
                            className="w-full p-4 rounded-xl border border-gray-600 bg-secondary-bg text-primary-text focus:outline-none focus:ring-4 focus:ring-accent transition duration-300"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="totalAmount"
                            className="block mb-2 text-sm font-semibold text-secondary-text"
                        >
                            Total Amount
                        </label>
                        <input
                            type="number"
                            id="totalAmount"
                            name="totalAmount"
                            value={formData.total || 0}
                            onChange={handleChange}
                            min={0}
                            step={0.01}
                            className="w-full p-4 rounded-xl border border-gray-600 bg-secondary-bg text-primary-text focus:outline-none focus:ring-4 focus:ring-accent transition duration-300"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="status"
                            className="block mb-2 text-sm font-semibold text-secondary-text"
                        >
                            Status
                        </label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status || "PENDING"}
                            onChange={handleChange}
                            required
                            className="w-full p-4 rounded-xl border border-gray-600 bg-secondary-bg text-primary-text focus:outline-none focus:ring-4 focus:ring-accent transition duration-300"
                        >
                            {["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map((st) => (
                                <option key={st} value={st}>
                                    {st}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label
                            htmlFor="shippingAddress"
                            className="block mb-2 text-sm font-semibold text-secondary-text"
                        >
                            Shipping Address
                        </label>
                        <textarea
                            id="shippingAddress"
                            name="shippingAddress"
                            rows={3}
                            value={formData.shippingAddress || ""}
                            onChange={handleChange}
                            placeholder="Enter shipping address"
                            className="w-full p-4 rounded-xl border border-gray-600 bg-secondary-bg text-primary-text placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-accent transition duration-300"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-semibold text-secondary-text">
                            Order Items (simplified)
                        </label>
                        <div className="max-h-40 overflow-auto">{renderItems()}</div>
                    </div>

                    {feedbackMessage && (
                        <p className="text-red-500 font-medium text-sm">{feedbackMessage}</p>
                    )}

                    <div className="flex justify-end gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="px-5 py-3 rounded-xl bg-gray-600 hover:bg-gray-700 text-white transition duration-300 ease-in-out"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-5 py-3 rounded-xl bg-accent hover:bg-accent-dark text-white transition duration-300 ease-in-out"
                        >
                            {isLoading ? "Saving..." : type === "add" ? "Create Order" : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
