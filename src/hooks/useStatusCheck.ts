import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export function useStatusCheck() {
    const { data: session, update } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    useEffect(() => {
        if (!session?.backendUserId || !session?.accessToken) return;

        const checkStatus = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}check-user-status/${session.backendUserId}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${session.accessToken}`,
                        },
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    const currentStatus = data.status;

                    if (currentStatus !== session.status) {
                        await update({ status: currentStatus });

                        if (currentStatus === 0) {
                            router.push("/ban");
                        } else if (currentStatus === 1) {
                            router.push("/home");
                        }
                    }
                }
            } catch (error) {
                console.error("Status check failed:", error);
            }
        };

        // Only check once when session loads
        checkStatus();
    }, [
        session?.backendUserId,
        session?.accessToken,
        session?.status,
        update,
        router,
        pathname,
    ]);
}
