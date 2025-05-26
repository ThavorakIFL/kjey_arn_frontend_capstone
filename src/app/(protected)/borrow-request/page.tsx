import BorrowRequestPageClient from "./BorrowRequestPageClient";
import { fetchBorrowRequestData } from "./borrow-request-action";
export default async function BorrowRequestPage() {
    const borrowRequestRes = await fetchBorrowRequestData();
    const borrowRequestData = (await borrowRequestRes?.success)
        ? borrowRequestRes?.data
        : [];
    return (
        <BorrowRequestPageClient userBorrowRequestData={borrowRequestData} />
    );
}
