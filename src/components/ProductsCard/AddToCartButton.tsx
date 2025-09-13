"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faMinus, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/lib/context/authContext";
import { getAddressesByUser } from "@/lib/api/address";
import { useCart } from "@/lib/context/cartContext"; // 👈 اتصال به context
import { MinimalProduct } from "types/product";
import { CartItem } from "types/order";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://192.168.1.228:5000";

// type Product = { id: number; name: string; price: number };
// type CartItem = { id: number; quantity: number; product: Product };
type CustomStyle = { main: string; button: string; text: string };

export default function AddToCartButton({ product, customStyle }: { product: MinimalProduct; customStyle?: CustomStyle }) {
    const { user } = useAuth();
    const { refreshCart } = useCart(); // 👈 گرفتن تابع آپدیت
    const [loading, setLoading] = useState(false);
    const [cartItem, setCartItem] = useState<CartItem | null>(null);
    const [isCreatingOrder, setIsCreatingOrder] = useState(false);

    useEffect(() => {
        if (!user) return;

        const fetchCart = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/orders/user/${user.id}?status=PENDING`);
                const order = await res.json();
                if (order && order.items) {
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
        if (!user || isCreatingOrder) return;

        setLoading(true);
        setIsCreatingOrder(true); // 🚨 جلوگیری از چند کلیک همزمان

        try {
            const resCheck = await fetch(`${API_BASE}/api/orders/user/${user.id}?status=PENDING`);
            const existingOrder = await resCheck.json();
            let orderId = existingOrder?.id;

            let addressId = 1;
            const addresses = await getAddressesByUser(user.id);
            if (addresses && addresses.length > 0) {
                addressId = addresses[0].id;
            }

            if (!orderId) {
                const resNewOrder = await fetch(`${API_BASE}/api/orders`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        userId: user.id,
                        status: "PENDING",
                        customerName: user.name || "Unknown",
                        addressId,
                        items: [],
                    }),
                });
                const newOrder = await resNewOrder.json();
                orderId = newOrder.id;
            }

            if (!orderId) {
                console.error("سفارش ساخته نشد!");
                return;
            }

            const resAddItem = await fetch(`${API_BASE}/api/orders/${orderId}/items`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId: product.id, quantity: 1 }),
            });

            const updatedItem = await resAddItem.json();
            setCartItem(updatedItem);
            await refreshCart();
        } catch (err) {
            console.error("خطا در افزودن به سبد:", err);
        } finally {
            setLoading(false);
            setIsCreatingOrder(false); // ✅ اجازه کلیک بعدی
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
            await refreshCart(); // 👈 آپدیت بعد از تغییر تعداد
        } catch (err) {
            console.error("خطا در تغییر تعداد:", err);
        }
    };

    const handleRemove = async () => {
        if (!cartItem) return;

        try {
            await fetch(`${API_BASE}/api/orders/items/${cartItem.id}`, { method: "DELETE" });
            setCartItem(null);
            await refreshCart(); // 👈 آپدیت بعد از حذف
        } catch (err) {
            console.error("خطا در حذف آیتم:", err);
        }
    };

    return (
        <div className="flex items-center">
            {cartItem ? (
                <div className={`${customStyle?.main} flex items-center gap-2 dark:bg-primary-bg dark:text-primary-text bg-secondary-text text-secondary-bg p-2 rounded-lg`}>
                    <div className="flex items-center gap-2">
                        <button onClick={() => handleQuantityChange(cartItem.quantity - 1)} className={`${customStyle?.button || "dark:bg-secondary-bg dark:text-white dark:hover:bg-secondary-bg/80 sm:text-base sm:size-6 text-lg size-8"} bg-secondary-bg text-primary-text hover:bg-secondary-bg/80 rounded cursor-pointer`} disabled={cartItem.quantity <= 1}>
                            <FontAwesomeIcon icon={faMinus} />
                        </button>
                        <span className={`${customStyle?.text || "sm:text-base sm:size-6 text-lg size-8"} font-medium flex items-center justify-center`}>
                            {cartItem.quantity}
                        </span>
                        <button onClick={() => handleQuantityChange(cartItem.quantity + 1)} className={`${customStyle?.button || "dark:bg-secondary-bg dark:text-white dark:hover:bg-secondary-bg/80 sm:text-base sm:size-6 text-lg size-8"} bg-secondary-bg text-primary-text hover:bg-secondary-bg/80 rounded cursor-pointer`}>
                            <FontAwesomeIcon icon={faPlus} />
                        </button>
                    </div>
                    <button onClick={handleRemove} className={`${customStyle?.text || "sm:text-lg text-xl"} text-accent hover:text-accent/70 cursor-pointer transition sm:mx-1 ml-6 mr-2 flex items-center`}>
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                </div>
            ) : (
                <button onClick={handleAddToCart} disabled={loading} className={`${customStyle ? "py-5 px-10 text-2xl" : "sm:px-4 sm:py-2 px-6 py-3"} bg-accent text-white rounded-lg hover:bg-accent/75 cursor-pointer transition flex items-center justify-center gap-2`}>
                    {loading ? (
                        <div className="animate-spin rounded-full size-6 border-t-2 border-white border-opacity-70"></div>
                    ) : (
                        <>
                            <FontAwesomeIcon icon={faCartShopping} />
                            <span>Add</span>
                        </>
                    )}
                </button>
            )}
        </div>
    );
}