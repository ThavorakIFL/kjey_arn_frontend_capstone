"use client";

import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchReaderData } from "./all-reader-action";
import SearchAndFilterBar from "@/components/SearchAndFilterBar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
            const res = await fetchReaderData({ reader: query });
            // Since backend returns array directly, use it as is
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

    return (
        <div className="mb-4 p-8 bg-gradient-to-br from-slate-50 to-blue-50">
            <SearchAndFilterBar />
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-bold">
                    {query ? `Search Results for "${query}"` : "All Readers"}
                </h1>
            </div>

            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && readers.length === 0 && !error && (
                <p>No readers found.</p>
            )}

            <div className="grid grid-cols-7 gap-4">
                {readers.map((reader, index) => (
                    <div
                        onClick={() => {
                            router.push(`/user-profile/${reader.sub}`);
                        }}
                        key={reader.sub || index}
                        className="border p-4 rounded flex flex-col items-center cursor-pointer"
                    >
                        <Avatar className="h-32 w-32">
                            <AvatarImage
                                src={
                                    process.env.NEXT_PUBLIC_IMAGE_PATH! +
                                    reader.picture
                                }
                            />
                            <AvatarFallback>NA</AvatarFallback>
                        </Avatar>
                        <h2 className="font-bold">{reader.name}</h2>
                        <p>{reader.email}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
