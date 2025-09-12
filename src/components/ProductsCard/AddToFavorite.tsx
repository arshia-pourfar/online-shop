"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import { useAuth } from "@/lib/context/authContext";
import {
    getFavoritesByUser,
    addFavorite,
    removeFavorite,
} from "@/lib/api/favorite";

type Props = {
    productId: number;
    size?: string;
};

export default function AddToFavorite({ productId, size = "text-xl" }: Props) {
    const { user } = useAuth();
    const [isFavorite, setIsFavorite] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const checkFavorite = async () => {
            if (!user) return;
            try {
                const favorites = await getFavoritesByUser(user.id);
                const found = favorites.find((fav) => fav.productId === productId);
                setIsFavorite(!!found);
            } catch (err) {
                console.error("[AddToFavorite] خطا در دریافت علاقه‌مندی‌ها:", err);
            }
        };

        checkFavorite();
    }, [user, productId]);

    const toggleFavorite = async () => {
        if (!user || loading) return;
        setLoading(true);

        try {
            if (isFavorite) {
                await removeFavorite(user.id, productId);
                setIsFavorite(false);
            } else {
                await addFavorite(user.id, productId);
                setIsFavorite(true);
            }
        } catch (err) {
            console.error("[AddToFavorite] خطا در تغییر علاقه‌مندی:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={toggleFavorite}
            disabled={loading}
            className={`transition-all duration-300 ${loading ? "opacity-50" : "hover:text-accent"} text-accent cursor-pointer`}
            aria-label="افزودن به علاقه‌مندی‌ها"
        >
            <FontAwesomeIcon icon={isFavorite ? solidHeart : regularHeart} className={size} />
        </button>
    );
}