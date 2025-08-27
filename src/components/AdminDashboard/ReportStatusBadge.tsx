// components/ReportStatusBadge.js
import React from 'react';
import {
    faCheckCircle,
    faTimesCircle,
    faBan,
    faClock,
    faEyeSlash,
    faReply,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

// Defines the status prop
export type ReportStatus = "GENERATED" | "FAILED" | "IN_PROGRESS" | "BLOCKED" | "HIDDEN" | "ANSWERED";

// Map to configure badge colors and icons based on status
const STATUS_MAP: Record<
    ReportStatus,
    {
        bgColor: string;
        textColor: string;
        icon: IconDefinition;
    }
> = {
    GENERATED: {
        bgColor: "bg-[#00C853]", // status-positive
        textColor: "text-[#E0E0E0]", // primary-text
        icon: faCheckCircle,
    },
    FAILED: {
        bgColor: "bg-[#FF5252]", // status-negative
        textColor: "text-[#E0E0E0]",
        icon: faTimesCircle,
    },
    IN_PROGRESS: {
        bgColor: "bg-[#FFD600]", // status-neutral
        textColor: "text-[#1A1A2E]", // primary-bg for readability
        icon: faClock,
    },
    BLOCKED: {
        bgColor: "bg-[#757575]", // status-hidden
        textColor: "text-[#E0E0E0]",
        icon: faBan,
    },
    HIDDEN: {
        bgColor: "bg-[#757575]", // status-hidden
        textColor: "text-[#E0E0E0]",
        icon: faEyeSlash,
    },
    ANSWERED: {
        bgColor: "bg-[#6C63FF]", // accent
        textColor: "text-[#E0E0E0]",
        icon: faReply,
    },
};

/**
 * A reusable component to display a colored badge for a report's status.
 * @param {object} props - The component props.
 * @param {ReportStatus} props.status - The current status of the report.
 */
const ReportStatusBadge = ({ status }: { status: ReportStatus }) => {
    // Get the configuration from the STATUS_MAP
    const config = STATUS_MAP[status];

    // Handle unknown statuses gracefully
    if (!config) {
        return (
            <span
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize shadow-sm bg-gray-500 text-white"
            >
                {status.replace(/_/g, " ")}
            </span>
        );
    }

    return (
        <span
            className={`inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize shadow-sm ${config.bgColor} ${config.textColor}`}
        >
            <FontAwesomeIcon icon={config.icon} className="h-3 w-3" />
            {status.replace(/_/g, " ")}
        </span>
    );
};

export default ReportStatusBadge;
