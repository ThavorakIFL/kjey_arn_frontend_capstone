// next-auth.d.ts
import "next-auth";

declare module "next-auth" {
    interface Session {
        accessToken?: string;
        userSubId?: string;
        tokenExpiresAt?: string;
        backendUserId?: string;
    }

    interface User {
        accessToken?: string;
        tokenExpiresAt?: string;
        backendUserId?: string;
    }
}
declare module "next-auth/jwt" {
    interface JWT {
        accessToken?: string;
        tokenExpiresAt?: string;
        backendUserId?: string;
        picture?: string;
    }
}
