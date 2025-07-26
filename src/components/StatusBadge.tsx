import {
    faCheckCircle,
    faTimesCircle,
    faBan,
    faClock,
    faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
export default function StatusBadge({ status }: { status: string }) {
    const s = status.toLowerCase();

    let bgColor = "";
    let textColor = "text-white";
    let icon = null;

    if (s === "available") {
        bgColor = "bg-status-positive";
        icon = <FontAwesomeIcon icon={faCheckCircle} />;
    } else if (s === "out_of_stock") {
        bgColor = "bg-status-negative";
        icon = <FontAwesomeIcon icon={faTimesCircle} />;
    } else if (s === "discontinued") {
        bgColor = "bg-status-neutral";
        icon = <FontAwesomeIcon icon={faBan} />;
    } else if (s === "coming_soon") {
        bgColor = "bg-accent";
        icon = <FontAwesomeIcon icon={faClock} />;
    } else if (s === "hidden") {
        bgColor = "bg-status-hidden";
        icon = <FontAwesomeIcon icon={faEyeSlash} />;
    } else {
        // حالت پیش فرض
        bgColor = "bg-gray-400";
        icon = null;
        textColor = "text-black";
    }

    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${bgColor} ${textColor}`}
        >
            {icon}
            {status}
        </span>
    );
};