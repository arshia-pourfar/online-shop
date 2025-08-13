"use client";

import Image from "next/image";
import { Product } from "../types/product";
import AddToCartButton from "./AddToCartButton";

export default function ProductCard({ product }: { product: Product }) {

    return (
        <div className="bg-secondary-bg rounded-xl h-72 md:h-80 shadow-md flex flex-col px-2 py-4 space-y-8 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="w-full md:h-32 h-32 relative">
                <Image
                    src={`/products/${product.imageUrl}`}
                    alt={product.name}
                    fill
                    className="object-contain"
                />
            </div>

            <div className="flex-1 space-y-1">
                <h3 className="text-base sm:text-lg font-semibold truncate">
                    {product.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-400 line-clamp-1 md:line-clamp-2">
                    {product.description}
                </p>
            </div>

            <div className="flex justify-between items-center md:px-1">
                <span className="text-sm sm:text-base font-bold text-blue-400">
                    $ {product.price}
                </span>
                <AddToCartButton product={product} />
            </div>
        </div>
    );
}