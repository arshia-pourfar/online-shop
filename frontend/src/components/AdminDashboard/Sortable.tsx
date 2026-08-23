import { faSort, faSortDown, faSortUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface SortableTHProps {
    title: string;
    onClick: () => void;
    sortable: boolean;
    sortAsc?: boolean;
    isActive?: boolean;
    width?: string;
}

export default function SortableTH({
    title,
    onClick,
    sortable,
    sortAsc,
    isActive,
    width,
}: SortableTHProps) {
    return (
        <th
            className={`${width || "w-auto"} px-2 py-3 cursor-pointer select-none user-select-none`}
            onClick={sortable ? onClick : undefined}
            title={sortable ? "Click to sort" : undefined}
        >
            <div className="flex items-center gap-1 select-none text-accent">
                {title}
                {sortable && (
                    <span>
                        {isActive ? (
                            sortAsc ? (
                                <FontAwesomeIcon icon={faSortUp} />
                            ) : (
                                <FontAwesomeIcon icon={faSortDown} />
                            )
                        ) : (
                            <FontAwesomeIcon icon={faSort} />
                        )}
                    </span>
                )}
            </div>
        </th>
    );
}