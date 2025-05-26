import { fetchBorrowRequest } from "@/app/(protected)/activity/activity-action";
import {
    sendMeetUpDetail,
    rejectBorrowRequest,
} from "@/app/(protected)/borrow-request/borrow-request-action";
import BorrowRequestIdPageClient from "./BorrowRequestIdPageClient";

export default async function BorrowRequestPage({
    params,
}: {
    params: { id: number };
}) {
    const { id } = await params;
    console.log("BorrowRequestPage id:", id);
    const borrowRequestRes = await fetchBorrowRequest(id);
    const borrowRequestData = borrowRequestRes.data;

    return (
        <BorrowRequestIdPageClient
            setMeetUpDetail={sendMeetUpDetail}
            borrowRequestData={borrowRequestData}
            rejectBorrowRequest={rejectBorrowRequest}
        />
    );
}
