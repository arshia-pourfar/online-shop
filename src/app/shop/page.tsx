"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { getProducts } from "@/lib/api/products";
import { Product } from "../../types/product";
import Image from "next/image";
import ProductCardSkeleton from "@/components/Skeletons/Home/ProductCardSkeleton";
import { getCategories } from "@/lib/api/categories";
import { Category } from "../../types/category";

const Shop = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [filterMinPrice, setFilterMinPrice] = useState<number | "">("");
    const [filterMaxPrice, setFilterMaxPrice] = useState<number | "">("");

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

    const handleCategoryChange = (categoryId: string | null) => {
        setSelectedCategory(categoryId);
    };

    const filteredProducts = products.filter((product) => {
        const matchesCategory =
            selectedCategory === null ||
            (typeof product.category !== 'string' &&
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
                <section className="flex items-center justify-between gap-6">
                    <h1 className="text-4xl font-bold text-blue-400">Shop All Products</h1>
                    <div className="flex items-stretch basis-1/2 gap-4 w-full sm:w-auto">
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
                        {/* <button
                            className="flex items-center justify-center gap-2 bg-secondary-bg text-primary-text py-3 px-6 rounded-full shadow border border-gray-600 hover:bg-gray-700 transition-colors"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        >
                            <FontAwesomeIcon icon={faSliders} />
                            <span className="font-semibold hidden sm:inline">Filters</span>
                        </button> */}
                    </div>
                </section>

                {/* Main Shop Content */}
                <section className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Sidebar */}
                    <aside
                        className={`fixed inset-y-0 right-0 w-64 p-6 transform transition-transform duration-300 ease-in-out lg:static lg:block lg:transform-none lg:bg-transparent lg:p-0 lg:col-span-1 ${isSidebarOpen ? "translate-x-0" : "translate-x-full"
                            }`}
                    >
                        <div className="w-full space-y-8 lg:bg-secondary-bg lg:rounded-xl lg:shadow-lg lg:border lg:border-gray-700 lg:p-6">
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

                            <div className="flex justify-between items-center mb-4 lg:hidden">
                                <h3 className="text-xl font-bold text-blue-400">Filters</h3>
                                <button
                                    onClick={() => setIsSidebarOpen(false)}
                                    className="text-2xl font-bold text-primary-text"
                                >
                                    &times;
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Categories Filter */}
                                <div>
                                    <h3 className="text-xl font-bold mb-4 border-b border-gray-600 pb-3 text-blue-400">
                                        Categories
                                    </h3>
                                    <ul className="space-y-2">
                                        <li key="all-products">
                                            <a
                                                href="#"
                                                onClick={() => handleCategoryChange(null)}
                                                className={`text-primary-text hover:text-accent transition-colors block px-2 py-1 rounded-md ${selectedCategory === null && "bg-gray-700"
                                                    }`}
                                            >
                                                All Products
                                            </a>
                                        </li>
                                        {isLoading ? (
                                            Array.from({ length: 8 }).map((_, i) => (
                                                <li
                                                    key={i}
                                                    className="animate-pulse h-6 bg-gray-700 rounded"
                                                ></li>
                                            ))
                                        ) : (
                                            categories.map((category) => (
                                                <li key={category.id}>
                                                    <a
                                                        href="#"
                                                        onClick={() => handleCategoryChange(String(category.id))}
                                                        className={`text-primary-text hover:text-accent transition-colors block px-2 py-1 rounded-md ${selectedCategory === String(category.id) && "bg-gray-700"}`}
                                                    >
                                                        {category.name}
                                                    </a>
                                                </li>
                                            ))
                                        )}
                                    </ul>
                                </div>


                            </div>
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <div className="lg:col-span-4">
                        {isLoading ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                                {Array.from({ length: 12 }).map((_, i) => (
                                    <ProductCardSkeleton key={i} />
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
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
                                                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                                                />
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                <h3 className="text-lg font-semibold truncate">
                                                    {product.name}
                                                </h3>
                                                <p className="text-sm text-gray-400 line-clamp-2">
                                                    {product.description}
                                                </p>
                                            </div>
                                            <div className="flex justify-between items-center pt-2">
                                                <span className="text-base font-bold text-blue-400">
                                                    $ {product.price}
                                                </span>
                                                <button className="bg-accent text-white font-medium flex items-center gap-2 py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors shadow-md">
                                                    <FontAwesomeIcon icon={faCartShopping} />
                                                    <span>Add</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="lg:col-span-4 flex justify-center items-center h-full">
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

export default Shop;