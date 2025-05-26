import ActivityPageClient from "./ActivityPageClient";
import { fetchBorrowEventByStatus } from "./activity-action";
export default async function BorrowRequestPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const params = await searchParams;
    const borrowStatusId =
        typeof params.borrow_status_id === "string"
            ? params.borrow_status_id
            : "1";

    const borrowEventDataRes = await fetchBorrowEventByStatus(borrowStatusId);
    const borrowEventData = (await borrowEventDataRes) || { data: [] };
    const statusNameMap = {
        "1": "Pending",
        "2": "Approved",
        "4": "In Progress",
    };
    const currentStatus =
        statusNameMap[borrowStatusId as keyof typeof statusNameMap] ||
        "Pending";
    return (
        <ActivityPageClient
            userBorrowEventData={borrowEventData.data}
            initialStatus={currentStatus}
            initialStatusId={borrowStatusId}
        />
    );
}
