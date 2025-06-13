import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Providers } from "../provider";
import "../globals.css";
import NavSideBar from "@/components/NavSideBar";

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
            <body>
                <Providers>
                    <NavSideBar>{children}</NavSideBar>
                </Providers>
            </body>
        </html>
    );
}
