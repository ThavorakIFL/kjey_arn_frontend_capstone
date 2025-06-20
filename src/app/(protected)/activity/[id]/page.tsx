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
    const borrowEvent = await fetchBorrowRequest(id);
    const borrowEventData = borrowEvent.data;
    return (
        <ActivityClient
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
}
