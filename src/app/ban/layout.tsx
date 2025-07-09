import { Inter } from "next/font/google";
import "@/app/globals.css";
import { Providers } from "../provider";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

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

    // If user is active, redirect to home
    if (session.status === 1) {
        redirect("/home");
    }

    // If status === 0, let them see the ban page
    return (
        <body className={interFont.className}>
            <Providers>
                <main className="min-h-screen">{children}</main>
            </Providers>
        </body>
    );
}
