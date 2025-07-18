"use client";

import { useRouter } from "next/navigation";
import { useSearchParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchReaderData } from "./all-reader-action";
import SearchAndFilterBar from "@/components/SearchAndFilterBar";
import { Users } from "lucide-react";
import UserCard from "@/components/userComponent/UserCard";
import UserCardSkeleton from "@/components/userComponent/UserCardSkeleton";
import EmptyState from "@/components/userComponent/EmptyState";
import ErrorState from "@/components/userComponent/ErrorState";
import Pagination from "@/components/Pagination";

interface PaginationData {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    has_more_pages: boolean;
}

export default function AllReaderPageClient() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const query = searchParams.get("q") || "";
    const currentPage = parseInt(searchParams.get("page") || "1");
    const perPage = parseInt(searchParams.get("per_page") || "18");

    const [readers, setReaders] = useState<any[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState<PaginationData | null>(null);

    const updateURLParams = (newPage?: number, newPerPage?: number) => {
        const params = new URLSearchParams(searchParams.toString());

        if (newPage !== undefined) {
            if (newPage === 1) {
                params.delete("page");
            } else {
                params.set("page", newPage.toString());
            }
        }

        if (newPerPage !== undefined) {
            if (newPerPage === 14) {
                params.delete("per_page"); // Remove parameter when using default value
            } else {
                params.set("per_page", newPerPage.toString());
            }
        }

        const newURL = `${pathname}?${params.toString()}`;
        router.push(newURL, { scroll: false });
    };

    const handleSearch = async (page: number = currentPage) => {
        setError("");
        setLoading(true);

        try {
            const res = await fetchReaderData({
                reader: query,
                page,
                per_page: perPage,
            });

            if (res.success) {
                setReaders(res.data.users);
                setPagination(res.data.pagination);
            } else {
                setReaders([]);
                setPagination(null);
                setError(res.message || "Something went wrong.");
            }
        } catch (err) {
            setReaders([]);
            setPagination(null);
            setError("Something went wrong.");
            console.error("Search error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleSearch(currentPage);
    }, [query, currentPage, perPage]);

    const handleUserClick = (reader: { sub: string }) => {
        router.push(`/user-profile/${reader.sub}`);
    };

    const handleRetry = () => {
        handleSearch(currentPage);
    };

    const handlePageChange = (page: number) => {
        updateURLParams(page);
        // Scroll to top of results when changing pages
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handlePerPageChange = (newPerPage: number) => {
        updateURLParams(1, newPerPage); // Reset to page 1 when changing per page
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen px-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-sm sm:text-base text-gray-600">
                        Loading all users...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div>
                {/* Header Section */}
                <div className="mb-8">
                    <div className="space-y-4">
                        <SearchAndFilterBar defaultType="reader" />
                        <div className="flex  sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-semibold text-gray-900">
                                    {query ? `Search Results` : "All Readers"}
                                </h1>
                                {query && (
                                    <p className="text-gray-600 mt-1">
                                        Showing results for{" "}
                                        <span className="font-semibold text-blue-primaryBlue">
                                            "{query}"
                                        </span>
                                    </p>
                                )}
                            </div>
                        </div>

                        {!loading && !error && pagination && (
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <Users className="w-4 h-4" />
                                <span>
                                    {pagination.total}{" "}
                                    {pagination.total === 1 ? "user" : "users"}{" "}
                                    found
                                    {pagination.total > pagination.per_page && (
                                        <span className="ml-1">
                                            (page {pagination.current_page} of{" "}
                                            {pagination.last_page})
                                        </span>
                                    )}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Results Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                    {!loading && error && (
                        <div className="col-span-full">
                            <ErrorState error={error} onRetry={handleRetry} />
                        </div>
                    )}

                    {!loading && !error && readers.length === 0 && (
                        <div className="col-span-full">
                            <EmptyState query={query} />
                        </div>
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

                {/* Pagination */}
                {!loading &&
                    !error &&
                    pagination &&
                    pagination.last_page > 1 && (
                        <Pagination
                            pagination={pagination}
                            onPageChange={handlePageChange}
                            loading={loading}
                        />
                    )}
            </div>
        </div>
    );
}
