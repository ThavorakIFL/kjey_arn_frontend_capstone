import HistoryClient from "./HistoryClient";
import { fetchBorrowRequest } from "@/app/(protected)/activity/activity-action";

export default async function History({ params }: { params: { id: number } }) {
    const { id } = await params;
    const borrowEventRes = await fetchBorrowRequest(id);
    const borrowEventData = borrowEventRes.data;
    return <HistoryClient borrowEventData={borrowEventData} />;
}
