import { fetchNewlyAddedBooks, checkBorrowEvent } from "./homepage-action";
import HomePageClient from "./HomePageClient";

const HomePage = async () => {
    const response = await fetchNewlyAddedBooks({});
    const checkForBorrowEvent = await checkBorrowEvent();
    const { books, error } = response;
    return (
        <main>
            <HomePageClient books={books} error={error} />
        </main>
    );
};

export default HomePage;
