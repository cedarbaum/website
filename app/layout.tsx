import Providers from "@/components/providers";
import "@/styles/globals.css";
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Sam Cedarbaum',
    description: 'Sam Cedarbaum\'s personal website',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className="dark:bg-black">
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    )
}