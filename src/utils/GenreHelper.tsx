import { BackendGenre, GenreEnum, GenreType } from "@/types/genre";

export const createGenreMapping = (backendGenres: BackendGenre[]) => {
    const genreMap: Record<string, number> = {};
    const reverseMap: Record<number, GenreType> = {};

    backendGenres.forEach((genre) => {
        // Find matching enum value (case-insensitive and flexible matching)
        const enumValue = Object.values(GenreEnum).find(
            (enumGenre) =>
                enumGenre.toLowerCase().replace(/[^a-z0-9]/g, "") ===
                genre.genre.toLowerCase().replace(/[^a-z0-9]/g, "")
        );

        if (enumValue) {
            genreMap[enumValue] = genre.id;
            reverseMap[genre.id] = enumValue as GenreType;
        }
    });

    return { genreMap, reverseMap };
};
