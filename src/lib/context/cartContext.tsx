// src/context/CartContext.tsx
"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Order, CartItem } from "../../types/order";

type CartContextType = {
    cart: CartItem[];
    addToCart: (product: CartItem) => void;
    removeFromCart: (id: string) => void;
    clearCart: () => void;
    saveCartToDB: (userId: string, customerName: string, shippingAddress: string) => Promise<Order>;
    addToCartAndSave: (item: CartItem, userId: string, customerName: string, shippingAddress: string) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
const LOCAL_STORAGE_KEY = "cart";

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const router = useRouter();

    // Load cart from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
            try {
                setCart(JSON.parse(stored));
            } catch {
                localStorage.removeItem(LOCAL_STORAGE_KEY);
            }
        }
    }, []);

    // Sync cart to localStorage on change
    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cart));
    }, [cart]);

    const addToCart = (item: CartItem) => {
        setCart((prev) => {
            const existing = prev.find((p) => p.id === item.id);
            if (existing) {
                return prev.map((p) =>
                    p.id === item.id ? { ...p, quantity: p.quantity + item.quantity } : p
                );
            }
            return [...prev, item];
        });
    };

    const removeFromCart = (id: string) => {
        setCart((prev) => prev.filter((p) => p.id !== id));
    };

    const clearCart = () => {
        setCart([]);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
    };

    const saveCartToDB = async (
        userId: string,
        customerName: string,
        shippingAddress: string
    ): Promise<Order> => {
        const payload = {
            userId,
            customerName,
            shippingAddress,
            total: cart.reduce((sum, i) => sum + i.price * i.quantity, 0),
            status: "PENDING",
            items: cart.map((i) => ({
                productId: Number(i.id),
                quantity: i.quantity,
            })),
        };

        const response = await fetch(`${API_BASE}/api/orders`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("Backend error:", errorData);
            throw new Error(`Failed to save order: ${response.status}`);
        }

        const data: Order = await response.json();
        return data;
    };

    const addToCartAndSave = async (
        item: CartItem,
        userId: string,
        customerName: string,
        shippingAddress: string
    ) => {
        // ساخت cart جدید
        const newCart = (() => {
            const existing = cart.find((p) => p.id === item.id);
            if (existing) {
                return cart.map((p) =>
                    p.id === item.id ? { ...p, quantity: p.quantity + item.quantity } : p
                );
            }
            return [...cart, item];
        })();

        setCart(newCart);

        const payload = {
            userId,
            customerName,
            shippingAddress,
            total: newCart.reduce((sum, i) => sum + i.price * i.quantity, 0),
            status: "PENDING",
            items: newCart.map((i) => ({
                productId: Number(i.id),
                quantity: i.quantity,
            })),
        };

        try {
            const response = await fetch(`${API_BASE}/api/orders`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error("Backend error:", errorData);
                throw new Error(`Failed to save order: ${response.status}`);
            }

            const data: Order = await response.json();
            console.log("Order saved:", data);
            clearCart();
            router.push(`/cart/${data.id}`);
        } catch (err) {
            console.error("Failed to save order:", err);
        }
    };

    return (
        <CartContext.Provider
            value={{ cart, addToCart, removeFromCart, clearCart, saveCartToDB, addToCartAndSave }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used inside CartProvider");
    return context;
}