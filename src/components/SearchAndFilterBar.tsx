"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { genreOptions, GenreType } from "@/types/genre";
import { Separator } from "@/components/ui/separator";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { SelectGroup } from "@radix-ui/react-select";
import { fetchGenres } from "@/app/(protected)/books/book-action";

interface SearchAndFilterBarProps {
    globalSearch?: boolean;
    defaultQuery?: string;
    defaultType?: string;
    defaultGenres?: string[];
    onSearch?: (query: string, type: string, genres: string[]) => void;
}

const SearchAndFilterBar: React.FC<SearchAndFilterBarProps> = ({
    globalSearch = true,
    defaultQuery = "",
    defaultType = "book",
    defaultGenres = [],
    onSearch,
}) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const dropdownRef = useRef<HTMLDivElement>(null);

    const [query, setQuery] = useState(defaultQuery);
    const [type, setType] = useState(defaultType);
    const [selectedGenres, setSelectedGenres] =
        useState<string[]>(defaultGenres);
    const [showGenreFilter, setShowGenreFilter] = useState(false);
    const [genreMap, setGenreMap] = useState<Record<string, number>>({});
    const [reverseGenreMap, setReverseGenreMap] = useState<
        Record<number, string>
    >({});
    const [isLoadingGenres, setIsLoadingGenres] = useState(false);
    const [availableGenres, setAvailableGenres] =
        useState<GenreType[]>(genreOptions);
    const [genresLoaded, setGenresLoaded] = useState(false);

    // Initialize from URL params only after genres are loaded
    useEffect(() => {
        const loadGenres = async () => {
            setIsLoadingGenres(true);
            try {
                console.log("🔄 Starting to fetch genres...");

                const {
                    backendGenres,
                    genreMap: fetchedGenreMap,
                    reverseMap,
                } = await fetchGenres();

                console.log("📦 Backend genres received:", backendGenres);
                console.log("🗺️ Genre map:", fetchedGenreMap);
                console.log("🔄 Reverse map:", reverseMap);

                setGenreMap(fetchedGenreMap);
                setReverseGenreMap(reverseMap);

                const availableBackendGenres = genreOptions.filter((genre) =>
                    fetchedGenreMap.hasOwnProperty(genre)
                );

                console.log(
                    "✅ Available backend genres:",
                    availableBackendGenres
                );
                console.log("📋 All genreOptions:", genreOptions);

                if (availableBackendGenres.length > 0) {
                    const allBackendGenres = backendGenres.map((g) => g.genre);
                    console.log(
                        "📋 Showing all backend genres:",
                        allBackendGenres
                    );
                    setAvailableGenres(allBackendGenres as GenreType[]);
                    // setAvailableGenres(availableBackendGenres);
                } else {
                    console.log("⚠️ No matching genres found, using fallback");
                    setAvailableGenres(genreOptions);
                }

                setGenresLoaded(true);
            } catch (error) {
                console.error("❌ Failed to load genres:", error);
                // Your fallback code...
            } finally {
                setIsLoadingGenres(false);
            }
        };

        loadGenres();
    }, []);

    // Initialize from URL params only after genres are loaded
    useEffect(() => {
        if (!genresLoaded) return;

        const urlQuery = searchParams.get("q") || defaultQuery;
        const urlType = searchParams.get("type") || defaultType;

        setQuery(urlQuery);
        setType(urlType);

        // Only set genres from URL if genres are loaded and we have the reverse map
        const urlGenreIds = searchParams.get("genre_ids");
        if (urlGenreIds && Object.keys(reverseGenreMap).length > 0) {
            const genreIds = urlGenreIds
                .split(",")
                .map((id) => parseInt(id.trim()));
            const genreNames = genreIds
                .map((id) => reverseGenreMap[id])
                .filter((name) => name !== undefined);
            setSelectedGenres(genreNames);
        } else if (defaultGenres.length > 0) {
            setSelectedGenres(defaultGenres);
        }
    }, [genresLoaded, reverseGenreMap]); // ← Remove searchParams from here

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setShowGenreFilter(false);
            }
        };

        if (showGenreFilter) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showGenreFilter]);

    const getSearchDestination = () => {
        if (globalSearch === false) {
            return "shelf";
        } else {
            return type === "book" ? "all-book" : "all-reader";
        }
    };

    const toggleGenre = (genre: string) => {
        setSelectedGenres((prev) =>
            prev.includes(genre)
                ? prev.filter((g) => g !== genre)
                : [...prev, genre]
        );
    };

    // const handleClearAllGenres = () => {
    //     setSelectedGenres([]);
    //     const searchDestination = getSearchDestination();
    //     const url = new URLSearchParams();
    //     url.set("q", query);
    //     url.set("type", type);
    //     router.push(`/${searchDestination}?${url.toString()}`);
    // };

    const handleClearAllGenres = () => {
        setSelectedGenres([]);
        const searchDestination = getSearchDestination();
        const url = new URLSearchParams(searchParams.toString()); // ← Keep existing params

        // Only remove genre_ids, keep query and type
        url.delete("genre_ids");

        router.push(`/${searchDestination}?${url.toString()}`);
    };

    const handleSearch = () => {
        const searchDestination = getSearchDestination();
        const url = new URLSearchParams(searchParams.toString());
        // url.set("q", query);
        // url.set("type", type);

        // if (type === "book" && selectedGenres.length > 0) {
        //     const genre_ids = selectedGenres
        //         .map((genre) => genreMap[genre])
        //         .filter((id) => id !== undefined);

        //     if (genre_ids.length > 0) {
        //         url.set("genre_ids", genre_ids.join(","));
        //     }
        // }

        // if (onSearch) {
        //     onSearch(query, type, selectedGenres);
        // }

        // router.push(`/${searchDestination}?${url.toString()}`);
        if (query.trim()) {
            url.set("q", query.trim());
        } else {
            url.delete("q");
        }
        url.set("type", type);

        if (type === "book" && selectedGenres.length > 0) {
            const genre_ids = selectedGenres
                .map((genre) => genreMap[genre])
                .filter((id) => id !== undefined);

            if (genre_ids.length > 0) {
                url.set("genre_ids", genre_ids.join(","));
            } else {
                url.delete("genre_ids");
            }
        } else {
            url.delete("genre_ids");
        }

        if (onSearch) {
            onSearch(query, type, selectedGenres);
        }

        router.push(`/${searchDestination}?${url.toString()}`);
    };

    const handleTypeChange = (newType: string) => {
        setType(newType);
        if (newType !== "book") {
            setSelectedGenres([]);
        }
    };

    return (
        <div className="flex flex-col gap-3 sm:gap-4 mb-4 px-2 sm:px-0">
            {/* Main Search Container */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 relative">
                {/* Search Input Container */}
                <div className="h-12 sm:h-14 flex items-center bg-white p-3 sm:p-4 rounded-lg w-full border border-gray-300 shadow-sm">
                    <Icon
                        icon="lucide:search"
                        className="text-gray-500 flex-shrink-0"
                        width="18"
                        height="18"
                    />
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        className="w-full focus:outline-none mx-3 sm:mx-4 text-sm sm:text-base"
                        placeholder={
                            type === "book"
                                ? "Search books, authors..."
                                : "Search readers, names..."
                        }
                    />

                    {globalSearch && (
                        <div className="flex items-center space-x-3 sm:space-x-4">
                            <Separator
                                orientation="vertical"
                                className="h-8 bg-gradient-to-b from-slate-200 via-slate-300 to-slate-200 w-px"
                            />

                            <Select
                                value={type}
                                onValueChange={handleTypeChange}
                            >
                                <SelectTrigger
                                    className="
                                    cursor-pointer
              w-32 sm:w-36 
              border border-slate-200/80 
              shadow-sm 
              hover:shadow-md 
              hover:border-slate-300
              focus:border-slate-400
              focus:ring-2 
              focus:ring-slate-100
              text-sm 
              font-medium
              bg-white
              transition-all 
              duration-200 
              ease-in-out
              rounded-lg
              px-3 
              py-2.5
              text-slate-700
              hover:bg-slate-50/50
            "
                                >
                                    <SelectValue
                                        placeholder="Select type"
                                        className="text-slate-600"
                                    />
                                </SelectTrigger>

                                <SelectContent
                                    className="
              border 
              border-slate-200/80 
              shadow-xl 
              rounded-lg 
              bg-white 
              backdrop-blur-sm
              animate-in 
              fade-in-0 
              zoom-in-95
            "
                                >
                                    <SelectGroup>
                                        <SelectItem
                                            value="book"
                                            className="
                    text-sm 
                    font-medium 
                    text-slate-700 
                    hover:bg-slate-50 
                    hover:text-slate-900
                    focus:bg-slate-100
                    cursor-pointer
                    transition-colors
                    duration-150
                    px-3
                    py-2
                    rounded-md
                    mx-1
                  "
                                        >
                                            Book
                                        </SelectItem>
                                        <SelectItem
                                            value="reader"
                                            className="
                    text-sm 
                    font-medium 
                    text-slate-700 
                    hover:bg-slate-50 
                    hover:text-slate-900
                    focus:bg-slate-100
                    cursor-pointer
                    transition-colors
                    duration-150
                    px-3
                    py-2
                    rounded-md
                    mx-1
                  "
                                        >
                                            Reader
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>

                {type === "book" && (
                    <div className="flex gap-2">
                        <Button
                            className="
                            cursor-pointer
                flex-1 sm:flex-none sm:min-w-[140px] 
                !h-12 sm:!h-14  bg-sidebarColor 
                
                text-xs sm:text-sm
                px-3 sm:px-4
                gap-2
            "
                            type="button"
                            onClick={() => setShowGenreFilter((prev) => !prev)}
                            disabled={isLoadingGenres}
                        >
                            <span className="hidden sm:inline">
                                {isLoadingGenres
                                    ? "Loading..."
                                    : "Filter Genre"}
                            </span>
                            <span className="sm:hidden">
                                {isLoadingGenres ? "..." : "Filter"}
                            </span>
                            <Icon
                                icon={
                                    isLoadingGenres
                                        ? "lucide:loader-2"
                                        : "lucide:filter"
                                }
                                width="16"
                                height="16"
                                className={`sm:w-5 sm:h-5 ${
                                    isLoadingGenres ? "animate-spin" : ""
                                }`}
                            />
                        </Button>

                        <Button
                            onClick={handleSearch}
                            className="
                            cursor-pointer
                sm:hidden flex-shrink-0
                !h-12 !w-12  
               bg-primaryBlue hover:bg-primaryBlue/90
                p-0
            "
                        >
                            <Icon icon="lucide:search" width="18" height="18" />
                        </Button>
                    </div>
                )}

                {/* Reader type */}
                {type === "reader" && (
                    <Button
                        onClick={handleSearch}
                        className="
                        cursor-pointer
            flex-1  sm:min-w-[140px]
              h-12 sm:h-14 
            bg-primaryBlue
            hover:bg-primaryBlue/90 
            text-xs sm:text-sm
            px-4
        "
                    >
                        <span className="hidden sm:inline">Search</span>
                        <div className="sm:hidden h-8 flex items-center space-x-4">
                            <Icon
                                icon="lucide:search"
                                width="18"
                                height="18"
                                className=" "
                            />
                        </div>
                    </Button>
                )}

                {/* Genre Filter Dropdown */}
                <div
                    className="absolute w-full sm:w-auto top-full mt-2 z-20 sm:right-0"
                    ref={dropdownRef}
                >
                    {showGenreFilter && (
                        <div
                            className="
                            w-full sm:w-80 
                            bg-white border rounded-lg shadow-lg 
                            p-4 
                            max-h-64 sm:max-h-80 
                            overflow-auto
                            right-0
                        "
                        >
                            <div className="space-y-3">
                                <h4 className="font-medium text-gray-900 text-sm sm:text-base">
                                    Filter by Genre
                                </h4>

                                {isLoadingGenres ? (
                                    <div className="flex items-center justify-center py-4">
                                        <Icon
                                            icon="lucide:loader-2"
                                            className="animate-spin text-gray-500"
                                            width="20"
                                            height="20"
                                        />
                                        <span className="ml-2 text-sm text-gray-500">
                                            Loading genres...
                                        </span>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {availableGenres.map((genre) => (
                                            <label
                                                key={genre}
                                                className="
                                                    flex items-center space-x-2 cursor-pointer 
                                                    p-2 rounded hover:bg-gray-50
                                                    text-sm
                                                "
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedGenres.includes(
                                                        genre
                                                    )}
                                                    onChange={() =>
                                                        toggleGenre(genre)
                                                    }
                                                    className="rounded"
                                                />
                                                <span className="text-gray-700">
                                                    {genre}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                )}

                                <div className="flex flex-col sm:flex-row justify-between gap-2 pt-3 border-t">
                                    <Button
                                        variant="outline"
                                        onClick={handleClearAllGenres}
                                        type="button"
                                        size="sm"
                                        className="text-xs sm:text-sm cursor-pointer"
                                        disabled={isLoadingGenres}
                                    >
                                        Clear All
                                    </Button>

                                    <Button
                                        onClick={() => {
                                            handleSearch();
                                            setShowGenreFilter(false);
                                        }}
                                        type="button"
                                        size="sm"
                                        className="bg-primaryBlue hover:bg-primaryBlue/90 cursor-pointer text-xs sm:text-sm"
                                        disabled={isLoadingGenres}
                                    >
                                        Apply Filters
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Selected Genre Tags */}
            {selectedGenres.length > 0 && type === "book" && (
                <div className="flex gap-2 flex-wrap px-1">
                    <span className="text-xs sm:text-sm text-gray-600 self-center">
                        Filters:
                    </span>
                    {selectedGenres.map((genre) => (
                        <div
                            key={genre}
                            className="
                       
                                bg-blue-100 text-blue-800 
                                rounded-full 
                                px-2 sm:px-3 py-1 
                                text-xs sm:text-sm
                                flex items-center gap-1
                                max-w-full
                            "
                        >
                            <span className="truncate">{genre}</span>
                            <button
                                onClick={() => toggleGenre(genre)}
                                className="hover:bg-blue-200 rounded-full p-0.5 ml-1 cursor-pointer"
                            >
                                <Icon icon="lucide:x" width="12" height="12" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchAndFilterBar;
