"use client";

import { useAccount } from "wagmi";
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
import { useVaultUserBalance } from "@/features/vault/hooks/use-vault-user-balance";

// constants
const DEMO_ADDRESS_FOR_TESTING = "0xD50e208b3D89eC1b74303e3365404bD8736E5BA3";

export default function Home() {
	// wallet hooks
	const { address } = useAccount();

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

	const {
		data: userBalance,
		error: errorUserBalance,
		isLoading: isLoadingUserBalance,
	} = useVaultUserBalance(DEMO_ADDRESS_FOR_TESTING);

	return (
		<main className="container mx-auto px-4 py-8">
			<nav className="flex flex-row justify-between items-center flex-1 mb-3 h-[44px]">
				<h1 className="text-3xl font-bold text-neutral-50">
					Veda Labs - Boring Vault
				</h1>
				<ConnectButton
					label="Connect Wallet"
					accountStatus="address"
					chainStatus={isDev ? "full" : "none"}
				/>
			</nav>

			<section className="flex flex-row gap-3 items-center h-[40px] text-neutral-50 text-2xl font-semibold mb-12">
				<article className="flex items-center gap-2">
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

					{errorTvl ? (
						<Tooltip>
							<TooltipTrigger asChild>
								<span>Error</span>
							</TooltipTrigger>
							<TooltipContent side="bottom">
								<p>Try again later</p>
							</TooltipContent>
						</Tooltip>
					) : null}

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
				</article>
				<span className="text-neutral-50">·</span>
				<article className="flex items-center gap-2">
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

					{errorApy ? (
						<Tooltip>
							<TooltipTrigger asChild>
								<span>Error</span>
							</TooltipTrigger>
							<TooltipContent side="bottom">
								<p>Try again later</p>
							</TooltipContent>
						</Tooltip>
					) : null}

					{!isLoadingApy && !errorApy ? (
						<NumberFlow
							willChange
							value={apyData}
							format={{ style: "percent", maximumFractionDigits: 1 }}
							className="w-[54px] h-full"
						/>
					) : null}
				</article>
			</section>

			{address ? (
				<section className="flex flex-row gap-3 items-center h-[40px] text-neutral-50 text-2xl font-semibold">
					<article className="flex items-center gap-2">
						<Tooltip>
							<TooltipTrigger asChild>
								<span>Vault Balance</span>
							</TooltipTrigger>
							<TooltipContent side="bottom">
								<p>Amount of liquidBTC you own</p>
							</TooltipContent>
						</Tooltip>

						{isLoadingUserBalance ? (
							<div className="flex flex-row gap-2">
								<Skeleton className="w-[80px] h-[30px] rounded-sm" />
							</div>
						) : null}

						{errorUserBalance ? (
							<Tooltip>
								<TooltipTrigger asChild>
									<span>Error</span>
								</TooltipTrigger>
								<TooltipContent side="bottom">
									<p>Try again later</p>
								</TooltipContent>
							</Tooltip>
						) : null}

						{!isLoadingUserBalance && !errorUserBalance ? (
							<Tooltip>
								<TooltipTrigger asChild>
									<NumberFlow
										willChange
										value={userBalance.fiat}
										format={{ style: "currency", currency: "USD" }}
									/>
								</TooltipTrigger>
								<TooltipContent side="bottom">
									<NumberFlow
										willChange
										value={userBalance.btc}
										format={{ maximumFractionDigits: 8 }}
										prefix="₿"
									/>
								</TooltipContent>
							</Tooltip>
						) : null}
					</article>
				</section>
			) : null}
		</main>
	);
}
