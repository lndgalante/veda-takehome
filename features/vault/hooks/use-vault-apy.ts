import { useEffect } from "react";
import { useDebounceValue } from "usehooks-ts";

// internals
import { BORING_VAULT_ADDRESS } from "../constants/boring-vault";
import { useVaultPerformance } from "./use-vault-performance";

export function useVaultApyPercentage() {
  // vault hooks
  const {
    data: vaultPerformance,
    error: errorVaultPerformance,
    isLoading: isVaultPerformanceLoading,
  } = useVaultPerformance(BORING_VAULT_ADDRESS);

  // debounce hooks
  const [apyRaw, setApyRaw] = useDebounceValue(0, 400);

  // effects
  useEffect(
    function debounceApyPercentage() {
      if (!vaultPerformance) {
        return;
      }

      const { Response } = vaultPerformance;
      const realApy = Response.global_apy_breakdown.real_apy ?? 0;

      setApyRaw(realApy);
    },
    [vaultPerformance, setApyRaw],
  );

  return {
    data: apyRaw,
    error: errorVaultPerformance,
    isLoading: isVaultPerformanceLoading,
  };
}
