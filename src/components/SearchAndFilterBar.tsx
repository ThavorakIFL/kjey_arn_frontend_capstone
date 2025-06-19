"use client";

import React, { useState, useEffect, useRef, use } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { genreOptions } from "@/types/genre";
import { Separator } from "@/components/ui/separator";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { SelectGroup, SelectLabel } from "@radix-ui/react-select";

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
    const [query, setQuery] = useState(defaultQuery);
    const [type, setType] = useState(defaultType);
    const [selectedGenres, setSelectedGenres] =
        useState<string[]>(defaultGenres);
    const [showGenreFilter, setShowGenreFilter] = useState(false);
    const router = useRouter();

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
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleClearAllGenres = () => {
        setSelectedGenres([]);
        // Trigger search with empty genres
        const searchDestination = getSearchDestination();
        const url = new URLSearchParams();
        url.set("q", query);
        url.set("type", type);
        // Don't set genre_ids since we're clearing all genres
        router.push(`/${searchDestination}?${url.toString()}`);
    };

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
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showGenreFilter]);

    const handleSearch = () => {
        const genreMap: Record<string, number> = {
            Horror: 1,
            Romance: 2,
            Adventure: 3,
            "Science Fiction": 4,
            Fantasy: 5,
            Mystery: 6,
            Thriller: 7,
            "Historical Fiction": 8,
            Biography: 9,
            "Self-Help": 10,
            Philosophy: 11,
            Poetry: 12,
            "Young Adult": 13,
            "Children's": 14,
            Dystopian: 15,
            "Non-Fiction": 16,
            Memoir: 17,
            Crime: 18,
            Classic: 19,
            "Comic Book/Graphic Novel": 20,
        };
        const searchDestination = getSearchDestination();
        const url = new URLSearchParams();
        url.set("q", query);
        url.set("type", type);
        if (type === "book" && selectedGenres.length > 0) {
            const genre_ids = selectedGenres.map((g) => genreMap[g]);
            url.set("genre_ids", genre_ids.join(",")); // ✅ Use IDs, not names
        }
        router.push(`/${searchDestination}?${url.toString()}`);
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
                        placeholder="Search books, authors..."
                    />

                    {/* Mobile: Inline Type Selector */}
                    {globalSearch && (
                        <div className="flex items-center space-x-2 sm:space-x-3">
                            <Separator orientation="vertical" className="h-6" />
                            <Select value={type} onValueChange={setType}>
                                <SelectTrigger className="w-24 sm:w-24 border-0 shadow-none text-xs sm:text-sm min-w-fit">
                                    <SelectValue placeholder="Book" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="book">
                                            Book
                                        </SelectItem>
                                        <SelectItem value="reader">
                                            Reader
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>

                {/* Filter Button */}
                {/* Book type */}
                {type === "book" && (
                    <div className="flex gap-2">
                        <Button
                            className="
                flex-1 sm:flex-none sm:min-w-[140px] 
                !h-12 sm:!h-14  // Added ! prefix
                bg-gray-800 hover:bg-gray-700 
                text-xs sm:text-sm
                px-3 sm:px-4
                gap-2
            "
                            type="button"
                            onClick={() => setShowGenreFilter((prev) => !prev)}
                        >
                            <span className="hidden sm:inline">
                                Filter Genre
                            </span>
                            <span className="sm:hidden">Filter</span>
                            <Icon
                                icon="lucide:filter"
                                width="16"
                                height="16"
                                className="sm:w-5 sm:h-5"
                            />
                        </Button>

                        <Button
                            onClick={handleSearch}
                            className="
                sm:hidden flex-shrink-0
                !h-12 !w-12  // Added ! prefix
                bg-blue-600 hover:bg-blue-700
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
            flex-1 sm:flex-none sm:min-w-[140px]
             sm:!h-14  // Changed from h-20 to !h-12, added ! prefix
            bg-black hover:bg-black/60
            text-xs sm:text-sm
            px-4
        "
                    >
                        <span className="hidden sm:inline">Search</span>
                        <Icon
                            icon="lucide:search"
                            width="18"
                            height="18"
                            className="sm:hidden"
                        />
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

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {genreOptions.map((genre) => (
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

                                <div className="flex flex-col sm:flex-row justify-between gap-2 pt-3 border-t">
                                    <Button
                                        variant="outline"
                                        onClick={() => handleClearAllGenres()}
                                        type="button"
                                        size="sm"
                                        className="text-xs sm:text-sm"
                                    >
                                        Clear All
                                    </Button>
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() => {
                                                handleSearch();
                                                setShowGenreFilter(false);
                                            }}
                                            type="button"
                                            size="sm"
                                            className="bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm"
                                        >
                                            Apply Filters
                                        </Button>
                                    </div>
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
                                className="hover:bg-blue-200 rounded-full p-0.5 ml-1"
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
