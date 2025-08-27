import {
    faCheckCircle,
    faTimesCircle,
    faBan,
    faClock,
    faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

const STATUS_MAP: Record<
    string,
    {
        bgColor: string;
        textColor: string;
        icon: IconDefinition | null;
    }
> = {
    available: {
        bgColor: "#00C853", // status-positive
        textColor: "#E0E0E0", // primary-text
        icon: faCheckCircle,
    },
    out_of_stock: {
        bgColor: "#FF5252", // status-negative
        textColor: "#E0E0E0",
        icon: faTimesCircle,
    },
    discontinued: {
        bgColor: "#FFD600", // status-neutral
        textColor: "#1A1A2E", // primary-bg برای خوانایی
        icon: faBan,
    },
    pending: {
        bgColor: "#FFD600", // status-neutral
        textColor: "#1A1A2E",
        icon: faBan,
    },
    coming_soon: {
        bgColor: "#6C63FF", // accent
        textColor: "#E0E0E0",
        icon: faClock,
    },
    suspended: {
        bgColor: "#6C63FF", // accent
        textColor: "#E0E0E0",
        icon: faClock,
    },
    hidden: {
        bgColor: "#757575", // status-hidden
        textColor: "#E0E0E0",
        icon: faEyeSlash,
    },
    user: {
        bgColor: "#757575", // status-hidden
        textColor: "#E0E0E0",
        icon: faEyeSlash,
    },
};

export default function ProductStatusBadge({ status }: { status: string }) {
    const s = status.toLowerCase();
    const config = STATUS_MAP[s] || {
        bgColor: "#999999",
        textColor: "#000000",
        icon: null,
    };

    return (
        <span
            style={{
                backgroundColor: config.bgColor,
                color: config.textColor,
            }}
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold select-none"
        >
            {config.icon && <FontAwesomeIcon icon={config.icon} className="w-3.5 h-3.5" />}
            <span className="capitalize">{status.replace(/_/g, " ")}</span>
        </span>
    );
}
