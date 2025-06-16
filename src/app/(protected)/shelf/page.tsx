import ShelfPageClient from "./ShelfPageClient";
import { fetchUserBook } from "@/app/(protected)/my-profile/profile-action";

export default async function ShelfPage() {
    // const userBookDataRes = await fetchUserBook();
    // const userBookData = userBookDataRes.success ? userBookDataRes.data : [];
    return <ShelfPageClient />;
}
