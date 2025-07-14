// "use server";

// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
// import { redirect } from "next/navigation";

// export async function getOtherUserProfile(id: string) {
//     const session = await getServerSession(authOptions);

//     try {
//         const response = await fetch(
//             `${process.env.NEXT_PUBLIC_API_URL}user-profile/${id}`
//         );
//         if (!response.ok) {
//             throw new Error("Failed to fetch profile");
//         }
//         const profile = await response.json();
//         if (profile.sub === session?.userSubId) {
//             redirect("/my-profile");
//         }
//         return profile;
//     } catch (error) {
//         console.error("Error fetching user profile", error);
//         throw error;
//     }
// }

// export async function getOtherUserBooks(sub: string) {
//     try {
//         const response = await fetch(
//             `${process.env.NEXT_PUBLIC_API_URL}user-profile/${sub}/get-books`,
//             {
//                 method: "GET",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 cache: "no-store",
//             }
//         );

//         const data = await response.json();

//         // Handle successful response
//         if (response.ok) {
//             return {
//                 success: true,
//                 message: data.message || "Books retrieved successfully",
//                 data: data.data || [],
//             };
//         }

//         // Handle the "No books found" case - return empty array instead of throwing
//         if (data.message === "No books found for this user") {
//             return {
//                 success: false,
//                 message: "No books found for this user",
//                 data: [],
//             };
//         }

//         // Handle other error cases
//         throw new Error(data.message || "Failed to fetch user books");
//     } catch (error) {
//         console.error("Error fetching user books", error);
//         return {
//             success: false,
//             message:
//                 error instanceof Error
//                     ? error.message
//                     : "Unknown error occurred",
//             data: [],
//         };
//     }
// }
// user-profile-action.ts
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export async function getOtherUserProfile(id: string) {
    const session = await getServerSession(authOptions);

    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}user-profile/${id}`
        );

        if (!response.ok) {
            if (response.status === 404) {
                return {
                    success: false,
                    message: "User not found",
                    data: null,
                };
            }
            return {
                success: false,
                message: "Failed to fetch profile",
                data: null,
            };
        }

        const profile = await response.json();

        // Handle redirect case
        if (profile.sub === session?.userSubId) {
            redirect("/my-profile");
        }

        return {
            success: true,
            message: "Profile retrieved successfully",
            data: profile,
        };
    } catch (error) {
        console.error("Error fetching user profile", error);
        return {
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred",
            data: null,
        };
    }
}

export async function getOtherUserBooks(sub: string) {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}user-profile/${sub}/get-books`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                cache: "no-store",
            }
        );

        const data = await response.json();

        // Handle successful response
        if (response.ok) {
            return {
                success: true,
                message: data.message || "Books retrieved successfully",
                data: data.data || [],
            };
        }

        // Handle the "No books found" case - return empty array instead of throwing
        if (data.message === "No books found for this user") {
            return {
                success: true, // Changed to true since this is a valid state
                message: "No books found for this user",
                data: [],
            };
        }

        // Handle other error cases - return error response instead of throwing
        return {
            success: false,
            message: data.message || "Failed to fetch user books",
            data: [],
        };
    } catch (error) {
        console.error("Error fetching user books", error);
        return {
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred",
            data: [],
        };
    }
}
