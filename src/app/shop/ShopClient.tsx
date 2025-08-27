"use client";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductsCard/ProductCard";
import ProductCardSkeleton from "@/components/Skeletons/Home/ProductCardSkeleton";
import Pagination from "@/components/Pagination";
import { getProducts } from "@/lib/api/products";
import { getCategories } from "@/lib/api/categories";
import type { Product } from "../../types/product";
import type { Category } from "../../types/category";

const ShopClient = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const categoryFromUrl = searchParams.get("category");
    const pageFromUrl = Number(searchParams.get("page") || "1");

    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [filterMinPrice, setFilterMinPrice] = useState<number | "">("");
    const [filterMaxPrice, setFilterMaxPrice] = useState<number | "">("");
    const [currentPage, setCurrentPage] = useState(pageFromUrl);
    const itemsPerPage = 15;

    // همگام‌سازی دسته‌بندی با URL
    useEffect(() => {
        if (categoryFromUrl) {
            setSelectedCategory(categoryFromUrl);
            setIsSidebarOpen(true);
        } else {
            setSelectedCategory(null);
        }
    }, [categoryFromUrl]);

    // همگام‌سازی صفحه با URL
    useEffect(() => {
        setCurrentPage(pageFromUrl);
    }, [pageFromUrl]);

    // بارگذاری داده‌ها
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

    // ریست صفحه هنگام تغییر فیلتر
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory, filterMinPrice, filterMaxPrice, searchTerm]);

    // اسکرول به بالا هنگام تغییر صفحه
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [currentPage]);

    // تغییر دسته‌بندی
    const handleCategoryChange = (categoryId: string | null) => {
        setSelectedCategory(categoryId);
        const query = new URLSearchParams(window.location.search);
        if (categoryId) {
            query.set("category", categoryId);
        } else {
            query.delete("category");
        }
        query.delete("page"); // ریست صفحه
        router.push(`/shop?${query.toString()}`, { scroll: false });
    };

    // تغییر صفحه
    const goToPage = (page: number) => {
        if (page < 1 || page > pageCount) return;
        setCurrentPage(page);
        const query = new URLSearchParams(window.location.search);
        query.set("page", String(page));
        router.push(`/shop?${query.toString()}`, { scroll: false });
    };

    // شمارش محصولات هر دسته
    const categoryCounts = useMemo(() => {
        return categories.reduce<Record<number, number>>((acc, category) => {
            acc[category.id] = products.filter(
                (p) => typeof p.category !== "string" && p.category.id === category.id
            ).length;
            return acc;
        }, {});
    }, [products, categories]);

    // فیلتر محصولات
    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const matchesCategory =
                selectedCategory === null ||
                (typeof product.category !== "string" &&
                    product.category.id === Number(selectedCategory));
            const matchesSearchTerm = product.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
            const matchMinPrice =
                filterMinPrice === "" || product.price >= filterMinPrice;
            const matchMaxPrice =
                filterMaxPrice === "" || product.price <= filterMaxPrice;
            return matchesCategory && matchesSearchTerm && matchMinPrice && matchMaxPrice;
        });
    }, [products, selectedCategory, searchTerm, filterMinPrice, filterMaxPrice]);

    const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);
    const paginatedProducts = useMemo(() => {
        return filteredProducts.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
        );
    }, [filteredProducts, currentPage]);

    return (
        <div className="min-h-screen w-full bg-primary-bg text-primary-text">
            <Header />
            <main className="p-4 md:p-8 space-y-12">
                {/* Header و کنترل‌ها */}
                <section className="flex lg:items-center justify-between gap-6 lg:flex-row flex-col">
                    <h1 className="text-4xl font-bold text-accent">Shop All Products</h1>
                    <div className="flex items-center gap-4 w-full lg:flex-row flex-row-reverse md:w-2/3 lg:w-1/2">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="xl:hidden bg-accent text-white p-3 rounded-full shadow hover:bg-accent-alt transition"
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
                                className="w-full pl-12 pr-4 py-3 rounded-full border border-secondary-text bg-secondary-bg text-primary-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                            />
                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-secondary-text pointer-events-none">
                                <FontAwesomeIcon icon={faSearch} />
                            </div>
                        </div>
                    </div>
                </section>

                {/* محتوای اصلی فروشگاه */}
                <section className="grid grid-cols-1 xl:grid-cols-5 gap-6">
                    {/* Sidebar */}
                    <aside
                        className={`xl:col-span-1 w-full max-w-xs xl:max-w-full xl:static fixed top-0 right-0 max-h-screen h-full bg-secondary-bg p-6 xl:rounded-xl rounded-s-xl shadow-lg border border-secondary-text transition-transform duration-300 ease-in-out md:z-10 z-50
              ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}
              xl:translate-x-0
              xl:overflow-hidden overflow-y-auto
              scrollbar-thin scrollbar-thumb-accent scrollbar-track-secondary-bg`}
                    >
                        <div className="w-full">
                            <div className="flex justify-between items-center border-b-2 pb-5 mb-5 xl:mb-0 xl:hidden">
                                <h3 className="text-xl font-bold text-accent-alt">Filters</h3>
                                <button
                                    onClick={() => setIsSidebarOpen(false)}
                                    className="text-2xl font-bold text-primary-text"
                                    aria-label="Close Filters"
                                >
                                    <FontAwesomeIcon icon={faTimes} className="text-xl cursor-pointer" />
                                </button>
                            </div>

                            {/* Price Filter */}
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold border-b border-secondary-text pb-3 text-accent-alt">
                                    Price Range
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm font-semibold text-secondary-text w-7">Min:</span>
                                        <input
                                            type="number"
                                            min={0}
                                            placeholder="0"
                                            value={filterMinPrice}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                setFilterMinPrice(val === "" ? "" : Number(val));
                                            }}
                                            className="w-full py-2 px-3 rounded-lg bg-primary-bg border border-secondary-text text-primary-text focus:outline-none focus:ring-2 focus:ring-accent"
                                        />
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm font-semibold text-secondary-text w-7">Max</span>
                                        <input
                                            type="number"
                                            min={0}
                                            placeholder="0"
                                            value={filterMaxPrice}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                setFilterMaxPrice(val === "" ? "" : Number(val));
                                            }}
                                            className="w-full py-2 px-3 rounded-lg bg-primary-bg border border-secondary-text text-primary-text focus:outline-none focus:ring-2 focus:ring-accent"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Category Filter */}
                            <div className="space-y-6 mt-6">
                                <div>
                                    <h3 className="text-xl font-bold mb-4 border-b border-secondary-text pb-3 text-accent-alt">
                                        Categories
                                    </h3>
                                    <ul className="space-y-2">
                                        <li key="all-products">
                                            <button
                                                onClick={() => handleCategoryChange(null)}
                                                className={`w-full flex justify-between items-center text-left px-3 py-2 rounded-md transition-colors ${selectedCategory === null
                                                    ? "bg-primary-text text-secondary-bg font-semibold"
                                                    : "text-primary-text hover:text-secondary-bg hover:bg-secondary-text"
                                                    }`}
                                            >
                                                <span>All Products</span>
                                                <span className="text-sm">{products.length}</span>
                                            </button>
                                        </li>
                                        {isLoading
                                            ? Array.from({ length: 8 }).map((_, i) => (
                                                <li key={i} className="animate-pulse h-6 bg-secondary-text rounded"></li>
                                            ))
                                            : categories.map((category) => (
                                                <li key={category.id}>
                                                    <button
                                                        onClick={() => handleCategoryChange(String(category.id))}
                                                        className={`w-full flex justify-between items-center text-left px-3 py-2 rounded-md transition-colors ${selectedCategory === String(category.id)
                                                            ? "bg-primary-text text-secondary-bg font-semibold"
                                                            : "text-primary-text hover:text-secondary-bg hover:bg-secondary-text"
                                                            }`}
                                                    >
                                                        <span>{category.name}</span>
                                                        <span className="text-sm font-semibold">
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
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-4">
                                {filteredProducts.length > 0 ? (
                                    paginatedProducts.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))
                                ) : (
                                    <div className="flex justify-center items-center h-full py-20 col-span-full">
                                        <p className="text-xl text-secondary-text">
                                            No products found matching your filters.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Pagination */}
                        {filteredProducts.length > 0 && (
                            <Pagination
                                currentPage={currentPage}
                                pageCount={pageCount}
                                onPageChange={goToPage}
                            />
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default ShopClient;