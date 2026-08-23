"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import Header from "@/components/Header";
import { useAuth } from "@/lib/context/authContext";
import { getFavoritesByUser } from "@/lib/api/favorite";
import { Favorite } from "../../types/favorite";
import ProductCard from "@/components/ProductsCard/ProductCard";

export default function FavoritesPage() {
    const { user } = useAuth();
    const [favorites, setFavorites] = useState<Favorite[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFavorites = async () => {
            if (!user?.id) return;
            try {
                const data = await getFavoritesByUser(user.id);
                setFavorites(data);
            } catch (err) {
                console.error("خطا در دریافت علاقه‌مندی‌ها:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, [user]);

    return (
        <div className="min-h-screen w-full bg-primary-bg text-primary-text">
            <Header />

            <main className="p-4 md:p-8 space-y-8">
                <h1 className="text-4xl font-bold text-accent">Favorites</h1>

                {loading ? (
                    <div className="flex justify-center items-center py-20 text-accent">
                        <FontAwesomeIcon icon={faSpinner} spin className="text-4xl" />
                        <span className="ml-3 text-lg">Loading your favorites...</span>
                    </div>
                ) : favorites.length === 0 ? (
                    <div className="text-center text-secondary-text py-20">
                        You haven’t added any favorites yet.
                    </div>
                ) : (
                    <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 md:gap-6 gap-4">
                        {favorites.map((fav) => (
                            // <div  className="basis-1/4 p-3">
                            <ProductCard product={fav.product} key={fav.id} />
                            // </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}