import MobileBook from "@/components/bookComponent/MobileBook";

// app/(protected)/test/page.tsx
export default function TestPage() {
    const mockBookData = {
        id: 123,
        user_id: 456,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        condition: 4,
        description:
            "A classic novel about the American Dream set in the Roaring Twenties.",
        created_at: "2023-01-15T12:30:45Z",
        updated_at: "2023-02-20T09:15:30Z",
        genres: [
            {
                id: 1,
                genre: "Fiction",
                created_at: "2023-01-01T00:00:00Z",
                updated_at: "2023-01-01T00:00:00Z",
            },
            {
                id: 2,
                genre: "Classic",
                created_at: "2023-01-01T00:00:00Z",
                updated_at: "2023-01-01T00:00:00Z",
            },
            {
                id: 3,
                genre: "Literary",
                created_at: "2023-01-01T00:00:00Z",
                updated_at: "2023-01-01T00:00:00Z",
            },
        ],
        pictures: [{ id: 1, picture: "great-gatsby-cover.jpg", book_id: 123 }],
        availability: {
            id: 789,
            book_id: 123,
            availability_id: 1,
            borrower_id: null,
        },
        user: {
            id: 456,
            name: "John Doe",
            email: "john.doe@example.com",
        },
    };

    return (
        <div className="flex">
            <MobileBook book={mockBookData} />
        </div>
    );
}
