"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "./ui/toaster";
import { ScrollController, ScrollControllerContext } from "@/hooks/use-scroll-controller";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});

export default function Providers({ children }: { children: React.ReactNode }) {
    /* TODO: Implement theming
    useEffect(() => {
        if (
            localStorage.theme === "dark" ||
            (!("theme" in localStorage) &&
                window.matchMedia("(prefers-color-scheme: dark)").matches)
        ) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, []);
    */
    return (
        <>
            <QueryClientProvider client={queryClient}>
                <ScrollControllerContext.Provider value={new ScrollController()}>
                    {children}
                </ScrollControllerContext.Provider>
                <Toaster />
            </QueryClientProvider>
            <Analytics />
        </>
    );
}
