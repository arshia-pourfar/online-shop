"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faCreditCard } from "@fortawesome/free-solid-svg-icons";
import Header from "@/components/Header";
import { useAuth } from "@/lib/context/authContext";
import { useCart } from "../../../lib/context/cartContext";

export default function CartPage() {
    const { user } = useAuth();
    const { cart, removeFromCart, clearCart, saveCartToDB } = useCart();
    const router = useRouter();

    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleCheckout = async () => {
        if (!user) return;
        try {
            const order = await saveCartToDB(
                user.id,
                user.name || "Arshia",
                "Tehran"
            );
            clearCart();
            router.push(`/order-confirmation/${order.id}`);
        } catch (err) {
            console.error("Failed to save order:", err);
        }
    };

    return (
        <div className="min-h-screen w-full bg-primary-bg text-primary-text">
            <Header />

            <main className="p-4 md:p-8 space-y-12">
                <section className="flex items-center justify-between gap-6 flex-wrap">
                    <h1 className="text-4xl font-bold text-blue-400">Cart</h1>
                </section>

                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        {cart.length > 0 ? (
                            cart.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-secondary-bg rounded-xl shadow-md p-4 flex gap-4 items-center hover:shadow-lg transition"
                                >
                                    <div className="w-28 h-28 relative flex-shrink-0">
                                        <Image
                                            src={`/products/${item.imageUrl}`}
                                            alt={item.name}
                                            fill
                                            className="object-contain rounded-lg"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold">{item.name}</h3>
                                        <p className="text-sm text-gray-400">{item.description}</p>
                                        <p className="text-blue-400 font-bold mt-1">${item.price}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="px-4 py-1 font-medium">{item.quantity}</span>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-red-400 hover:text-red-300 transition"
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-gray-400 py-20">
                                Your cart is empty.
                            </div>
                        )}
                    </div>

                    <div className="bg-secondary-bg rounded-xl shadow-md p-6 space-y-6 h-fit">
                        <h2 className="text-2xl font-bold text-blue-400">Order Summary</h2>
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>${totalPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping</span>
                            <span className="text-green-400">Free</span>
                        </div>
                        <div className="border-t border-gray-600 pt-4 flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>${totalPrice.toFixed(2)}</span>
                        </div>
                        <button
                            onClick={handleCheckout}
                            className="w-full bg-accent text-white py-3 rounded-lg flex items-center justify-center gap-2 font-medium hover:bg-blue-600 transition"
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