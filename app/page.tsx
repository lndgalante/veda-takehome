"use client";

import NumberFlow from "@number-flow/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

// lib
import { isDev } from "@/lib/is-dev";

// ui
import { Skeleton } from "@/components/ui/skeleton";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

// vault
import { useVaultTvl } from "@/features/vault/hooks/use-vault-tvl";
import { useVaultApyPercentage } from "@/features/vault/hooks/use-vault-apy";

export default function Home() {
	// vault hooks
	const {
		data: tvlData,
		error: errorTvl,
		isLoading: isLoadingTvl,
	} = useVaultTvl();
	const {
		data: apyData,
		error: errorApy,
		isLoading: isLoadingApy,
	} = useVaultApyPercentage();

	return (
		<main className="container mx-auto px-4 py-8">
			<nav className="flex flex-row justify-between items-center flex-1 mb-6 h-[44px]">
				<h1 className="text-3xl font-bold text-neutral-50">
					Veda Labs - Boring Vault
				</h1>
				<ConnectButton
					label="Connect Wallet"
					accountStatus="address"
					chainStatus={isDev ? "full" : "none"}
				/>
			</nav>

			<div className="flex flex-row gap-3 items-center h-[40px] text-neutral-50 text-2xl font-semibold">
				<div className="flex items-center gap-2">
					<Tooltip>
						<TooltipTrigger asChild>
							<span>TVL</span>
						</TooltipTrigger>
						<TooltipContent side="bottom">
							<p>Total Value Locked</p>
						</TooltipContent>
					</Tooltip>

					{isLoadingTvl ? (
						<Skeleton className="w-[90px] h-[30px] rounded-sm" />
					) : null}

					{errorTvl ? <span>Error loading value</span> : null}

					{!isLoadingTvl && !errorTvl ? (
						<NumberFlow
							willChange
							value={tvlData}
							format={{
								style: "currency",
								currency: "USD",
								notation: "compact",
								compactDisplay: "short",
								maximumFractionDigits: 1,
							}}
							className="w-[90px] h-full"
						/>
					) : null}
				</div>

				<span className="text-neutral-50">·</span>

				<div className="flex items-center gap-2">
					<Tooltip>
						<TooltipTrigger asChild>
							<span>APY</span>
						</TooltipTrigger>
						<TooltipContent side="bottom">
							<p>Annual Percentage Yield</p>
						</TooltipContent>
					</Tooltip>

					{isLoadingApy ? (
						<Skeleton className="w-[54px] h-[30px] rounded-sm" />
					) : null}

					{errorApy ? <span>Error loading value</span> : null}

					{!isLoadingApy && !errorApy ? (
						<NumberFlow
							willChange
							value={apyData}
							format={{ style: "percent", maximumFractionDigits: 1 }}
							className="w-[54px] h-full"
						/>
					) : null}
				</div>
			</div>
		</main>
	);
}
