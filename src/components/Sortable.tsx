export default function SortableTH({
    title,
    onClick,
    sortable,
    sortAsc,
    isActive,
    width,
}: {
    title: string;
    onClick: () => void;
    sortable: boolean;
    sortAsc?: boolean;
    isActive?: boolean;
    width?: string;
}) {
    return (
        <th
            className={`${width || "w-auto"} px-2 py-3 cursor-pointer select-none user-select-none`}
            onClick={sortable ? onClick : undefined}
            title={sortable ? "Click to sort" : undefined}
        >
            <div className="flex items-center gap-1 select-none">
                {title}
                {sortable && (
                    <span>
                        {isActive ? (
                            sortAsc ? (
                                <i className="fa fa-sort-up" />
                            ) : (
                                <i className="fa fa-sort-down" />
                            )
                        ) : (
                            <i className="fa fa-sort" />
                        )}
                    </span>
                )}
            </div>
        </th>
    );
}