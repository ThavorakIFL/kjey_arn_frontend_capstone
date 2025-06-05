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
    searchTitle?: string;
    defaultQuery?: string;
    defaultType?: string;
    defaultGenres?: string[];
    onSearch?: (query: string, type: string, genres: string[]) => void;
}

const SearchAndFilterBar: React.FC<SearchAndFilterBarProps> = ({
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
    const [showGenreFilterButton, setShowGenreFilterButton] = useState(false);
    const router = useRouter();

    const getSearchDestination = () => {
        return type === "book" ? "all-book" : "all-reader";
    };

    const toggleGenre = (genre: string) => {
        setSelectedGenres((prev) =>
            prev.includes(genre)
                ? prev.filter((g) => g !== genre)
                : [...prev, genre]
        );
    };
    const dropdownRef = useRef<HTMLDivElement>(null);

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
        <div className="flex flex-col gap-4 mb-4">
            <div
                className={`relative flex items-center space ${
                    type === "book" && "space-x-4"
                }`}
            >
                <div className=" h-14 space-x-4 flex items-center bg-white p-4 rounded-lg  w-full border border-gray-300 ">
                    <Icon icon="lucide:search" />
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        className="w-full focus:outline-none"
                        placeholder="Search..."
                    />
                    <Separator orientation="vertical" />
                    <Select value={type} onValueChange={setType}>
                        <SelectTrigger className="w-24">
                            <SelectValue placeholder="Book" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="book">Book</SelectItem>
                                <SelectItem value="reader">Reader</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                {type === "book" && (
                    <Button
                        className=" max-w-30 h-14 m-0 bg-gray-800 hover:bg-gray-700 cursor-pointer"
                        type="button"
                        onClick={() => setShowGenreFilter((prev) => !prev)}
                    >
                        Filter Genre
                        <Icon icon="lucide:filter" width="24" height="24" />
                    </Button>
                )}
                <div
                    className="absolute w-full flex justify-end top-13 "
                    ref={dropdownRef}
                >
                    {showGenreFilter && (
                        <div className="absolute top-0 mt-2 bg-white border rounded shadow-md z-10 p-4 w-72 max-h-64 overflow-auto">
                            {genreOptions.map((genre) => (
                                <label
                                    key={genre}
                                    className="flex items-center space-x-2 cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedGenres.includes(genre)}
                                        onChange={() => toggleGenre(genre)}
                                    />
                                    <span>{genre}</span>
                                </label>
                            ))}
                            <div className="flex justify-end gap-2 mt-4">
                                <Button
                                    variant="destructive"
                                    onClick={() => setSelectedGenres([])}
                                    type="button"
                                >
                                    Reset
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {selectedGenres.length > 0 && type === "book" && (
                <div className="flex gap-2 flex-wrap">
                    {selectedGenres.map((genre) => (
                        <div
                            key={genre}
                            className="bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm"
                        >
                            {genre}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchAndFilterBar;
