import { notFound } from "next/navigation";
import BookPageClient from "../BookPageClient";
import { fetchBookData } from "../book-action";

interface BookPageProps {
    params: Promise<{ id: string }>;
}

const BookPage = async ({ params }: BookPageProps) => {
    const { id } = await params;
    const book = await fetchBookData(id);
    if (!book) {
        notFound();
    }
    return (
        <main>
            <BookPageClient book={book} />
        </main>
    );
};

export default BookPage;
