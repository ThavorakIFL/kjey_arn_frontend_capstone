import {
    fetchBookData,
    fetchGenres,
} from "@/app/(protected)/books/book-action";
import EditBookPageClient from "@/app/(protected)/books/[id]/edit/EditBookPageClient";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function EditBookPage({
    params,
    searchParams,
}: PageProps) {
    const { id } = await params;

    try {
        const bookData = await fetchBookData(id);
        if (!bookData) {
            notFound(); // This triggers the 404 page
        }
        const { backendGenres, genreMap } = await fetchGenres();

        // Transform to expected format
        const genres = backendGenres.map((genre) => ({
            id: genre.id,
            genre: genre.genre,
        }));

        return (
            <div>
                <EditBookPageClient
                    book={bookData}
                    genres={genres}
                    genreMap={genreMap}
                />
            </div>
        );
    } catch (error) {
        notFound();
    }
}

// export default async function EditBookPage({
//     params,
//     searchParams,
// }: PageProps) {
//     const { id } = await params;

//     try {
//         const book = await fetchBookData(id);

//         if (!book || !book.success || !book.data) {
//             notFound(); // This triggers the 404 page
//         }

//         // Fetch genres on server
//         const { backendGenres, genreMap } = await fetchGenres();

//         // Transform to expected format
//         const genres = backendGenres.map((genre) => ({
//             id: genre.id,
//             genre: genre.genre,
//         }));

//         return (
//             <div>
//                 <EditBookPageClient
//                     book={book}
//                     genres={genres}
//                     genreMap={genreMap}
//                 />
//             </div>
//         );
//     } catch (error) {
//         notFound();
//     }
// }
