import { Ubuntu } from "next/font/google";
import "@/app/globals.css";
import AuthNavbar from "@/components/AuthNavbar";
import { Providers } from "../provider";
const ubuntuFont = Ubuntu({
    subsets: ["latin"],
    weight: ["300", "400", "500", "700"],
});

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <body className={`${ubuntuFont.className} `}>
            <Providers>
                <main>
                    <div className="m-4">
                        <AuthNavbar />
                        {children}
                    </div>
                </main>
            </Providers>
        </body>
    );
}
