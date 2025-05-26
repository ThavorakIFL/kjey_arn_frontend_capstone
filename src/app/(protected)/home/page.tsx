import { fetchNewlyAddedBooks } from "./homepage-action"; // API logic in a separate file
import HomePageClient from "./HomePageClient"; // Client-side components for rendering

// This is a Server Component now
const HomePage = async () => {
    const response = await fetchNewlyAddedBooks({});
    const { books, error } = response;

    return (
        <main>
            <HomePageClient books={books} error={error} />
        </main>
    );
};

export default HomePage;
