// app/(protected)/layout.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Providers } from "../provider";
import "../globals.css";
import NavSideBar from "@/components/NavSideBar";
import {
    checkBorrowEvent,
    checkUnconfirmedMeetups,
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
        await Promise.all([checkBorrowEvent(), checkUnconfirmedMeetups()]);
    } catch (error) {
        console.error("Background checks failed:", error);
        // Don't block page loading if checks fail
    }

    return (
        <html lang="en">
            <body>
                <Providers>
                    <NavSideBar>{children}</NavSideBar>
                </Providers>
            </body>
        </html>
    );
}
