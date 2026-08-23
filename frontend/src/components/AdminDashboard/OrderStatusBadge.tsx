// OrderStatusBadge.tsx
"use client";
import { faHourglassHalf, faTruck, faBoxOpen, faCheckCircle, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

const ORDER_STATUS_MAP: Record<string, { bgVar: string; textVar: string; icon: IconDefinition | null }> = {
    pending: { bgVar: "bg-status-neutral", textVar: "text-primary-bg", icon: faHourglassHalf },
    processing: { bgVar: "bg-accent", textVar: "text-primary-bg", icon: faTruck },
    shipped: { bgVar: "bg-accent-alt", textVar: "text-primary-bg", icon: faBoxOpen },
    delivered: { bgVar: "bg-status-positive", textVar: "text-primary-bg", icon: faCheckCircle },
    cancelled: { bgVar: "bg-status-negative", textVar: "text-primary-bg", icon: faTimesCircle },
};

export default function OrderStatusBadge({ status }: { status: string }) {
    const s = status.toLowerCase();
    const config = ORDER_STATUS_MAP[s] || { bgVar: "bg-secondary-text", textVar: "text-primary-text", icon: null };

    return (
        <span
            className={`${config.textVar} ${config.bgVar} inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold select-none`}
        >
            {config.icon && <FontAwesomeIcon icon={config.icon} className="w-3.5 h-3.5" />}
            <span className="capitalize">{status.replace(/_/g, " ")}</span>
        </span>
    );
}
