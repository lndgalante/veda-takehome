"use client";

import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";

// lib
import { rainbowConfig } from "@/lib/rainbow-kit";
import { queryClient } from "@/lib/react-query";

// ui
import { Toaster } from "@/components/ui/sonner";
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
          <TooltipProvider>
            {children}
            <Toaster />
          </TooltipProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
