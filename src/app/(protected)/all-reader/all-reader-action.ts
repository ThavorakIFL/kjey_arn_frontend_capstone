"use server";

export async function fetchReaderData({ reader }: { reader?: string }) {
    const searchParams = new URLSearchParams();
    if (reader) searchParams.append("query", reader);
    const res = await fetch(
        `${
            process.env.NEXT_PUBLIC_API_URL
        }users/search?${searchParams.toString()}`,
        {
            cache: "no-store",
        }
    );

    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }
    return res.json();
}
