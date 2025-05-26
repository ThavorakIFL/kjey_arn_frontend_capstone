import { fetchBookData } from "@/app/(protected)/books/book-action";
import EditBookPageClient from "@/app/(protected)/books/[id]/edit/EditBookPageClient";

interface PageProps {
    params: {
        id: string;
    };
    searchParams: Record<string, string | string[] | undefined>;
}

export default async function EditBookPage({
    params,
    searchParams,
}: PageProps) {
    const { id } = params;
    const book = await fetchBookData(id);

    return (
        <main>
            <EditBookPageClient book={book} />
        </main>
    );
}
