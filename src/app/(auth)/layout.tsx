// AuthLayout.jsx
import { Inter } from "next/font/google";
import "@/app/globals.css";
import AuthNavbar from "@/components/AuthNavbar";
import { Providers } from "../provider";

const interFont = Inter({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
});

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <body className={interFont.className}>
            <Providers>
                <main className="bg-gray-50 min-h-screen">
                    <AuthNavbar />
                    <div className="pt-20">{children}</div>
                </main>
            </Providers>
        </body>
    );
}
