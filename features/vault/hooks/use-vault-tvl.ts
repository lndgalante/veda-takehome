"use client";

import { useEffect } from "react";
import { useDebounceValue } from "usehooks-ts";

// internals
import { useVaultTotalSupply } from "./use-vault-total-supply";

// wbtc
import { getSatoshisToBtc } from "@/features/prices/utils/units";
import { useWbtcPrice } from "@/features/prices/hooks/use-wbtc-price";

export function useVaultTvl() {
	// vault hooks
	const {
		data: vaultTotalSupply,
		error: errorVaultTotalSupply,
		isLoading: isLoadingVaultTotalSupply,
	} = useVaultTotalSupply();

	// wbtc hooks
	const {
		data: wbtcPrice,
		error: errorWbtcPrice,
		isLoading: isWbtcPriceLoading,
	} = useWbtcPrice();

	// debounce hooks
	const [wbtcFiatValue, setWbtcFiatValue] = useDebounceValue(0, 400);

	// effects
	useEffect(
		function debounceWbtcFiatValue() {
			const btcValue = getSatoshisToBtc(vaultTotalSupply ?? BigInt(0));
			const wbtcFiatValue = btcValue * (wbtcPrice?.price_usd ?? 0);

			setWbtcFiatValue(wbtcFiatValue);
		},
		[vaultTotalSupply, wbtcPrice, setWbtcFiatValue],
	);

	// constants
	const errorTvl = errorVaultTotalSupply || errorWbtcPrice;
	const isLoadingTvl = isLoadingVaultTotalSupply || isWbtcPriceLoading;

	return {
		error: errorTvl,
		data: wbtcFiatValue,
		isLoading: isLoadingTvl,
	};
}
