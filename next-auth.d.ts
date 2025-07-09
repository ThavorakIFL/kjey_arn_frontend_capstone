// next-auth.d.ts
import "next-auth";

declare module "next-auth" {
    interface Session {
        status: number;
        accessToken?: string;
        userSubId?: string;
        tokenExpiresAt?: string;
        backendUserId?: string;
    }

    interface User {
        status: number;
        accessToken?: string;
        tokenExpiresAt?: string;
        backendUserId?: string;
    }
}
declare module "next-auth/jwt" {
    interface JWT {
        status: number;
        accessToken?: string;
        tokenExpiresAt?: string;
        backendUserId?: string;
        picture?: string;
    }
}
