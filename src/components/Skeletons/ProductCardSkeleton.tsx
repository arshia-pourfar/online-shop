// components/skeletons/ProductCardSkeleton.tsx
import React from "react";

const ProductCardSkeleton = () => {
    return (
        <div className=" bg-secondary-bg animate-pulse rounded-xl shadow-md h-80 flex flex-col p-4 space-y-3">
            <div className="w-full h-32 bg-gray-700 rounded-md" />
            <div className="h-4 bg-gray-700 rounded w-2/3" />
            <div className="h-3 bg-gray-700 rounded w-5/6" />
            <div className="flex justify-between mt-auto ">
                <div className="h-5 bg-gray-700 rounded w-1/4" />
                <div className="h-8 bg-gray-700 rounded w-16" />
            </div>
        </div>
    );
};

export default ProductCardSkeleton;
