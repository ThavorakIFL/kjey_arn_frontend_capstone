"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export function AuthButton() {
    const { data: session } = useSession();

    const handleLogout = async () => {
        // ✅ Clear localStorage or custom user state
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        // If using context, call context reset here

        // ✅ Then sign out from NextAuth
        await signOut({
            callbackUrl: "/", // Optional: redirect to homepage or login page
        });
    };

    if (session) {
        return (
            <div>
                <p>Signed in as {session.user?.email}</p>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
                >
                    Sign out
                </button>
            </div>
        );
    }

    return (
        <button
            className="cursor-pointer bg-black hover:bg-black/60 transition-all 
            duration-300  ease-in-out  text-center  
            text-white font-bold py-2 px-4 rounded"
            onClick={() => signIn("google")}
        >
            Sign in with Google
        </button>
    );
}
