// types/pagination.ts
export interface PaginationData {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    has_more_pages: boolean;
    prev_page_url?: string | null;
    next_page_url?: string | null;
}

export interface PaginatedResponse<T> {
    success: boolean;
    data: {
        books: T[];
        pagination: PaginationData;
    };
    message: string;
}

export interface SearchQuery {
    sub?: string;
    title?: string;
    author?: string;
    genre_ids?: number[] | string;
    page?: number;
    per_page?: number;
}
