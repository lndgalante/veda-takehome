"use client";

import { WagmiProvider } from "wagmi";
import { QueryClientProvider } from "@tanstack/react-query";

// lib
import { config } from "@/lib/wagmi";
import { queryClient } from "@/lib/react-query";

export function RootProvider({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<WagmiProvider config={config}>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</WagmiProvider>
	);
}
