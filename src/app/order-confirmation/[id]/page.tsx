"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faMapMarkerAlt, faClock, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Order } from "types/order";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export default function OrderAddressPage() {
    const params = useParams();
    const router = useRouter();
    const { id } = params;
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [address, setAddress] = useState("");
    const [deliveryTime, setDeliveryTime] = useState("");

    useEffect(() => {
        if (!id) return;

        const fetchOrder = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/orders/${id}`);
                const data = await res.json();
                setOrder(data);
                setAddress(data.shippingAddress || "");
            } catch (error) {
                console.error("خطا در گرفتن سفارش:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    const handleSubmit = async () => {
        if (!address || !deliveryTime) return alert("لطفا آدرس و زمان ارسال را وارد کنید");

        try {
            // اینجا آپدیت سفارش روی بک‌اند
            await fetch(`${API_BASE}/api/orders/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    shippingAddress: address,
                    deliveryTime,
                }),
            });

            router.push(`/order-confirmation/${id}/payment`);
        } catch (err) {
            console.error("خطا در ذخیره آدرس:", err);
        }
    };

    return (
        <div className="min-h-screen w-full bg-primary-bg text-primary-text">
            <Header />

            <main className="p-4 md:p-8 max-w-2xl mx-auto space-y-8">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-accent animate-pulse">
                        <FontAwesomeIcon icon={faSpinner} spin className="text-4xl mb-4" />
                        <p className="text-lg">Loading your order...</p>
                    </div>
                ) : order ? (
                    <div className="bg-secondary-bg rounded-2xl shadow-md p-8 space-y-6">
                        <h1 className="text-2xl font-bold text-accent">Shipping Details</h1>

                        {/* Address input */}
                        <div className="space-y-2">
                            <label className="font-medium flex items-center gap-2">
                                <FontAwesomeIcon icon={faMapMarkerAlt} /> Address
                            </label>
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Enter your shipping address"
                                className="w-full p-3 rounded-lg border bg-primary-bg"
                            />
                        </div>

                        {/* Delivery time */}
                        <div className="space-y-2">
                            <label className="font-medium flex items-center gap-2">
                                <FontAwesomeIcon icon={faClock} /> Delivery Time
                            </label>
                            <input
                                type="date"
                                value={deliveryTime}
                                onChange={(e) => setDeliveryTime(e.target.value)}
                                className="w-full p-3 rounded-lg border bg-primary-bg"
                            />
                        </div>

                        <button
                            onClick={handleSubmit}
                            className="w-full bg-accent text-white py-3 rounded-lg flex items-center justify-center gap-2 font-medium hover:bg-accent/80 transition"
                        >
                            Confirm & Continue
                            <FontAwesomeIcon icon={faArrowRight} />
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
