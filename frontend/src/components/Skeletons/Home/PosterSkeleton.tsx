import React from "react";

const PosterSkeleton = () => {
    return (
        <div className="w-full h-full bg-secondary-bg animate-pulse rounded-2xl overflow-hidden">
            <div className="w-full h-full bg-gray-700" />
        </div>
    );
};

export default PosterSkeleton;
