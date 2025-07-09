// app/(protected)/layout.tsx
import { Toaster } from "@/components/ui/sonner";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Providers } from "../provider";
import "../globals.css";
import kjeyarnlogo from "@/assets/kjeyarnlogo.png";
import NavSideBar from "@/components/NavSideBar";
import {
    checkBorrowEvent,
    checkUnconfirmedMeetups,
    checkUnacceptedBorrowRequests,
    checkForOverdueAcceptedEvents,
    checkForOverdueReturnEvents,
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

    if (session.status === 0) {
        redirect("/ban");
    }

    // Only run background checks if user is active (status === 1)
    if (session.status === 1) {
        try {
            await Promise.all([
                checkBorrowEvent(),
                checkUnconfirmedMeetups(),
                checkUnacceptedBorrowRequests(),
                checkForOverdueAcceptedEvents(),
                checkForOverdueReturnEvents(),
            ]);
        } catch (error) {
            console.error("Background checks failed:", error);
        }
    }

    return (
        <div>
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
        </div>
    );
}
