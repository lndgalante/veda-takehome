"use client";

import { useEffect } from "react";
import { useDebounceValue } from "usehooks-ts";

// internals
import { useVaultTotalSupply } from "./use-vault-total-supply";

// tokens
import { useWbtcPrice } from "@/features/tokens/hooks/wbtc/use-wbtc-price";
import { getSatoshisToBtc } from "@/features/tokens/utils/units";

export function useVaultTvl() {
  // vault hooks
  const {
    data: vaultTotalSupply,
    error: errorVaultTotalSupply,
    isLoading: isLoadingVaultTotalSupply,
  } = useVaultTotalSupply();

  // wbtc hooks
  const { data: wbtcPrice, error: errorWbtcPrice, isLoading: isWbtcPriceLoading } = useWbtcPrice();

  // debounce hooks
  const [wbtcFiatValue, setWbtcFiatValue] = useDebounceValue(0, 400);

  // effects
  useEffect(
    function debounceWbtcFiatValue() {
      const btcValue = getSatoshisToBtc(vaultTotalSupply ?? BigInt(0));
      const wbtcFiatValue = btcValue * (wbtcPrice ?? 0);

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
