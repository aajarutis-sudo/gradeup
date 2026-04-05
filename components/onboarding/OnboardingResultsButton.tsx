"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function OnboardingResultsButton() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = async () => {
        setIsLoading(true);
        try {
            await fetch("/api/auth/onboard", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });
            router.push("/dashboard");
        } catch (error) {
            console.error("Failed to complete onboarding:", error);
            router.push("/dashboard");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleClick}
            disabled={isLoading}
            className="inline-flex rounded-full bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white disabled:opacity-50"
        >
            {isLoading ? "Completing..." : "Go to dashboard"}
        </button>
    );
}
