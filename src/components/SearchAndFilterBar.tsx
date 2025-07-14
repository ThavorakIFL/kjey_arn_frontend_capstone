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
import { useDebounce } from "@/hooks/useDebounce"; // You'll need to create this hook

interface BookSuggestion {
    id: number;
    title: string;
    author: string;
    display: string;
}

interface UserSuggestion {
    id: number;
    name: string;
    email: string;
    picture: string;
    sub: string;
    display: string;
}

interface SearchAndFilterBarProps {
    userSub?: string;
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
    userSub,
}) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const suggestionDropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

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

    const [suggestions, setSuggestions] = useState<
        (BookSuggestion | UserSuggestion)[]
    >([]);

    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
    const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);

    // Debounce the search query for autocomplete
    const debouncedQuery = useDebounce(query, 300);

    // Initialize from URL params only after genres are loaded
    useEffect(() => {
        const loadGenres = async () => {
            setIsLoadingGenres(true);
            try {
                const {
                    backendGenres,
                    genreMap: fetchedGenreMap,
                    reverseMap,
                } = await fetchGenres();
                setGenreMap(fetchedGenreMap);
                setReverseGenreMap(reverseMap);
                const availableBackendGenres = genreOptions.filter((genre) =>
                    fetchedGenreMap.hasOwnProperty(genre)
                );
                if (availableBackendGenres.length > 0) {
                    const allBackendGenres = backendGenres.map((g) => g.genre);
                    setAvailableGenres(allBackendGenres as GenreType[]);
                } else {
                    setAvailableGenres(genreOptions);
                }
                setGenresLoaded(true);
            } catch (error) {
                console.error("Error loading genres:", error);
            } finally {
                setIsLoadingGenres(false);
            }
        };
        loadGenres();
    }, []);

    useEffect(() => {
        if (!genresLoaded) return;
        const urlQuery = searchParams.get("q") || defaultQuery;
        const urlType = searchParams.get("type") || defaultType;
        setQuery(urlQuery);
        setType(urlType);
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
    }, [genresLoaded, reverseGenreMap]);

    // Fetch suggestions when debounced query changes
    useEffect(() => {
        if (
            type === "book" &&
            debouncedQuery.trim() &&
            debouncedQuery.length > 1
        ) {
            fetchSuggestions(debouncedQuery);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    }, [debouncedQuery, type]);

    // Handle clicks outside dropdowns
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setShowGenreFilter(false);
            }
            if (
                suggestionDropdownRef.current &&
                !suggestionDropdownRef.current.contains(event.target as Node) &&
                inputRef.current &&
                !inputRef.current.contains(event.target as Node)
            ) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Fetch suggestions when debounced query changes
    useEffect(() => {
        if (debouncedQuery.trim() && debouncedQuery.length > 1) {
            fetchSuggestions(debouncedQuery);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    }, [debouncedQuery, type]); // Now works for both book and user types

    const fetchSuggestions = async (searchQuery: string) => {
        setIsLoadingSuggestions(true);
        try {
            // Choose API endpoint based on search type
            let apiUrl;
            if (type === "book") {
                apiUrl = `${
                    process.env.NEXT_PUBLIC_API_URL
                }books/suggestions?query=${encodeURIComponent(searchQuery)}`;
                // Add user filter for shelf context
                if (!globalSearch && userSub) {
                    apiUrl += `&sub=${encodeURIComponent(userSub)}`;
                }
            } else {
                // User suggestions
                apiUrl = `${
                    process.env.NEXT_PUBLIC_API_URL
                }users/suggestions?query=${encodeURIComponent(searchQuery)}`;
            }

            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("Response is not JSON");
            }

            const data = await response.json();

            if (data.success) {
                setSuggestions(data.data);
                setShowSuggestions(data.data.length > 0);
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        } catch (error) {
            console.error("Error fetching suggestions:", error);
            setSuggestions([]);
            setShowSuggestions(false);
        } finally {
            setIsLoadingSuggestions(false);
        }
    };

    const handleSuggestionClick = (
        suggestion: BookSuggestion | UserSuggestion
    ) => {
        if (type === "book") {
            setQuery((suggestion as BookSuggestion).title);
        } else {
            setQuery((suggestion as UserSuggestion).name);
        }
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!showSuggestions) {
            if (e.key === "Enter") {
                handleSearch();
            }
            return;
        }

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setSelectedSuggestionIndex((prev) =>
                    prev < suggestions.length - 1 ? prev + 1 : prev
                );
                break;
            case "ArrowUp":
                e.preventDefault();
                setSelectedSuggestionIndex((prev) =>
                    prev > 0 ? prev - 1 : -1
                );
                break;
            case "Enter":
                e.preventDefault();
                if (selectedSuggestionIndex >= 0) {
                    handleSuggestionClick(suggestions[selectedSuggestionIndex]);
                } else {
                    handleSearch();
                }
                break;
            case "Escape":
                setShowSuggestions(false);
                setSelectedSuggestionIndex(-1);
                break;
        }
    };

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

    const handleClearAllGenres = () => {
        setSelectedGenres([]);
        const searchDestination = getSearchDestination();
        const url = new URLSearchParams(searchParams.toString());
        url.delete("genre_ids");
        router.push(`/${searchDestination}?${url.toString()}`);
    };

    const handleSearch = () => {
        const searchDestination = getSearchDestination();
        const url = new URLSearchParams(searchParams.toString());

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
        setShowSuggestions(false);
    };

    const handleTypeChange = (newType: string) => {
        setType(newType);
        if (newType !== "book") {
            setSelectedGenres([]);
            setShowSuggestions(false);
            setSuggestions([]);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        setSelectedSuggestionIndex(-1);

        // Show suggestions only for book type and when there's input
        if (type === "book" && value.trim()) {
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    const handleInputFocus = () => {
        if (type === "book" && query.trim() && suggestions.length > 0) {
            setShowSuggestions(true);
        }
    };

    return (
        <div className="flex flex-col gap-3 sm:gap-4 mb-4 px-2 sm:px-0">
            {/* Main Search Container */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 relative">
                {/* Search Input Container */}
                <div className="h-12 sm:h-14 flex items-center bg-white p-3 sm:p-4 rounded-lg w-full border border-gray-300 shadow-sm relative">
                    <Icon
                        icon="lucide:search"
                        className="text-gray-500 flex-shrink-0"
                        width="18"
                        height="18"
                    />
                    <input
                        ref={inputRef}
                        value={query}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        onFocus={handleInputFocus}
                        className="w-full focus:outline-none mx-3 sm:mx-4 text-sm sm:text-base"
                        placeholder={
                            type === "book"
                                ? "Search books, authors..."
                                : "Search readers, names..."
                        }
                        autoComplete="off"
                    />

                    {/* Loading indicator for suggestions */}
                    {isLoadingSuggestions && (
                        <Icon
                            icon="lucide:loader-2"
                            className="animate-spin text-gray-400 mr-2"
                            width="16"
                            height="16"
                        />
                    )}

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
                                <SelectTrigger className="cursor-pointer w-32 sm:w-36 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 text-sm font-medium bg-white transition-all duration-200 ease-in-out rounded-lg px-3 py-2.5 text-slate-700 hover:bg-slate-50/50">
                                    <SelectValue
                                        placeholder="Select type"
                                        className="text-slate-600"
                                    />
                                </SelectTrigger>

                                <SelectContent className="border border-slate-200/80 shadow-xl rounded-lg bg-white backdrop-blur-sm animate-in fade-in-0 zoom-in-95">
                                    <SelectGroup>
                                        <SelectItem
                                            value="book"
                                            className="text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 focus:bg-slate-100 cursor-pointer transition-colors duration-150 px-3 py-2 rounded-md mx-1"
                                        >
                                            Book
                                        </SelectItem>
                                        <SelectItem
                                            value="reader"
                                            className="text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 focus:bg-slate-100 cursor-pointer transition-colors duration-150 px-3 py-2 rounded-md mx-1"
                                        >
                                            Reader
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {showSuggestions && suggestions.length > 0 && (
                        <div
                            ref={suggestionDropdownRef}
                            className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-64 overflow-y-auto"
                        >
                            {suggestions.map((suggestion, index) => (
                                <div
                                    key={suggestion.id}
                                    className={`px-4 py-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
                                        index === selectedSuggestionIndex
                                            ? "bg-blue-50"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        handleSuggestionClick(suggestion)
                                    }
                                >
                                    <div className="flex items-center space-x-2">
                                        <Icon
                                            icon={
                                                type === "book"
                                                    ? "lucide:book"
                                                    : "lucide:user"
                                            }
                                            className="text-gray-400 flex-shrink-0"
                                            width="16"
                                            height="16"
                                        />
                                        <div className="min-w-0 flex-1">
                                            {type === "book" ? (
                                                <>
                                                    <div className="text-sm font-medium text-gray-900 truncate">
                                                        {
                                                            (
                                                                suggestion as BookSuggestion
                                                            ).title
                                                        }
                                                    </div>
                                                    <div className="text-xs text-gray-500 truncate">
                                                        by{" "}
                                                        {
                                                            (
                                                                suggestion as BookSuggestion
                                                            ).author
                                                        }
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="text-sm font-medium text-gray-900 truncate">
                                                        {
                                                            (
                                                                suggestion as UserSuggestion
                                                            ).name
                                                        }
                                                    </div>
                                                    <div className="text-xs text-gray-500 truncate">
                                                        {
                                                            (
                                                                suggestion as UserSuggestion
                                                            ).email
                                                        }
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {type === "book" && (
                    <div className="flex gap-2">
                        <Button
                            className="cursor-pointer flex-1 sm:flex-none sm:min-w-[140px] !h-12 sm:!h-14 bg-sidebarColor text-xs sm:text-sm px-3 sm:px-4 gap-2"
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
                            className="cursor-pointer sm:hidden flex-shrink-0 !h-12 !w-12 bg-primaryBlue hover:bg-primaryBlue/90 p-0"
                        >
                            <Icon icon="lucide:search" width="18" height="18" />
                        </Button>
                    </div>
                )}

                {/* Reader type */}
                {type === "reader" && (
                    <Button
                        onClick={handleSearch}
                        className="cursor-pointer flex-1 sm:min-w-[140px] h-12 sm:h-14 bg-primaryBlue hover:bg-primaryBlue/90 text-xs sm:text-sm px-4"
                    >
                        <span className="hidden sm:inline">Search</span>
                        <div className="sm:hidden h-8 flex items-center space-x-4">
                            <Icon icon="lucide:search" width="18" height="18" />
                        </div>
                    </Button>
                )}

                {/* Genre Filter Dropdown */}
                <div
                    className="absolute w-full sm:w-auto top-full mt-2 z-20 sm:right-0"
                    ref={dropdownRef}
                >
                    {showGenreFilter && (
                        <div className="w-full sm:w-80 bg-white border rounded-lg shadow-lg p-4 max-h-64 sm:max-h-80 overflow-auto right-0">
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
                                                className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-gray-50 text-sm"
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
                            className="bg-blue-100 text-blue-800 rounded-full px-2 sm:px-3 py-1 text-xs sm:text-sm flex items-center gap-1 max-w-full"
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
