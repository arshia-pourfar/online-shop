"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faMinus, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/lib/context/authContext";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

type Product = {
    id: number;
    name: string;
    price: number;
};

type CartItem = {
    id: number;
    quantity: number;
    product: Product;
};

export default function AddToCartButton({ product }: { product: Product }) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [orderId, setOrderId] = useState("");
    const [cartItem, setCartItem] = useState<CartItem | null>(null);

    useEffect(() => {
        if (!user) return;

        const fetchCart = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/orders/user/${user.id}?status=PENDING`);
                const order = await res.json();

                if (order && order.items) {
                    setOrderId(order.id);
                    const found = order.items.find((i: CartItem) => i.product.id === product.id);
                    if (found) setCartItem(found);
                }
            } catch (err) {
                console.error("خطا در گرفتن سفارش:", err);
            }
        };

        fetchCart();
    }, [user, product.id]);

    const handleAddToCart = async () => {
        if (!user) return;
        setLoading(true);

        try {
            const payload = { productId: product.id, quantity: 1 };

            if (orderId) {
                await fetch(`${API_BASE}/api/orders/${orderId}/items`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
            } else {
                const newOrderPayload = {
                    userId: user.id,
                    customerName: user.name || "Arshia",
                    shippingAddress: "Tehran",
                    total: product.price,
                    status: "PENDING",
                    items: [payload],
                };

                const res = await fetch(`${API_BASE}/api/orders`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newOrderPayload),
                });

                const newOrder = await res.json();
                setOrderId(newOrder.id);
            }

            // بعد از افزودن، دوباره آیتم رو بگیر
            const res = await fetch(`${API_BASE}/api/orders/user/${user.id}?status=PENDING`);
            const order = await res.json();
            const updatedItem = order.items.find((i: CartItem) => i.product.id === product.id);
            setCartItem(updatedItem);
        } catch (err) {
            console.error("خطا در افزودن به سبد:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleQuantityChange = async (newQty: number) => {
        if (!cartItem) return;

        if (newQty < 1) {
            await handleRemove();
            return;
        }

        try {
            await fetch(`${API_BASE}/api/orders/items/${cartItem.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ quantity: newQty }),
            });

            setCartItem({ ...cartItem, quantity: newQty });
        } catch (err) {
            console.error("خطا در تغییر تعداد:", err);
        }
    };

    const handleRemove = async () => {
        if (!cartItem) return;

        try {
            await fetch(`${API_BASE}/api/orders/items/${cartItem.id}`, {
                method: "DELETE",
            });
            setCartItem(null);
        } catch (err) {
            console.error("خطا در حذف آیتم:", err);
        }
    };

    return (
        <div className="flex items-center gap-4">
            {cartItem ? (
                <div className="flex items-center gap-2 bg-primary-bg p-2 rounded-lg ">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handleQuantityChange(cartItem.quantity - 1)}
                            className="text-base size-6 bg-gray-700 text-white rounded hover:bg-gray-600"
                            disabled={cartItem.quantity <= 1}
                        >
                            <FontAwesomeIcon icon={faMinus} />
                        </button>
                        <span className="text-base size-6 font-medium flex justify-center">
                            {cartItem.quantity}
                        </span>
                        <button
                            onClick={() => handleQuantityChange(cartItem.quantity + 1)}
                            className="text-base size-6 bg-gray-700 text-white rounded hover:bg-gray-600"
                        >
                            <FontAwesomeIcon icon={faPlus} />
                        </button>
                    </div>
                    <button
                        onClick={handleRemove}
                        className="text-red-400 hover:text-red-300 transition text-lg"
                    >
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                </div>
            ) : (
                <button
                    onClick={handleAddToCart}
                    disabled={loading}
                    className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex items-center gap-2"
                >
                    <FontAwesomeIcon icon={faCartShopping} />
                    <span>Add to Cart</span>
                </button>
            )}
        </div>
    );
}