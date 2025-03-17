"use client";

import { useEffect } from "react";
import { useDebounceValue } from "usehooks-ts";

// internals
import { useVaultBalanceOf } from "./use-vault-balance-of";

// tokens
import { useWbtcPrice } from "@/features/tokens/hooks/wbtc/use-wbtc-price";
import { getSatoshisToBtc } from "@/features/tokens/utils/units";

export function useVaultUserBalance(address: `0x${string}` | undefined) {
  // vault hooks
  const {
    data: vaultBalanceOf,
    error: errorVaultBalanceOf,
    refetch: refetchVaultBalanceOf,
    isLoading: isLoadingVaultBalanceOf,
  } = useVaultBalanceOf(address);

  // wbtc hooks
  const { data: wbtcPrice, error: errorWbtcPrice, isLoading: isWbtcPriceLoading } = useWbtcPrice();

  // debounce hooks
  const [vaultUserBalanceInBtc, setVaultUserBalanceInBtc] = useDebounceValue(0, 400);
  const [vaultUserBalanceInFiat, setVaultUserBalanceInFiat] = useDebounceValue(0, 400);

  // effects
  useEffect(
    function debounceVaultUserBalance() {
      const btcValue = getSatoshisToBtc(vaultBalanceOf ?? BigInt(0));
      const wbtcFiatValue = btcValue * (wbtcPrice?.price_usd ?? 0);

      setVaultUserBalanceInBtc(btcValue);
      setVaultUserBalanceInFiat(wbtcFiatValue);
    },
    [vaultBalanceOf, wbtcPrice, setVaultUserBalanceInBtc, setVaultUserBalanceInFiat],
  );

  // constants
  const errorBalance = errorVaultBalanceOf || errorWbtcPrice;
  const isLoadingBalance = isLoadingVaultBalanceOf || isWbtcPriceLoading;

  return {
    error: errorBalance,
    isLoading: isLoadingBalance,
    refetch: refetchVaultBalanceOf,
    data: {
      btc: vaultUserBalanceInBtc,
      fiat: vaultUserBalanceInFiat,
    },
  };
}
