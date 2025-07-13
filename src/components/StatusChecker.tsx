// components/StatusChecker.tsx
"use client";

import { useStatusCheck } from "@/hooks/useStatusCheck";

export default function StatusChecker() {
    // Check user status every 30 seconds
    useStatusCheck();
    return null; // This component doesn't render anything
}
