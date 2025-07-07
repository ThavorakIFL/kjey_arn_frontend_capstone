import { Metadata } from "next";
import AddBookPageClient from "./AddBookPageClient";
import { fetchGenres } from "@/app/(protected)/books/book-action";
import { GenreEnum, GenreType } from "@/types/genre";

export const metadata: Metadata = {
    title: "Add New Book",
    description: "List a new book for sharing or selling",
};

export default async function AddBookPage() {
    // Use your existing server function
    const { backendGenres } = await fetchGenres();

    // Transform backend genres to match your AddBookPageClient expected format
    const genres = backendGenres
        .map((genre) => {
            // Find matching enum value (case-insensitive and flexible matching)
            const enumValue = Object.values(GenreEnum).find(
                (enumGenre) =>
                    enumGenre.toLowerCase().replace(/[^a-z0-9]/g, "") ===
                    genre.genre.toLowerCase().replace(/[^a-z0-9]/g, "")
            );

            // Only include genres that match your enum
            if (!enumValue) {
                console.warn(
                    `Genre "${genre.genre}" from backend doesn't match any enum value`
                );
                return null;
            }

            return {
                id: genre.id,
                genre: enumValue as GenreType, // Cast to GenreType since we verified it exists
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                pivot: {
                    book_id: 0,
                    genre_id: genre.id,
                },
            };
        })
        .filter((genre): genre is NonNullable<typeof genre> => genre !== null); // Remove null values

    return (
        <div>
            <AddBookPageClient genres={genres} />
        </div>
    );
}
