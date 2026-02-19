import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const viewport: Viewport = {
    themeColor: "#000000",
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false, // Recommended for "App" feel
};

export const metadata: Metadata = {
    title: "Algorithmic Intelligence | AI Solver",
    description: "An interactive playground to visualize classical AI algorithms like A*, Backtracking, and BFS in real-time.",
    keywords: ["AI", "Algorithm Visualizer", "8-Puzzle", "N-Queens", "BFS", "A* Search"],
    manifest: "/manifest.json", // This links your manifest file
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "AI Solver",
    },
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiasing`}>
        {children}
        </body>
        </html>
    );
}