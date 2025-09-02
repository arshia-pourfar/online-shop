"use client";

import Image from "next/image";
import { Product } from "../../types/product";
import AddToCartButton from "./AddToCartButton";

export default function ProductCard({ product }: { product: Product }) {
    return (
        <div className="bg-secondary-bg rounded-lg shadow-md hover:shadow-lg hover:scale-[1.01] transition-transform duration-300 flex flex-col p-3 space-y-6 h-[350px] sm:h-80">

            {/* تصویر محصول */}
            <a href={`./products/${product.id}`} className="relative w-full h-32 md:h-36">
                <Image
                    src={`/products/${product.imageUrl}`}
                    alt={product.name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority
                />
            </a>

            {/* اطلاعات محصول */}
            <a href={`./products/${product.id}`} className="flex-1 space-y-2">
                <h3 className="text-base sm:text-lg font-semibold text-primary-text truncate">
                    {product.name}
                </h3>
                <p className="text-xs sm:text-sm text-secondary-text line-clamp-2">
                    {product.description}
                </p>
            </a>

            {/* قیمت و دکمه افزودن به سبد */}
            <div className="flex lg:flex-row flex-col gap-4 justify-between items-center">
                <span className="text-xl font-bold text-accent">
                    ${product.price.toFixed(2)}
                </span>
                <AddToCartButton product={product} />
            </div>
        </div>
    );
}