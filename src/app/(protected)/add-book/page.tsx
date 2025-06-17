import { Metadata } from "next";
import AddBookPageClient from "./AddBookPageClient";
import { GenreEnum, genreOptions } from "@/types/genre";
import TitleBar from "@/components/TitleBar";

export const metadata: Metadata = {
    title: "Add New Book",
    description: "List a new book for sharing or selling",
};

// Create genres array with IDs for the form
// In a real app, these IDs would come from your database
const genres = genreOptions.map((genreName, index) => ({
    id: index + 1,
    genre: genreName,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    pivot: {
        book_id: 0,
        genre_id: index + 1,
    },
}));

export default function AddBookPage() {
    return (
        <div>
            <AddBookPageClient genres={genres} />
        </div>
    );
}
