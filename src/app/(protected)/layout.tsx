import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Ubuntu } from "next/font/google";
import { Providers } from "../provider";
import "../globals.css";
import NavSideBar from "@/components/NavSideBar";
const ubuntuFont = Ubuntu({
    subsets: ["latin"],
    weight: ["300", "400", "500", "700"],
});

export default async function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect("/register");
    }
    return (
        <html lang="en">
            <body className={`${ubuntuFont.className} bg-gray-100 `}>
                <Providers>
                    <NavSideBar>{children}</NavSideBar>
                </Providers>
            </body>
        </html>
    );
}
