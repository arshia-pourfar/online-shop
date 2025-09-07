"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import { useAuth } from "@/lib/context/authContext";
import { getAllOrdersByUser } from "@/lib/api/orders";
import { Order, OrderItem } from "types/order";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { Address } from "types/address";
import { getAddressById } from "@/lib/api/address";

export default function OrdersByUserPage() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [addresses, setAddresses] = useState<Record<string, Address>>({});

    useEffect(() => {
        if (!user) return;

        const fetchOrdersAndAddresses = async () => {
            try {
                const data = await getAllOrdersByUser(user?.id);
                setOrders(data);

                // گرفتن آدرس‌ها
                const addrMap: Record<string, Address> = {};
                for (const order of data) {
                    if (order.addressId) {
                        const addr = await getAddressById(order.addressId);
                        addrMap[order.id] = addr;
                    }
                }
                setAddresses(addrMap);

            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrdersAndAddresses();
    }, [user]);

    const calcOrderTotal = (items: OrderItem[]) => {
        return items.reduce(
            (sum, item) => sum + (item.product?.price ?? 0) * (item.quantity ?? 1),
            0
        );
    };

    return (
        <div className="min-h-screen w-full bg-primary-bg text-primary-text">
            <Header />

            <main className="p-3 md:p-10 mx-auto space-y-10">
                <h1 className="text-3xl md:text-4xl font-extrabold text-accent">
                    My Orders
                </h1>

                {isLoading ? (
                    <div className="flex justify-center items-center py-20 text-accent">
                        <FontAwesomeIcon icon={faSpinner} spin className="text-4xl" />
                        <span className="ml-3 text-lg">Loading your orders...</span>
                    </div>
                ) : orders.length > 0 ? (
                    <div className="space-y-6">
                        {orders.map((order) => {
                            const isOpen = expanded === order.id;
                            return (
                                <div
                                    key={order.id}
                                    className="bg-secondary-bg rounded-2xl shadow-md p-5 space-y-4 transition"
                                >
                                    {/* Order summary */}
                                    <div className="flex flex-col gap-4">
                                        <div className="flex lg:flex-row flex-col lg:justify-between lg:items-center gap-4">
                                            <div className="flex flex-col gap-2">
                                                <h2 className="sm:text-lg text-base font-bold">
                                                    Order #{order.id}
                                                </h2>
                                                <p className="sm:text-sm text-xs text-secondary-text">
                                                    {new Date(order.createdAt).toLocaleDateString(
                                                        "en-US",
                                                        {
                                                            year: "numeric",
                                                            month: "short",
                                                            day: "numeric",
                                                        }
                                                    )}
                                                </p>
                                                <p className="sm:text-sm text-xs">
                                                    Status:{" "}
                                                    <span
                                                        className={`font-semibold ${order.status === "Delivered"
                                                            ? "text-status-positive"
                                                            : order.status === "Pending"
                                                                ? "text-status-neutral"
                                                                : "text-status-negative"
                                                            }`}
                                                    >
                                                        {order.status}
                                                    </span>
                                                </p>
                                                <p className="sm:text-sm text-xs text-secondary-text">
                                                    Shipping: {addresses[order.id]
                                                        ? `${addresses[order.id].title}, ${addresses[order.id].street}, ${addresses[order.id].city}, ${addresses[order.id].postalCode}, ${addresses[order.id].country}`
                                                        : "Not specified"}
                                                </p>
                                            </div>

                                            <div className="flex flex-wrap items-center justify-between gap-6 lg:w-auto w-full">
                                                {/* Thumbnails */}
                                                <div className="flex -space-x-2 hover:space-x-2 transition-all group">
                                                    {order.items.slice(0, 4).map((item, index) => (
                                                        <div
                                                            key={item.id}
                                                            className="relative sm:size-14 size-11 rounded-md overflow-hidden bg-primary-bg border border-secondary-text -ml-2 transition-all duration-300 group-hover:ml-2 group-hover:scale-105"
                                                            style={{ zIndex: 10 - index }}
                                                        >
                                                            <Image
                                                                src={`/products/${item.product?.imageUrl}`}
                                                                alt={item.product?.name || item.productName}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                    ))}
                                                    {order.items.length > 4 && (
                                                        <div className="sm:size-14 size-11 flex items-center justify-center rounded-md bg-primary-bg text-sm font-medium border border-secondary-text">
                                                            +{order.items.length - 4}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex gap-6 items-center">
                                                    <div className="text-xl font-bold text-accent">
                                                        ${calcOrderTotal(order.items).toFixed(2)}
                                                    </div>

                                                    <button
                                                        onClick={() =>
                                                            setExpanded(isOpen ? null : order.id)
                                                        }
                                                        className="p-2 rounded-lg bg-primary-bg border hover:bg-accent hover:text-white transition"
                                                    >
                                                        {isOpen ? (
                                                            <FontAwesomeIcon icon={faAngleUp} className="w-5 h-5" />
                                                        ) : (
                                                            <FontAwesomeIcon icon={faAngleDown} className="w-5 h-5" />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order details */}
                                    {isOpen && (
                                        <div className="space-y-3 border-t border-secondary-text pt-4 animate-fadeIn">
                                            {order.items.map((item: OrderItem) => (
                                                <div
                                                    key={item.id}
                                                    className="flex items-center gap-4 bg-primary-bg rounded-xl p-3 shadow-md hover:scale-102 transition-all"
                                                >
                                                    <a
                                                        href={`./products/${item.productId}`}
                                                        className="relative sm:size-20 size-16 flex-shrink-0 rounded-lg overflow-hidden border"
                                                    >
                                                        <Image
                                                            src={`/products/${item.product?.imageUrl}`}
                                                            alt={item.product?.name || item.productName}
                                                            fill
                                                            className="object-contain"
                                                        />
                                                    </a>
                                                    <div className="flex-1">
                                                        <p className="font-medium sm:text-base text-sm text-primary-text">
                                                            {item.product?.name || item.productName}
                                                        </p>
                                                        <p className="sm:text-sm text-xs text-secondary-text">
                                                            Qty: {item.quantity} × $
                                                            {(item.product?.price ?? 0).toFixed(2)}
                                                        </p>
                                                    </div>
                                                    <div className="font-semibold text-primary-text">
                                                        $
                                                        {(
                                                            (item.product?.price ?? 0) *
                                                            (item.quantity ?? 1)
                                                        ).toFixed(2)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center text-secondary-text py-20">
                        <p className="sm:text-lg text-base">🛒 You don’t have any orders yet.</p>
                        <p className="sm:text-sm text-xs mt-2">Start shopping to see them here!</p>
                    </div>
                )}
            </main>
        </div>
    );
}
