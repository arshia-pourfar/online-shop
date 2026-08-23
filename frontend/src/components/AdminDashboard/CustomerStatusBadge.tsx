import {
    faCheckCircle,
    faTimesCircle,
    faBan,
    faClock,
    faEyeSlash,
    faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

const STATUS_MAP: Record<
    string,
    {
        bgColor: string;
        textColor: string;
        icon: IconDefinition;
    }
> = {
    active: {
        bgColor: "#00C853",       // status-positive
        textColor: "#E0E0E0",     // primary-text (روشن برای متن)
        icon: faCheckCircle,
    },
    admin: {
        bgColor: "#6C63FF",       // accent
        textColor: "#E0E0E0",     // primary-text
        icon: faCheckCircle,
    },
    inactive: {
        bgColor: "#FF5252",       // status-negative
        textColor: "#E0E0E0",
        icon: faTimesCircle,
    },
    pending: {
        bgColor: "#FFD600",       // status-neutral
        textColor: "#1A1A2E",     // primary-bg (برای خوانایی)
        icon: faBan,
    },
    suspended: {
        bgColor: "#6C63FF",       // accent
        textColor: "#E0E0E0",
        icon: faClock,
    },
    user: {
        bgColor: "#757575",       // status-hidden
        textColor: "#E0E0E0",
        icon: faEyeSlash,
    },
};

export default function CustomerStatusBadge({ status }: { status: string }) {
    const normalizedStatus = status.toLowerCase();
    const config = STATUS_MAP[normalizedStatus] || {
        bgColor: "#24263B",        // secondary-bg
        textColor: "#A0A0A0",      // secondary-text
        icon: faQuestionCircle,
    };

    return (
        <span
            style={{
                backgroundColor: config.bgColor,
                color: config.textColor,
            }}
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium select-none"
        >
            <FontAwesomeIcon icon={config.icon} className="w-3.5 h-3.5" />
            <span className="capitalize">{status}</span>
        </span>
    );
}
