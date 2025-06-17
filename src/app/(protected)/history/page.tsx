// HistoryPage.tsx
import { fetchUserHistoryBorrowEventData } from "./history-action";
import HistoryPageClient from "./HistoryPageClient";

export default async function HistoryPage() {
    const response = await fetchUserHistoryBorrowEventData();

    return (
        <HistoryPageClient
            historyBorrowEventData={response.data}
            error={response.error}
            isLoading={false}
        />
    );
}
