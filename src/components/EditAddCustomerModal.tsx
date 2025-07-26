// components/EditAddCustomerModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import { User } from "../types/user";

const USER_ROLES = ["USER", "ADMIN"];

interface CustomerModalProps {
    type: "add" | "edit";
    customer: User | null;
    onSave: (customer: User) => void;
    onClose: () => void;
    allStatuses: string[];
}

export default function CustomerModal({
    type,
    customer,
    onSave,
    onClose,
    allStatuses,
}: CustomerModalProps) {
    const [formData, setFormData] = useState<Partial<User>>(() => {
        if (type === "edit" && customer) {
            return { ...customer };
        }
        return {
            id: String(Date.now()),
            name: "",
            email: "",
            phone: "",
            status: allStatuses[0] || "PENDING",
            role: "USER",
        };
    });

    const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
    const [isFormValid, setIsFormValid] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (type === "edit" && customer) {
            setFormData({ ...customer });
        } else if (type === "add") {
            setFormData({
                id: String(Date.now()),
                name: "",
                email: "",
                phone: "",
                status: allStatuses[0] || "PENDING",
                role: "USER",
            });
        }
        setFeedbackMessage(null);
    }, [customer, type, allStatuses]);

    useEffect(() => {
        const isValid =
            formData.name?.trim() &&
            formData.email?.trim() &&
            formData.status?.trim() &&
            formData.role?.trim();
        setIsFormValid(!!isValid);
    }, [formData]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setFeedbackMessage(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (
            !formData.name?.trim() ||
            !formData.email?.trim() ||
            !formData.status?.trim() ||
            !formData.role?.trim()
        ) {
            setFeedbackMessage(
                "Please fill in all required fields (Name, Email, Status, Role)."
            );
            return;
        }

        setIsLoading(true);
        setFeedbackMessage(null);

        try {
            const payload = {
                name: formData.name?.trim(),
                email: formData.email?.trim(),
                phone: formData.phone?.trim() || null,
                status: formData.status?.trim(),
                role: formData.role?.trim(),
            };

            let res;
            if (type === "add") {
                res = await fetch("http://localhost:5000/api/users", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
            } else {
                if (!customer?.id) {
                    throw new Error("Customer ID is missing for edit operation.");
                }
                res = await fetch(`http://localhost:5000/api/users/${customer.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
            }

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to save customer.");
            }

            const savedUser: User = await res.json();
            onSave(savedUser);
            setFeedbackMessage(
                type === "add"
                    ? "Customer added successfully!"
                    : "Customer updated successfully!"
            );
            setTimeout(() => {
                onClose();
            }, 1000);
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.error("[getUserById]", err.message);
                setFeedbackMessage(err.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-primary-bg p-10 rounded-3xl shadow-2xl w-full max-w-xl border border-gray-700 max-h-[90vh] overflow-auto relative">
                <h2 className="text-4xl font-extrabold text-accent mb-10 text-center tracking-wide">
                    {type === "add" ? "Add New Customer" : "Edit Customer"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-semibold text-secondary-text mb-3"
                        >
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name || ""}
                            onChange={handleChange}
                            className={`w-full p-4 rounded-xl border ${!formData.name?.trim() && feedbackMessage
                                    ? "border-red-500"
                                    : "border-gray-600"
                                } bg-secondary-bg text-primary-text placeholder-gray-400 
              focus:outline-none focus:ring-4 focus:ring-accent transition duration-300 ease-in-out`}
                            placeholder="Enter customer name"
                            required
                            autoComplete="off"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-semibold text-secondary-text mb-3"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email || ""}
                            onChange={handleChange}
                            className={`w-full p-4 rounded-xl border ${!formData.email?.trim() && feedbackMessage
                                    ? "border-red-500"
                                    : "border-gray-600"
                                } bg-secondary-bg text-primary-text placeholder-gray-400
              focus:outline-none focus:ring-4 focus:ring-accent transition duration-300 ease-in-out`}
                            placeholder="Enter customer email"
                            required
                            autoComplete="off"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="phone"
                            className="block text-sm font-semibold text-secondary-text mb-3"
                        >
                            Phone (Optional)
                        </label>
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            value={formData.phone || ""}
                            onChange={handleChange}
                            className="w-full p-4 rounded-xl border border-gray-600 bg-secondary-bg text-primary-text placeholder-gray-400
              focus:outline-none focus:ring-4 focus:ring-accent transition duration-300 ease-in-out"
                            placeholder="+98 912 345 6789"
                            autoComplete="off"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="status"
                            className="block text-sm font-semibold text-secondary-text mb-3"
                        >
                            Status
                        </label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status || ""}
                            onChange={handleChange}
                            className={`w-full p-4 rounded-xl border ${!formData.status?.trim() && feedbackMessage
                                    ? "border-red-500"
                                    : "border-gray-600"
                                } bg-secondary-bg text-primary-text
              focus:outline-none focus:ring-4 focus:ring-accent transition duration-300 ease-in-out`}
                            required
                        >
                            {allStatuses.map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label
                            htmlFor="role"
                            className="block text-sm font-semibold text-secondary-text mb-3"
                        >
                            Role
                        </label>
                        <select
                            id="role"
                            name="role"
                            value={formData.role || ""}
                            onChange={handleChange}
                            className={`w-full p-4 rounded-xl border ${!formData.role?.trim() && feedbackMessage
                                    ? "border-red-500"
                                    : "border-gray-600"
                                } bg-secondary-bg text-primary-text
              focus:outline-none focus:ring-4 focus:ring-accent transition duration-300 ease-in-out`}
                            required
                        >
                            <option value="" disabled>
                                Select Role
                            </option>
                            {USER_ROLES.map((role) => (
                                <option key={role} value={role}>
                                    {role}
                                </option>
                            ))}
                        </select>
                    </div>

                    {feedbackMessage && (
                        <div
                            className={`p-4 rounded-lg text-center text-sm font-semibold shadow-md ${feedbackMessage.includes("successfully")
                                    ? "bg-green-600 text-white"
                                    : "bg-red-600 text-white"
                                }`}
                        >
                            {feedbackMessage}
                        </div>
                    )}

                    <div className="flex justify-end gap-5 mt-10">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="px-8 py-3 rounded-3xl bg-gray-700 text-white font-semibold hover:bg-gray-600 transition duration-300 ease-in-out shadow-lg transform hover:scale-105"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!isFormValid || isLoading}
                            className={`px-8 py-3 rounded-3xl text-white font-semibold shadow-lg transition duration-300 ease-in-out transform hover:scale-105 ${isFormValid && !isLoading
                                    ? "bg-accent hover:bg-accent/90"
                                    : "bg-gray-600 cursor-not-allowed opacity-70"
                                }`}
                        >
                            {isLoading ? "Saving..." : "Save Customer"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
