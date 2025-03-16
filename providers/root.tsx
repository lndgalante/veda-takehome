"use client";

import { WagmiProvider } from "wagmi";
import { QueryClientProvider } from "@tanstack/react-query";

// lib
import { config } from "@/lib/wagmi";
import { queryClient } from "@/lib/react-query";

// ui
import { TooltipProvider } from "@/components/ui/tooltip";

export function RootProvider({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<WagmiProvider config={config}>
			<QueryClientProvider client={queryClient}>
				<TooltipProvider>{children}</TooltipProvider>
			</QueryClientProvider>
		</WagmiProvider>
	);
}
