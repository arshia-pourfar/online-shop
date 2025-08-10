"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faCartShopping, faFilter, faTimes } from "@fortawesome/free-solid-svg-icons";
import { getProducts } from "@/lib/api/products";
import { Product } from "../../types/product";
import Image from "next/image";
import ProductCardSkeleton from "@/components/Skeletons/Home/ProductCardSkeleton";
import { getCategories } from "@/lib/api/categories";
import { Category } from "../../types/category";
import { useSearchParams, useRouter } from "next/navigation";

const ShopClient = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const categoryFromUrl = searchParams.get("category");

    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [filterMinPrice, setFilterMinPrice] = useState<number | "">("");
    const [filterMaxPrice, setFilterMaxPrice] = useState<number | "">("");

    // وقتی URL تغییر کرد، selectedCategory رو آپدیت کن
    useEffect(() => {
        if (categoryFromUrl) {
            setSelectedCategory(categoryFromUrl);
            setIsSidebarOpen(true); // اگر خواستی فیلتر باز باشه
        } else {
            setSelectedCategory(null);
        }
    }, [categoryFromUrl]);

    // بارگذاری محصولات و دسته‌ها
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsData, categoriesData] = await Promise.all([
                    getProducts(),
                    getCategories(),
                ]);
                setProducts(productsData);
                setCategories(categoriesData);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // تغییر دسته‌بندی (از سایدبار یا هر جای دیگه)
    const handleCategoryChange = (categoryId: string | null) => {
        setSelectedCategory(categoryId);

        // بروزرسانی URL بدون رفرش صفحه
        const query = new URLSearchParams(window.location.search);
        if (categoryId) {
            query.set("category", categoryId);
        } else {
            query.delete("category");
        }

        // به آدرس shop با پارامتر جدید برو
        router.push(`/shop?${query.toString()}`, { scroll: false });
    };

    // شمارش تعداد محصولات هر دسته
    const categoryCounts = categories.reduce<Record<number, number>>((acc, category) => {
        acc[category.id] = products.filter(
            (p) => typeof p.category !== "string" && p.category.id === category.id
        ).length;
        return acc;
    }, {});

    // فیلتر محصولات بر اساس دسته، جستجو و قیمت
    const filteredProducts = products.filter((product) => {
        const matchesCategory =
            selectedCategory === null ||
            (typeof product.category !== "string" &&
                product.category.id === Number(selectedCategory));
        const matchesSearchTerm = product.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchMinPrice = filterMinPrice === "" || product.price >= filterMinPrice;
        const matchMaxPrice = filterMaxPrice === "" || product.price <= filterMaxPrice;

        return matchesCategory && matchesSearchTerm && matchMinPrice && matchMaxPrice;
    });

    return (
        <div className="min-h-screen w-full bg-primary-bg text-primary-text">
            <Header />
            <main className="p-4 md:p-8 space-y-12">
                {/* Shop Header and Controls */}
                <section className="flex lg:items-center justify-between gap-6 lg:flex-row flex-col">
                    <h1 className="text-4xl font-bold text-blue-400">Shop All Products</h1>

                    <div className="flex items-center gap-4 w-full lg:flex-row flex-row-reverse  md:w-2/3 lg:w-1/2">
                        {/* دکمه باز/بسته کردن فیلترها فقط زیر xl */}
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="xl:hidden bg-accent text-white p-3 rounded-full shadow hover:bg-blue-600 transition"
                            aria-label="Toggle Filters"
                            title="Filters"
                        >
                            <FontAwesomeIcon icon={faFilter} />
                        </button>

                        <div className="relative flex-grow">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-600 bg-secondary-bg text-primary-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                            />
                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 pointer-events-none">
                                <FontAwesomeIcon icon={faSearch} />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Main Shop Content */}
                <section className="grid grid-cols-1 xl:grid-cols-5 gap-6">
                    {/* Sidebar */}
                    <aside
                        className={`xl:col-span-1 w-full max-w-xs xl:max-w-full xl:static fixed top-0 right-0 max-h-screen h-full bg-secondary-bg p-6 xl:rounded-xl rounded-s-xl shadow-lg border border-gray-700 transition-transform duration-300 ease-in-out md:z-10 z-50
                                    ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}
                                    xl:translate-x-0
                                    overflow-y-auto
                                    scrollbar-thin scrollbar-thumb-accent scrollbar-track-secondary-bg
                                `}
                    >
                        <div className="w-full space-y-8">
                            {/* دکمه بستن سایدبار در موبایل */}
                            <div className="flex justify-between items-center border-b-2 pb-5 mb-5 xl:mb-0 xl:hidden">
                                <h3 className="text-xl font-bold text-blue-400">Filters</h3>
                                <button
                                    onClick={() => setIsSidebarOpen(false)}
                                    className="text-2xl font-bold text-primary-text"
                                    aria-label="Close Filters"
                                >
                                    <FontAwesomeIcon
                                        icon={faTimes}
                                        className="text-xl cursor-pointer"
                                    />
                                </button>
                            </div>

                            {/* Price Range Filter */}
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold border-b border-gray-600 pb-3 text-blue-400">
                                    Price Range
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm font-semibold text-gray-400 w-7">Min:</span>
                                        <input
                                            type="number"
                                            min={0}
                                            placeholder="0"
                                            value={filterMinPrice}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                setFilterMinPrice(val === "" ? "" : Number(val));
                                            }}
                                            className="w-full py-2 px-3 rounded-lg bg-gray-700 border border-gray-600 text-primary-text focus:outline-none focus:ring-2 focus:ring-accent"
                                        />
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm font-semibold text-gray-400 w-7">Max:</span>
                                        <input
                                            type="number"
                                            min={0}
                                            placeholder="0"
                                            value={filterMaxPrice}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                setFilterMaxPrice(val === "" ? "" : Number(val));
                                            }}
                                            className="w-full py-2 px-3 rounded-lg bg-gray-700 border border-gray-600 text-primary-text focus:outline-none focus:ring-2 focus:ring-accent"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {/* Categories Filter */}
                                <div>
                                    <h3 className="text-xl font-bold mb-4 border-b border-gray-600 pb-3 text-blue-400">
                                        Categories
                                    </h3>
                                    <ul className="space-y-2">
                                        <li key="all-products">
                                            <button
                                                onClick={() => handleCategoryChange(null)}
                                                className={`w-full flex justify-between items-center text-left px-3 py-2 rounded-md transition-colors ${selectedCategory === null
                                                    ? "bg-gray-700 text-white"
                                                    : "text-primary-text hover:text-accent hover:bg-gray-700"
                                                    }`}
                                            >
                                                <span>All Products</span>
                                                <span className="text-gray-400 text-sm font-semibold">{products.length}</span>
                                            </button>
                                        </li>
                                        {isLoading
                                            ? Array.from({ length: 8 }).map((_, i) => (
                                                <li key={i} className="animate-pulse h-6 bg-gray-700 rounded"></li>
                                            ))
                                            : categories.map((category) => (
                                                <li key={category.id}>
                                                    <button
                                                        onClick={() => handleCategoryChange(String(category.id))}
                                                        className={`w-full flex justify-between items-center text-left px-3 py-2 rounded-md transition-colors ${selectedCategory === String(category.id)
                                                            ? "bg-gray-700 text-white"
                                                            : "text-primary-text hover:text-accent hover:bg-gray-700"
                                                            }`}
                                                    >
                                                        <span>{category.name}</span>
                                                        <span className="text-gray-400 text-sm font-semibold">
                                                            {categoryCounts[category.id] ?? 0}
                                                        </span>
                                                    </button>
                                                </li>
                                            ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <div className="xl:col-span-4">
                        {isLoading ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                                {Array.from({ length: 12 }).map((_, i) => (
                                    <ProductCardSkeleton key={i} />
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                                {filteredProducts.length > 0 ? (
                                    filteredProducts.map((product) => (
                                        <div
                                            key={product.id}
                                            className="bg-secondary-bg rounded-xl shadow-md p-4 space-y-4 flex flex-col h-full hover:shadow-xl hover:scale-105 transition-all duration-300"
                                        >
                                            <div className="w-full h-40 relative">
                                                <Image
                                                    src={`/products/${product.imageUrl}`}
                                                    alt={product.name}
                                                    fill
                                                    className="object-contain"
                                                />
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                <h3 className="text-lg font-semibold truncate">{product.name}</h3>
                                                <p className="text-sm text-gray-400 line-clamp-2">{product.description}</p>
                                            </div>
                                            <div className="flex justify-between items-center pt-2">
                                                <span className="text-base font-bold text-blue-400">${product.price}</span>
                                                <button className="bg-accent text-white font-medium flex items-center gap-2 py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors shadow-md">
                                                    <FontAwesomeIcon icon={faCartShopping} />
                                                    <span>Add</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex justify-center items-center h-full py-20">
                                        <p className="text-xl text-gray-400">No products found matching your filters.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default ShopClient;
