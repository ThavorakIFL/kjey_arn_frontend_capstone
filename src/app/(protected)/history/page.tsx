import { fetchUserHistoryBorrowEventData } from "./history-action";
import HistoryPageClient from "./HistoryPageClient";
export default async function HistoryPage() {
    const response = await fetchUserHistoryBorrowEventData();
    const historyBorrowEventData = response?.data || [];

    return (
        <HistoryPageClient historyBorrowEventData={historyBorrowEventData} />
    );
}
