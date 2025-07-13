import { Inter } from "next/font/google";
import "@/app/globals.css";
import { Providers } from "../provider";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { checkUserStatus } from "@/app/(protected)/home/homepage-action";
const interFont = Inter({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
});

export default async function BanLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    // If no session, redirect to register
    if (!session) {
        redirect("/register");
    }

    if (session.backendUserId && session.accessToken) {
        const currentStatus = await checkUserStatus(
            session.backendUserId,
            session.accessToken
        );

        // If we successfully got the status and it's different from session
        if (currentStatus !== null && currentStatus !== session.status) {
            // Update the session status
            session.status = currentStatus;

            // If user is now unsuspended, redirect to home
            if (currentStatus === 1) {
                redirect("/home");
            }
        }
    }

    // If user is active, redirect to home
    if (session.status === 1) {
        redirect("/home");
    }

    // If status === 0, let them see the ban page
    return (
        <Providers>
            <main className="min-h-screen">{children}</main>
        </Providers>
    );
}
