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
            statusColor = "text-blue-800 bg-blue-100 border border-blue-200";
            break;
        case 2:
            statusText = "Approved";
            statusColor =
                "text-yellow-800 bg-yellow-100 border border-yellow-200";
            break;
        case 3:
            statusText = "Rejected";
            statusColor = "text-red-800 bg-red-100 border border-red-200";
            break;
        case 4:
            statusText = "In Progress";
            statusColor = "text-green-800 bg-green-100 border border-green-200";
            break;
        case 5:
            statusText = "Completed";
            statusColor =
                "text-emerald-800 bg-emerald-100 border border-emerald-200";
            break;
        case 6:
            statusText = "Cancelled";
            statusColor = "text-amber-800 bg-amber-100 border border-amber-200";
            break;
        case 7:
            statusText = "Due Return";
            statusColor =
                "text-purple-800 bg-purple-100 border border-purple-200";
            break;
        case 8:
            statusText = "Deposit";
            statusColor =
                "text-orange-800 bg-orange-100 border border-orange-200";
            break;
        default:
            statusText = "Unknown Status";
            statusColor = "text-gray-800 bg-gray-100 border border-gray-200";
    }

    return (
        <div>
            <span
                className={`${statusColor} inline-flex items-center px-3 py-1 text-sm font-medium  rounded-full`}
            >
                {statusText}
            </span>
        </div>
    );
};

export default BorrowStatus;
