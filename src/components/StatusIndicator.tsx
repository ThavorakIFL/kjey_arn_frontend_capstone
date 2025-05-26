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
            className={`inline-flex items-center px-3 py-1 rounded-full
        ${color} 
        `}
        >
            {isAvailable === 1 ? (
                <Icon icon="lucide:check" className="mr-1" />
            ) : isAvailable === 2 ? (
                <Icon icon="lucide:x" className="mr-1" />
            ) : (
                <Icon icon="lucide:clock" className="mr-1" />
            )}
            <p>{label}</p>
        </div>
    );
};

export default StatusIndicator;
