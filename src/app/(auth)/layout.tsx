// AuthLayout.jsx
import { Inter } from "next/font/google";
import "@/app/globals.css";
import AuthNavbar from "@/components/AuthNavbar";
import { Providers } from "../provider";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

const interFont = Inter({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
});

export default async function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);
    if (session) {
        redirect("/home");
    }

    return (
        <body className={interFont.className}>
            <Providers>
                <main className="min-h-screen">
                    <AuthNavbar />
                    <div className="pt-20">{children}</div>
                </main>
            </Providers>
        </body>
    );
}
