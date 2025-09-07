"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { Order } from "types/order";
import { Address } from "types/address";
import { getAddressById } from "@/lib/api/address";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export default function PaymentSuccessPage() {
    const params = useParams();
    const router = useRouter();
    const { id } = params;

    const [order, setOrder] = useState<Order | null>(null);
    const [address, setAddress] = useState<Address | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchOrderAndAddress = async () => {
            try {
                // 1️⃣ گرفتن اطلاعات سفارش
                const res = await fetch(`${API_BASE}/api/orders/${id}`);
                if (!res.ok) throw new Error("Failed to fetch order");
                const data: Order = await res.json();
                setOrder(data);

                // 2️⃣ گرفتن آدرس
                if (data.addressId) {
                    const addr = await getAddressById(data.addressId);
                    setAddress(addr);
                }

                // 3️⃣ آپدیت وضعیت سفارش (مثلاً PENDING -> PROCESSING)
                if (data.status === "PENDING") {
                    await fetch(`${API_BASE}/api/orders/${id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ status: "PROCESSING" })
                    });
                    // وضعیت جدید رو در state هم ست می‌کنیم
                    setOrder(prev => prev ? { ...prev, status: "PROCESSING" } : prev);
                }

            } catch (error) {
                console.error("خطا در گرفتن سفارش یا آدرس:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderAndAddress();
    }, [id]);

    const formatAddress = (addr: Address | null) => {
        if (!addr) return "Not specified";
        return `${addr.title}, ${addr.street}, ${addr.city}, ${addr.postalCode}, ${addr.country}`;
    };

    const formatDeliveryTime = (deliveryTime?: string | null) => {
        if (!deliveryTime) return "Not specified";
        return new Date(deliveryTime).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const calculateTotal = (items: Order["items"]) => {
        return items
            .reduce(
                (sum, item) => sum + (item.product?.price ?? 0) * (item.quantity ?? 1),
                0
            )
            .toFixed(2);
    };

    return (
        <div className="min-h-screen w-full bg-primary-bg text-primary-text">
            <Header />
            <main className="p-4 md:p-8 max-w-3xl mx-auto space-y-8">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-accent animate-pulse">
                        <FontAwesomeIcon icon={faSpinner} spin className="text-4xl mb-4" />
                        <p className="text-lg">Processing payment...</p>
                    </div>
                ) : order ? (
                    <div className="bg-secondary-bg rounded-2xl shadow-md p-8 text-center space-y-6">
                        <FontAwesomeIcon
                            icon={faCircleCheck}
                            className="text-6xl text-status-positive"
                        />
                        <h1 className="text-3xl font-extrabold text-accent">
                            Payment Successful!
                        </h1>
                        <p className="text-secondary-text">
                            Thank you for your purchase. Your order has been placed successfully.
                        </p>

                        {/* Order summary */}
                        <div className="bg-primary-bg rounded-xl p-6 shadow-md text-left space-y-4">
                            <p><span className="font-bold">Order ID:</span> {order.id}</p>
                            <p>
                                <span className="font-bold">Date:</span>{" "}
                                {new Date(order.createdAt).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                })}
                            </p>
                            <p><span className="font-bold">Total:</span> ${calculateTotal(order.items)}</p>
                            <p><span className="font-bold">Shipping Address:</span> {formatAddress(address)}</p>
                            <p><span className="font-bold">Delivery Time:</span> {formatDeliveryTime(order.deliveryTime)}</p>
                            <p><span className="font-bold">Status:</span> {order.status}</p>
                        </div>

                        <button
                            onClick={() => router.push("/")}
                            className="bg-accent text-white px-6 py-3 rounded-lg font-medium hover:bg-accent/80 transition"
                        >
                            Continue Shopping
                        </button>
                    </div>
                ) : (
                    <div className="text-center py-20 text-status-negative">
                        Order not found ❌
                    </div>
                )}
            </main>
        </div>
    );
}
