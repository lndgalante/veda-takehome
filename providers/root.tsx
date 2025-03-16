"use client";

import { WagmiProvider } from "wagmi";
import { QueryClientProvider } from "@tanstack/react-query";
import { darkTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";

// lib
import { queryClient } from "@/lib/react-query";
import { rainbowConfig } from "@/lib/rainbow-kit";

// ui
import { TooltipProvider } from "@/components/ui/tooltip";

export function RootProvider({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<WagmiProvider config={rainbowConfig}>
			<QueryClientProvider client={queryClient}>
				<RainbowKitProvider
					locale="en-US"
					modalSize="compact"
					theme={darkTheme({
						overlayBlur: "small",
						borderRadius: "small",
						accentColor: "#FE5418",
						accentColorForeground: "#171717",
					})}
				>
					<TooltipProvider>{children}</TooltipProvider>
				</RainbowKitProvider>
			</QueryClientProvider>
		</WagmiProvider>
	);
}
