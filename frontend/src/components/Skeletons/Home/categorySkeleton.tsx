// components/skeletons/CategorySkeleton.tsx
import React from "react";

interface CategorySkeletonProps {
  className?: string;
}

const CategorySkeleton: React.FC<CategorySkeletonProps> = ({ className = "" }) => {
  return (
    <div
      className={`${className} group flex flex-col items-center justify-center bg-secondary-bg animate-pulse rounded-xl shadow-md p-4 hover:shadow-lg transition hover:scale-105 min-w-[150px]`}
    >
      <div className="relative size-24 mb-3 bg-gray-700 rounded-full"></div>
      <div className="font-semibold w-2/3 h-6 text-center bg-gray-700 rounded-md"></div>
    </div>
  );
};

export default CategorySkeleton;
