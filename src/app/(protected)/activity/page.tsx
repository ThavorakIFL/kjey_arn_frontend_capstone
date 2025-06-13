import ActivityPageClient from "./ActivityPageClient";
import { fetchBorrowEventByStatus } from "./activity-action";
export default async function BorrowRequestPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const params = await searchParams;
    const borrowStatusId =
        typeof params.borrow_status_id === "string"
            ? params.borrow_status_id
            : "0"; // Default to "Pending" status if not specified

    const borrowEventDataRes = await fetchBorrowEventByStatus(borrowStatusId);
    const borrowEventData = (await borrowEventDataRes) || { data: [] };
    const statusNameMap = {
        "0": "All Activities",
        "1": "Pending",
        "2": "Approved",
        "4": "In Progress",
        "7": "Return",
        "8": "Deposit",
    };
    const currentStatus =
        statusNameMap[borrowStatusId as keyof typeof statusNameMap] || "";
    return (
        <ActivityPageClient
            userBorrowEventData={borrowEventData.data}
            initialStatus={currentStatus}
        />
    );
}
