import { Book } from "./book";

export type PaginatedBooks = {
    success: boolean;
    message: string;
    data: {
        pagination: {
            total: number;
            per_page: number;
            current_page: number;
            last_page: number;
        };
        books: Book[];
    };
};
