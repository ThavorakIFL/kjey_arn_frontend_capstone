import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            profile(profile) {
                return {
                    id: profile.sub,
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture,
                };
            },
        }),
    ],
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    cookies: {
        sessionToken: {
            name: `next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: process.env.NODE_ENV === "production",
            },
        },
    },
    callbacks: {
        async redirect({ url, baseUrl }) {
            return `${baseUrl}/home`;
        },
        async signIn({ user, account, profile }) {
            if (user.email) {
                const emailDomain = user.email.split("@")[1];
                if (emailDomain !== "paragoniu.edu.kh") {
                    console.log("Domain restriction failed: ", emailDomain);
                    return false;
                }
            } else {
                console.log("No Email Available for user.");
                return false;
            }
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}login-user`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            email: user.email,
                            name: user.name,
                            sub: user.id,
                            picture: user.image,
                        }),
                    }
                );
                console.log(user.image);
                const data = await response.json();
                if (response.ok && data.token) {
                    console.log("User data posted successfully:", data);
                    console.log("User picture value:", data.user.picture);
                    user.accessToken = data.token;
                    console.log("User access token:", user.accessToken);
                    if (data.picture) {
                        user.image = `http://127.0.0.1:8000/${data.user.picture}`;
                    }
                    return true;
                }
                return false;
            } catch (error) {
                console.error("Error posting user data:", error);
                return false;
            }
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken as string | undefined;

            if (session.user) {
                session.user.image = token.picture as string;
                session.userSubId = token.sub;
            }

            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = user.accessToken;
                token.picture = user.image;
            }
            return token;
        },
    },
    pages: {
        error: "auth/error",
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === "development",
};
