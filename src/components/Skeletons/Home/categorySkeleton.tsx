// components/skeletons/ProductCardSkeleton.tsx
import React from "react";

const CategorySkeleton = () => {
    return (
        <>
            <div className="group flex flex-col items-center justify-center bg-secondary-bg animate-pulse rounded-xl shadow-md p-4 hover:shadow-lg transition hover:scale-105"  >
                <div className="relative size-24 mb-3 bg-gray-700 rounded-full"></div>
                <div className="font-semibold w-2/3 h-6 text-center bg-gray-700 rounded-md"></div>
            </div>
            {/*  <div className=" bg-secondary-bg animate-pulse rounded-xl shadow-md h-80 flex flex-col p-4 space-y-3">
             <div className="w-full h-32 bg-gray-700 rounded-md" />
             <div className="h-4 bg-gray-700 rounded w-2/3" />
             <div className="h-3 bg-gray-700 rounded w-5/6" />
             <div className="flex justify-between mt-auto ">
                 <div className="h-5 bg-gray-700 rounded w-1/4" />
                 <div className="h-8 bg-gray-700 rounded w-16" />
             </div>
             <div
                 className="bg-secondary-bg h-32 rounded-xl animate-pulse"
             ></div>
         </div > */}
        </>
    );
};

export default CategorySkeleton;
