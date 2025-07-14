"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import HistoryPageClient from "./HistoryPageClient";
import { fetchUserHistoryBorrowEventData } from "./history-action";
import { BorrowEvent as BorrowEventType } from "@/types/borrow-event";

interface PaginationData {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    has_more_pages: boolean;
}

export default function HistoryPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Get URL parameters
    const currentPage = parseInt(searchParams.get("page") || "1");
    const currentStatus = searchParams.get("status") || "all";

    // State management
    const [historyData, setHistoryData] = useState<BorrowEventType[]>([]);
    const [pagination, setPagination] = useState<PaginationData>({
        current_page: 1,
        last_page: 1,
        per_page: 12,
        total: 0,
        from: null,
        to: null,
        has_more_pages: false,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch data function
    const fetchData = async (page: number = 1, status: string = "all") => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await fetchUserHistoryBorrowEventData({
                page,
                status,
                per_page: 12,
            });

            if (result.success) {
                setHistoryData(result.data);
                if (result.pagination) {
                    setPagination(result.pagination);
                }
            } else {
                setError(result.error);
                setHistoryData([]);
                setPagination({
                    current_page: 1,
                    last_page: 1,
                    per_page: 12,
                    total: 0,
                    from: null,
                    to: null,
                    has_more_pages: false,
                });
            }
        } catch (err) {
            setError("An unexpected error occurred");
            setHistoryData([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle page change
    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", page.toString());

        // Update URL without page reload
        router.push(`?${params.toString()}`, { scroll: false });

        // Fetch new data
        fetchData(page, currentStatus);
    };

    // Handle status filter change
    const handleStatusFilter = (status: string) => {
        const params = new URLSearchParams();
        params.set("page", "1"); // Reset to first page when filtering

        if (status !== "all") {
            params.set("status", status);
        }

        // Update URL
        router.push(`?${params.toString()}`, { scroll: false });

        // Fetch new data
        fetchData(1, status);
    };

    // Initial data fetch and URL parameter changes
    useEffect(() => {
        fetchData(currentPage, currentStatus);
    }, []); // Only run on component mount

    // Listen for URL changes (back/forward navigation)
    useEffect(() => {
        const handlePopState = () => {
            const newPage = parseInt(searchParams.get("page") || "1");
            const newStatus = searchParams.get("status") || "all";
            fetchData(newPage, newStatus);
        };

        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, [searchParams]);

    return (
        <HistoryPageClient
            historyBorrowEventData={historyData}
            pagination={pagination}
            error={error}
            isLoading={isLoading}
            currentStatus={currentStatus}
            onPageChange={handlePageChange}
            onStatusFilter={handleStatusFilter}
        />
    );
}
