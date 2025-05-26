import { Icon } from "@iconify/react";

interface StatusBadgeProps {
    status: string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
    const isAvailable = status === "Available";

    return (
        <div
            className={`inline-flex items-center px-3 py-1 rounded-full ${
                isAvailable
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
            }`}
        >
            {isAvailable ? (
                <Icon icon="lucide:check" className="mr-1" />
            ) : (
                <Icon icon="lucide:x" className="mr-1" />
            )}
            <span className="font-medium">{status}</span>
        </div>
    );
};

export default StatusBadge;
