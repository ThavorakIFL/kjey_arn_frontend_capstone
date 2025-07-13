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
    checkForOverdueAcceptedEvents,
    checkForOverdueReturnEvents,
    checkUserStatus,
} from "@/app/(protected)/home/homepage-action"; // Import here
import StatusChecker from "@/components/StatusChecker";

export default async function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect("/register");
    }

    if (session.backendUserId && session.accessToken) {
        const currentStatus = await checkUserStatus(
            session.backendUserId,
            session.accessToken
        );

        if (currentStatus !== null && currentStatus !== session.status) {
            session.status = currentStatus;
            if (currentStatus === 0) {
                redirect("/ban");
            }
        }
    }

    if (session.status === 0) {
        redirect("/ban");
    }

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
                <StatusChecker />
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
