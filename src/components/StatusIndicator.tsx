// components/common/StatusIndicator.tsx
"use client";
import { Icon } from "@iconify/react";

type StatusIndicatorProps = {
    borrowStatus?: string;
    isAvailable?: number;
};

const StatusIndicator: React.FC<StatusIndicatorProps> = ({
    isAvailable,
    borrowStatus,
}) => {
    let label = null;
    let color = "";
    let textColor = "";

    if (isAvailable !== undefined) {
        label = isAvailable;
        switch (isAvailable) {
            case 0:
                label = "Suspended";
                break;
            case 1:
                label = "Available";
                break;
            case 2:
                label = "Unavailable";
                textColor = "text-green-600";
                break;
        }
        color =
            isAvailable === 1
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800";
    } else if (borrowStatus !== undefined) {
        label = borrowStatus;
        switch (borrowStatus) {
            case "Pending":
                color = "bg-pink-200";
                break;
            case "Accepted":
                color = "bg-green-400";
                break;
            case "Declined":
                color = "bg-red-300";
                break;
            default:
                color = "bg-gray-300";
        }
    }

    if (!label) return null;

    return (
        <div
            className={`inline-flex items-center px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium
        ${color} 
        `}
        >
            {isAvailable === 1 ? (
                <Icon
                    icon="lucide:check"
                    className="mr-1 w-3 h-3 sm:w-4 sm:h-4"
                />
            ) : isAvailable === 2 ? (
                <Icon icon="lucide:x" className="mr-1 w-3 h-3 sm:w-4 sm:h-4" />
            ) : (
                <Icon
                    icon="lucide:clock"
                    className="mr-1 w-3 h-3 sm:w-4 sm:h-4"
                />
            )}
            <p className="leading-tight">{label}</p>
        </div>
    );
};

export default StatusIndicator;
