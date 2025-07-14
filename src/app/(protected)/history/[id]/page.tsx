import { notFound } from "next/navigation";
import HistoryClient from "./HistoryClient";
import { fetchBorrowRequest } from "@/app/(protected)/activity/activity-action";

export default async function History({
    params,
}: {
    params: Promise<{ id: number }>;
}) {
    const { id } = await params;

    try {
        const borrowEventRes = await fetchBorrowRequest(id);

        if (
            !borrowEventRes ||
            !borrowEventRes.data ||
            !borrowEventRes.success
        ) {
            notFound();
        }

        const borrowEventData = borrowEventRes.data;
        return <HistoryClient borrowEventData={borrowEventData} />;
    } catch (error) {
        notFound();
    }
}
