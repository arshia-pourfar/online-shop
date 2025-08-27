"use client";
import React, { useState, useEffect } from "react";
import { User } from "../../types/user";

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
    const [formData, setFormData] = useState<Partial<User & { password?: string }>>({
        id: String(Date.now()),
        name: "",
        email: "",
        phone: "",
        status: allStatuses[0] || "PENDING",
        role: "USER",
        password: "",
    });

    const [feedbackMessage, setFeedbackMessage] = useState("");

    useEffect(() => {
        if (type === "edit" && customer) {
            setFormData({
                id: customer.id,
                name: customer.name,
                email: customer.email,
                phone: customer.phone,
                status: customer.status,
                role: customer.role,
            });
        } else if (type === "add") {
            setFormData((prev) => ({
                ...prev,
                id: String(Date.now()),
                status: allStatuses[0] || "PENDING",
                role: "USER",
                password: "",
            }));
        }
    }, [type, customer, allStatuses]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setFeedbackMessage("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (
            !formData.name?.trim() ||
            !formData.email?.trim() ||
            !formData.status?.trim() ||
            !formData.role?.trim() ||
            (type === "add" && !formData.password?.trim())
        ) {
            setFeedbackMessage(
                "Please fill in all required fields (Name, Email, Status, Role" +
                (type === "add" ? ", Password" : "") +
                ")."
            );
            return;
        }

        try {
            const payload: Partial<User & { password?: string }> = {
                name: formData.name.trim(),
                email: formData.email.trim(),
                phone: formData.phone?.trim() || undefined,
                status: formData.status.trim(),
                role: formData.role.trim(),
            };

            if (type === "add") {
                payload.password = formData.password?.trim();
            }

            const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
            const method = type === "add" ? "POST" : "PUT";
            const url =
                type === "add"
                    ? `${API_BASE}/api/users`
                    : `${API_BASE}/api/users/${formData.id}`;

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const text = await res.text();
                try {
                    const errData = JSON.parse(text);
                    throw new Error(errData.error || `HTTP error! status: ${res.status}`);
                } catch {
                    throw new Error(`HTTP error! status: ${res.status}. Response: ${text}`);
                }
            }

            const savedCustomer = await res.json();
            setFeedbackMessage(type === "add" ? "Customer created!" : "Customer updated!");
            onSave(savedCustomer);
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("Error:", error.message);
                setFeedbackMessage(error.message);
            } else {
                console.error("Unknown error:", error);
                setFeedbackMessage("An error occurred. Please try again.");
            }
        }
    };


    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 py-3">
            <div className="bg-secondary-bg rounded-xl p-8 w-full h-full overflow-y-auto max-w-lg shadow-xl">
                <h2 className="text-2xl font-bold text-accent mb-6">
                    {type === "add" ? "Add Customer" : "Edit Customer"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-secondary-text mb-2">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name || ""}
                            onChange={handleChange}
                            className={`w-full p-4 rounded-xl border ${!formData.name?.trim() && feedbackMessage ? "border-red-500" : "border-gray-600"
                                } bg-secondary-bg text-primary-text placeholder-gray-400 
              focus:outline-none focus:ring-4 focus:ring-accent transition duration-300 ease-in-out`}
                            placeholder="Enter name"
                            autoComplete="name"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-secondary-text mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email || ""}
                            onChange={handleChange}
                            className={`w-full p-4 rounded-xl border ${!formData.email?.trim() && feedbackMessage ? "border-red-500" : "border-gray-600"
                                } bg-secondary-bg text-primary-text placeholder-gray-400 
              focus:outline-none focus:ring-4 focus:ring-accent transition duration-300 ease-in-out`}
                            placeholder="Enter email"
                            autoComplete="email"
                            required
                        />
                    </div>

                    {/* Password only for add */}
                    {type === "add" && (
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-semibold text-secondary-text mb-2"
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password || ""}
                                onChange={handleChange}
                                className={`w-full p-4 rounded-xl border ${!formData.password?.trim() && feedbackMessage ? "border-red-500" : "border-gray-600"
                                    } bg-secondary-bg text-primary-text placeholder-gray-400 
                focus:outline-none focus:ring-4 focus:ring-accent transition duration-300 ease-in-out`}
                                placeholder="Enter password"
                                autoComplete="new-password"
                                required={type === "add"}
                            />
                        </div>
                    )}

                    {/* Phone */}
                    <div>
                        <label htmlFor="phone" className="block text-sm font-semibold text-secondary-text mb-2">
                            Phone
                        </label>
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            value={formData.phone || ""}
                            onChange={handleChange}
                            className="w-full p-4 rounded-xl border border-gray-600 bg-secondary-bg text-primary-text placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-accent transition duration-300 ease-in-out"
                            placeholder="Enter phone number"
                            autoComplete="tel"
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <label htmlFor="status" className="block text-sm font-semibold text-secondary-text mb-2">
                            Status
                        </label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status || ""}
                            onChange={handleChange}
                            className="w-full p-4 rounded-xl border border-gray-600 bg-secondary-bg text-primary-text focus:outline-none focus:ring-4 focus:ring-accent transition duration-300 ease-in-out"
                            required
                        >
                            {allStatuses.map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Role */}
                    <div>
                        <label htmlFor="role" className="block text-sm font-semibold text-secondary-text mb-2">
                            Role
                        </label>
                        <select
                            id="role"
                            name="role"
                            value={formData.role || ""}
                            onChange={handleChange}
                            className="w-full p-4 rounded-xl border border-gray-600 bg-secondary-bg text-primary-text focus:outline-none focus:ring-4 focus:ring-accent transition duration-300 ease-in-out"
                            required
                        >
                            {USER_ROLES.map((role) => (
                                <option key={role} value={role}>
                                    {role}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Feedback */}
                    {feedbackMessage && (
                        <p className="text-red-500 text-sm font-medium mt-2">{feedbackMessage}</p>
                    )}

                    {/* Buttons */}
                    <div className="flex justify-end gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-3 rounded-xl bg-gray-600 hover:bg-gray-700 text-white transition duration-300 ease-in-out"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-3 rounded-xl bg-accent hover:bg-accent-dark text-white transition duration-300 ease-in-out"
                        >
                            {type === "add" ? "Create Customer" : "Save Change"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
