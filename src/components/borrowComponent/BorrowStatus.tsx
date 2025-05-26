"use client";

type BorrowStatusProps = {
    statusId: number;
};

const BorrowStatus: React.FC<BorrowStatusProps> = ({ statusId }) => {
    let statusText = "";
    let statusColor = "";

    switch (statusId) {
        case 1:
            statusText = "Pending";
            statusColor = "bg-orange-200 text-orange-800";
            break;
        case 2:
            statusText = "Approved";
            statusColor = "bg-green-200 text-green-800";
            break;
        case 3:
            statusText = "Rejected";
            statusColor = "bg-red-200 text-red-800";
            break;
        case 4:
            statusText = "In Progress";
            statusColor = "bg-blue-200 text-blue-800";
            break;
        case 5:
            statusText = "Completed";
            statusColor = "bg- text-green-800";
            break;
        case 6:
            statusText = "Cancelled";
            statusColor = "bg-purple-200 text-purple-800";
            break;
        default:
            statusText = "Unknown Status";
            statusColor = "bg-gray-200 text-gray-800";
    }

    return (
        <div>
            <span
                className={`border border-black inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}
            >
                {statusText}
            </span>
        </div>
    );
};

export default BorrowStatus;
