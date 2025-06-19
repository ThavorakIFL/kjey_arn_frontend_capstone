"use client";

import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchReaderData } from "./all-reader-action";
import SearchAndFilterBar from "@/components/SearchAndFilterBar";
import { Users } from "lucide-react";
import UserCard from "@/components/userComponent/UserCard";
import UserCardSkeleton from "@/components/userComponent/UserCardSkeleton";
import EmptyState from "@/components/userComponent/EmptyState";
import ErrorState from "@/components/userComponent/ErrorState";

export default function AllReaderPageClient() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";
    const [readers, setReaders] = useState<any[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const handleSearch = async () => {
        setError("");
        setLoading(true);
        try {
            // Simulate API call with mock data
            await new Promise((resolve) => setTimeout(resolve, 1000));

            const res = await fetchReaderData({ reader: query });

            setReaders(Array.isArray(res) ? res : []);
        } catch (err) {
            setReaders([]);
            setError("Something went wrong.");
            console.error("Search error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleSearch();
    }, [query]);

    const handleUserClick = (reader: { sub: string }) => {
        router.push(`/user-profile/${reader.sub}`);
    };

    const handleRetry = () => {
        handleSearch();
    };

    return (
        <div>
            <div className="container mx-auto px-4 py-8">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="space-y-4">
                        <h1 className="text-2xl font-bold text-gray-900">
                            {query ? `Search Results` : "All Readers"}
                        </h1>

                        <SearchAndFilterBar defaultType="reader" />

                        {query && (
                            <p className="text-gray-600 mt-1">
                                Showing results for{" "}
                                <span className="font-semibold text-blue-700">
                                    "{query}"
                                </span>
                            </p>
                        )}
                    </div>

                    {!loading && !error && (
                        <div className="flex items-center space-x-2 text-sm text-gray-500 mt-4">
                            <Users className="w-4 h-4" />
                            <span>
                                {readers.length}{" "}
                                {readers.length === 1 ? "user" : "users"} found
                            </span>
                        </div>
                    )}
                </div>

                {/* Results Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                    {loading &&
                        Array.from({ length: 12 }).map((_, index) => (
                            <UserCardSkeleton key={index} />
                        ))}

                    {!loading && error && (
                        <ErrorState error={error} onRetry={handleRetry} />
                    )}

                    {!loading && !error && readers.length === 0 && (
                        <EmptyState query={query} />
                    )}

                    {!loading &&
                        !error &&
                        readers.length > 0 &&
                        readers.map((reader, index) => (
                            <UserCard
                                key={reader.sub || index}
                                reader={reader}
                                onClick={() => handleUserClick(reader)}
                            />
                        ))}
                </div>
            </div>
        </div>
    );
}
