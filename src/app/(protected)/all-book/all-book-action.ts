"use server";

// Utility function for delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Exponential backoff retry function
async function fetchWithRetry(
    url: string,
    options: RequestInit = {},
    maxRetries = 3
): Promise<Response> {
    let lastError: Error;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            const response = await fetch(url, options);

            // If it's a 429, wait before retrying
            if (response.status === 429 && attempt < maxRetries) {
                const retryAfter = response.headers.get("Retry-After");
                const waitTime = retryAfter
                    ? parseInt(retryAfter) * 1000
                    : Math.pow(2, attempt) * 1000;

                console.log(
                    `Rate limited, waiting ${waitTime}ms before retry ${
                        attempt + 1
                    }/${maxRetries}`
                );
                await delay(waitTime);
                continue;
            }

            return response;
        } catch (error) {
            lastError = error as Error;

            if (attempt < maxRetries) {
                const waitTime = Math.pow(2, attempt) * 1000; // Exponential backoff
                console.log(
                    `Request failed, waiting ${waitTime}ms before retry ${
                        attempt + 1
                    }/${maxRetries}`
                );
                await delay(waitTime);
            }
        }
    }

    throw lastError!;
}

export async function fetchSearchData(query: {
    sub?: string;
    title?: string;
    author?: string;
    genre_ids?: number[] | string;
    page?: number;
    per_page?: number;
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

    // Add pagination parameters
    if (query.page) searchParams.append("page", query.page.toString());
    if (query.per_page)
        searchParams.append("per_page", query.per_page.toString());

    const url = `${
        process.env.NEXT_PUBLIC_API_URL
    }books/search?${searchParams.toString()}`;

    try {
        const res = await fetchWithRetry(url, {
            cache: "no-store",
            headers: {
                "Content-Type": "application/json",
                // Add any authentication headers if needed
                // 'Authorization': `Bearer ${token}`,
            },
        });

        if (!res.ok) {
            console.log("Failed to fetch data:", res.status, res.statusText);

            // Return a more specific error message for 429
            if (res.status === 429) {
                throw new Error(
                    "Rate limit exceeded. Please try again in a moment."
                );
            }

            throw new Error(
                `Failed to fetch data: ${res.status} ${res.statusText}`
            );
        }

        return res.json();
    } catch (error) {
        console.error("Error in fetchSearchData:", error);
        throw error;
    }
}
