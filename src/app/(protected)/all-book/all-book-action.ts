"use server";

export async function fetchSearchData(query: {
    sub?: string;
    title?: string;
    author?: string;
    genre_ids?: number[] | string;
}) {
    const searchParams = new URLSearchParams();
    if (query.sub) searchParams.append("sub", query.sub);
    if (query.title) searchParams.append("title", query.title);
    if (query.author) searchParams.append("author", query.author);
    if (query.genre_ids) {
        if (Array.isArray(query.genre_ids)) {
            searchParams.append("genre_ids", query.genre_ids.join(","));
        } else {
            searchParams.append("genre_ids", query.genre_ids);
        }
    }

    const res = await fetch(
        `${
            process.env.NEXT_PUBLIC_API_URL
        }books/search?${searchParams.toString()}`,
        {
            cache: "no-store",
        }
    );

    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }
    console.log(res);
    return res.json();
}
