"use server";

export async function fetchReaderData({
    reader,
    page,
    per_page,
}: {
    reader?: string;
    page?: number;
    per_page?: number;
}) {
    const searchParams = new URLSearchParams();

    // Add search query if provided
    if (reader && reader.trim() !== "") {
        searchParams.append("query", reader);
    }

    // Add pagination parameters
    if (page) searchParams.append("page", page.toString());
    if (per_page) searchParams.append("per_page", per_page.toString());

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
