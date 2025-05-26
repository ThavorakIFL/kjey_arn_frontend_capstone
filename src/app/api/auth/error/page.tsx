// app/auth/error/page.tsx
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ErrorContent() {
    const searchParams = useSearchParams();
    const error = searchParams.get("error");

    let errorMessage = "An error occurred during authentication.";

    // Handle different error types
    if (error === "AccessDenied") {
        errorMessage =
            "Only users with @paragoniu.edu.kh email addresses are allowed to access this application.";
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                <h1 className="mb-6 text-2xl font-bold text-center text-red-600">
                    Access Denied
                </h1>
                <div className="p-4 mb-6 text-red-700 bg-red-100 border border-red-200 rounded-md">
                    {errorMessage}
                </div>
                <div className="flex justify-center">
                    <Link
                        href="/"
                        className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                    >
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function ErrorPage() {
    return (
        <Suspense
            fallback={
                <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                    <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                        <div className="text-center">Loading...</div>
                    </div>
                </div>
            }
        >
            <ErrorContent />
        </Suspense>
    );
}
