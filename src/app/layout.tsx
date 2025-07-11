import "./globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Kjey Arn",
    icons: {
        icon: "/kjeyarn-logo.png",
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
