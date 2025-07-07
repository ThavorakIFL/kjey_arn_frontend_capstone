import {
    fetchBookData,
    fetchGenres,
} from "@/app/(protected)/books/book-action";
import EditBookPageClient from "@/app/(protected)/books/[id]/edit/EditBookPageClient";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}

// export default async function EditBookPage({
//     params,
//     searchParams,
// }: PageProps) {
//     const { id } = await params;
//     const book = await fetchBookData(id);

//     return (
//         <main>
//             <EditBookPageClient book={book} />
//         </main>
//     );
// }

export default async function EditBookPage({
    params,
    searchParams,
}: PageProps) {
    const { id } = await params;
    const book = await fetchBookData(id);

    // Fetch genres on server
    const { backendGenres, genreMap } = await fetchGenres();

    // Transform to expected format
    const genres = backendGenres.map((genre) => ({
        id: genre.id,
        genre: genre.genre,
    }));

    return (
        <main>
            <EditBookPageClient
                book={book}
                genres={genres}
                genreMap={genreMap}
            />
        </main>
    );
}
