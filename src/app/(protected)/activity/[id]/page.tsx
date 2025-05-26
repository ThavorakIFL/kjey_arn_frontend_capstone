import {
    fetchBorrowRequest,
    cancelBorrowRequest,
    acceptMeetUpRequest,
    setReturnDetail,
    confirmReceiveBook,
    suggestMeetUpRequest,
    acceptSuggestion,
} from "../activity-action";
import ActivityClient from "./ActivityClient";

export default async function BorrowRequestPage({
    params,
}: {
    params: { id: number };
}) {
    const { id } = await params;
    const borrowEvent = await fetchBorrowRequest(id);
    const borrowEventData = borrowEvent.data;
    return (
        <ActivityClient
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
