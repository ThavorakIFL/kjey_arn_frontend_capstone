import { fetchBorrowRequest } from "@/app/(protected)/activity/activity-action";
import {
    sendMeetUpDetail,
    rejectBorrowRequest,
    fetchLocationData,
} from "@/app/(protected)/borrow-request/borrow-request-action";
import BorrowRequestIdPageClient from "./BorrowRequestIdPageClient";
import { notFound } from "next/navigation";

export default async function BorrowRequestPage({
    params,
}: {
    params: Promise<{ id: number }>;
}) {
    const { id } = await params;

    try {
        const borrowRequestRes = await fetchBorrowRequest(id);

        if (
            !borrowRequestRes ||
            !borrowRequestRes.data ||
            !borrowRequestRes.success
        ) {
            notFound();
        }

        const locationData = await fetchLocationData();
        const borrowRequestData = borrowRequestRes.data;

        return (
            <BorrowRequestIdPageClient
                locationData={locationData}
                setMeetUpDetail={sendMeetUpDetail}
                borrowRequestData={borrowRequestData}
                rejectBorrowRequest={rejectBorrowRequest}
            />
        );
    } catch (error) {
        notFound();
    }
}
