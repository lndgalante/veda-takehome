"use client";

import NumberFlow from "@number-flow/react";

// ui
import { Skeleton } from "@/components/ui/skeleton";

// vault
import { useVaultTvl } from "@/features/vault/hooks/use-vault-tvl";

export default function Home() {
	// vault
	const { data: tvl, isLoading: isLoadingTvl, error: errorTvl } = useVaultTvl();

	return (
		<main className="container mx-auto px-4 py-8">
			<h1 className="text-4xl font-bold text-neutral-50 mb-4">
				Veda Labs - Boring Vault
			</h1>

			{isLoadingTvl ? (
				<Skeleton className="w-[204px] h-[45px] rounded-sm" />
			) : null}

			{errorTvl ? (
				<p className="text-neutral-50 text-4xl font-semibold">
					Error loading TVL
				</p>
			) : null}

			{!isLoadingTvl && !errorTvl ? (
				<div className="text-neutral-50 text-4xl font-semibold">
					TVL{" "}
					<NumberFlow
						willChange
						value={tvl}
						format={{
							style: "currency",
							currency: "USD",
							notation: "compact",
							compactDisplay: "short",
							maximumFractionDigits: 1,
						}}
					/>
				</div>
			) : null}
		</main>
	);
}
