"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCreditCard } from "@fortawesome/free-solid-svg-icons";
import Header from "@/components/Header";
import { useAuth } from "@/lib/context/authContext";
import AddToCartButton from "@/components/ProductsCard/AddToCartButton";
import { CartItem } from "types/order";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export default function CartPage() {
    const { user } = useAuth();
    const router = useRouter();

    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [orderId, setOrderId] = useState("");

    useEffect(() => {
        if (!user) return;

        const fetchCart = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/orders/user/${user.id}?status=PENDING`);
                const order = await res.json();

                if (order && order.items) {
                    setCartItems(order.items);
                    setOrderId(order.id);
                }
            } catch (err) {
                console.error("خطا در گرفتن سفارش:", err);
            }
        };

        fetchCart();
    }, [user]);

    const totalPrice = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);


    const handleCheckout = async () => {
        if (!user || cartItems.length === 0 || !orderId) return;

        try {
            await fetch(`${API_BASE}/api/orders/${orderId}/confirm`, {
                method: "PATCH",
            });

            setCartItems([]);
            router.push(`/order-confirmation/${orderId}`);
        } catch (err) {
            console.error("خطا در تأیید سفارش:", err);
        }
    };


    return (
        <div className="min-h-screen w-full bg-primary-bg text-primary-text">
            <Header />

            <main className="p-4 md:p-8 space-y-8">
                <section className="flex items-center justify-between gap-6 flex-wrap">
                    <h1 className="text-4xl font-bold text-accent">Cart</h1>
                </section>

                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.length > 0 ? (
                            cartItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-secondary-bg rounded-xl shadow-md p-4 flex sm:flex-row flex-col gap-4 items-center hover:shadow-lg transition"
                                >
                                    <div className="w-28 h-28 relative flex-shrink-0">
                                        <Image
                                            src={`/products/${item.product.imageUrl}`}
                                            alt={item.product.name}
                                            fill
                                            className="object-contain rounded-lg"
                                        />
                                    </div>
                                    <div className="flex-1 ml-4">
                                        <h3 className="text-lg font-semibold">{item.product.name}</h3>
                                        <p className="text-sm text-secondary-text line-clamp-2">{item.product.description}</p>
                                        <p className="text-accent font-bold mt-2">${item.product.price}</p>
                                    </div>
                                    <AddToCartButton product={item.product} />
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-secondary-text py-20">Your cart is empty.</div>
                        )}
                    </div>

                    <div className="bg-secondary-bg rounded-xl shadow-md p-6 space-y-6 h-fit">
                        <h2 className="text-2xl font-bold text-accent">Order Summary</h2>
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>${totalPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping</span>
                            <span className="text-status-positive">Free</span>
                        </div>
                        <div className="border-t border-secondary-text pt-4 flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>${totalPrice.toFixed(2)}</span>
                        </div>
                        <button
                            onClick={handleCheckout}
                            className="cursor-pointer w-full bg-accent text-white py-3 rounded-lg flex items-center justify-center gap-2 font-medium hover:bg-accent/80 transition"
                        >
                            <FontAwesomeIcon icon={faCreditCard} />
                            Checkout
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );
}