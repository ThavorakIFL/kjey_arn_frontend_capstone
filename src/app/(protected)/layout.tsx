// app/(protected)/layout.tsx
import { Toaster } from "@/components/ui/sonner";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Providers } from "../provider";
import "../globals.css";
import NavSideBar from "@/components/NavSideBar";
import {
    checkBorrowEvent,
    checkUnconfirmedMeetups,
    checkUnacceptedBorrowRequests,
} from "@/app/(protected)/home/homepage-action"; // Import here

export default async function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect("/register");
    }

    // Run checks on EVERY protected page load
    try {
        await Promise.all([
            checkBorrowEvent(),
            checkUnconfirmedMeetups(),
            checkUnacceptedBorrowRequests(),
        ]);
    } catch (error) {
        console.error("Background checks failed:", error);
        // Don't block page loading if checks fail
    }

    return (
        <html lang="en">
            <body>
                <Providers>
                    <NavSideBar>{children}</NavSideBar>
                    <Toaster
                        position="bottom-right"
                        expand={true}
                        richColors
                        toastOptions={{
                            style: {
                                background: "white",
                                border: "1px solid #e2e8f0",
                                color: "black",
                            },
                        }}
                    />
                </Providers>
            </body>
        </html>
    );
}
