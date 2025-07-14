import { notFound } from "next/navigation";
import { fetchLocationData } from "../../borrow-request/borrow-request-action";
import {
    fetchBorrowRequest,
    cancelBorrowRequest,
    acceptMeetUpRequest,
    setReturnDetail,
    confirmReceiveBook,
    suggestMeetUpRequest,
    acceptSuggestion,
    reportBorrowEvent,
} from "../activity-action";
import ActivityClient from "./ActivityClient";

export default async function BorrowRequestPage({
    params,
}: {
    params: Promise<{ id: number }>;
}) {
    const { id } = await params;

    try {
        const borrowEvent = await fetchBorrowRequest(id);

        if (!borrowEvent || !borrowEvent.data || !borrowEvent.success) {
            notFound();
        }

        const locationData = await fetchLocationData();
        const borrowEventData = borrowEvent.data;
        return (
            <ActivityClient
                locationData={locationData}
                reportBorrowEvent={reportBorrowEvent}
                acceptSuggestion={acceptSuggestion}
                suggestMeetUpRequest={suggestMeetUpRequest}
                confirmReceiveBook={confirmReceiveBook}
                acceptMeetUpRequest={acceptMeetUpRequest}
                cancelBorrowRequest={cancelBorrowRequest}
                setReturnDetail={setReturnDetail}
                borrowEventData={borrowEventData}
            />
        );
    } catch (error) {
        notFound();
    }
}
