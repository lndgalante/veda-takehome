import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

// styles
import "@rainbow-me/rainbowkit/styles.css";

// internals
import "./globals.css";

// providers
import { RootProvider } from "@/providers/root";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Veda Vault",
	description: "Get your yield on Bitcoin tokens",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased bg-neutral-900`}
			>
				<RootProvider>{children}</RootProvider>
			</body>
		</html>
	);
}
