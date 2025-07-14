import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            profile(profile) {
                return {
                    status: profile.status,
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
        maxAge: 30 * 24 * 60 * 60,
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
        async redirect({ baseUrl }) {
            return `${baseUrl}/home`;
        },
        async signIn({ user }) {
            if (user.email) {
                const emailDomain = user.email.split("@")[1];
                if (emailDomain !== "paragoniu.edu.kh") {
                    return false;
                }
            } else {
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
                const data = await response.json();
                if (response.ok && data.token) {
                    user.status = data.user.status;
                    user.accessToken = data.token;
                    user.tokenExpiresAt = data.expires_at; // Store expiration
                    user.backendUserId = data.user.id;
                    if (data.picture) {
                        user.image = `http://127.0.0.1:8000/${data.user.picture}`;
                    }
                    return true;
                } else {
                    console.error("Failed to post user data:", data);
                    return false;
                }
            } catch (error) {
                console.error("Error posting user data:", error);
                return false;
            }
        },
        async session({ session, token, newSession, trigger }) {
            session.accessToken = token.accessToken as string | undefined;
            session.tokenExpiresAt = token.tokenExpiresAt as string | undefined;
            session.backendUserId = token.backendUserId as string | undefined;
            session.status = token.status as number;
            if (session.user) {
                session.user.image = token.picture as string;
                session.userSubId = token.sub;
            }

            if (trigger === "update" && newSession?.status !== undefined) {
                session.status = newSession.status;
                token.status = newSession.status;
            }

            return session;
        },
        async jwt({ token, user, session, trigger }) {
            if (user) {
                token.accessToken = user.accessToken;
                token.picture = user.image || undefined;
                token.tokenExpiresAt = user.tokenExpiresAt;
                token.backendUserId = user.backendUserId;
                token.status = user.status;
            }

            if (trigger === "update" && session?.status !== undefined) {
                token.status = session.status;
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
