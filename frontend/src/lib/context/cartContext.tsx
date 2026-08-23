// lib/context/cartContext.tsx
"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { CartItem } from "types/order";
import { useAuth } from "./authContext";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

type CartContextType = {
    cartItems: CartItem[];
    setCartItems: (items: CartItem[]) => void;
    refreshCart: () => Promise<void>;
    globalLoading: boolean;
    setGlobalLoading: (loading: boolean) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [globalLoading, setGlobalLoading] = useState(false);

    const refreshCart = useCallback(async () => {
        if (!user) return;
        try {
            const res = await fetch(`${API_BASE}/api/orders/user/${user.id}?status=PENDING`);
            const order = await res.json();
            if (order?.items) setCartItems(order.items);
        } catch (err) {
            console.error("خطا در گرفتن سبد خرید:", err);
        }
    }, [user]);

    useEffect(() => {
        refreshCart();
    }, [refreshCart]);

    return (
        <CartContext.Provider value={{ cartItems, setCartItems, refreshCart, globalLoading, setGlobalLoading }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart باید داخل CartProvider استفاده شود");
    return context;
};
