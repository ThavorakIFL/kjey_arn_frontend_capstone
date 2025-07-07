export enum GenreEnum {
    Horror = "Horror",
    Romance = "Romance",
    Adventure = "Adventure",
    ScienceFiction = "Science Fiction",
    Fantasy = "Fantasy",
    Mystery = "Mystery",
    Thriller = "Thriller",
    HistoricalFiction = "Historical Fiction",
    Biography = "Biography",
    SelfHelp = "Self-Help",
    Philosophy = "Philosophy",
    Poetry = "Poetry",
    YoungAdult = "Young Adult",
    Childrens = "Children's",
    Dystopian = "Dystopian",
    NonFiction = "Non-Fiction",
    Memoir = "Memoir",
    Crime = "Crime",
    Classic = "Classic",
    ComicBookGraphicNovel = "Comic Book/Graphic Novel",
}

// Type for Genre values
export type GenreType = (typeof GenreEnum)[keyof typeof GenreEnum];

export interface Genre {
    id: number;
    genre: GenreType; // Using the GenreType from the enum
    created_at: string;
    updated_at: string;
    pivot: {
        book_id: number;
        genre_id: number;
    };
}

// If you need an array of genre values for mapping in component
export const genreOptions = Object.values(GenreEnum);

export interface BackendGenre {
    id: number;
    genre: string;
}

export interface GenreResponse {
    success: boolean;
    message: string;
    data: BackendGenre[];
}
