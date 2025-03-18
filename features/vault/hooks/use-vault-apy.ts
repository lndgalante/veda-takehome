import { useEffect, useState } from "react";
import { useDebounceValue } from "usehooks-ts";

// internals
import { BORING_VAULT_ADDRESS } from "../constants/boring-vault";
import { useVaultPerformance } from "./use-vault-performance";

// types
type BreakdownApy = {
  realApy: number;
  maturityApy: number;
};

export function useVaultApy() {
  // vault hooks
  const {
    data: vaultPerformance,
    error: errorVaultPerformance,
    isLoading: isVaultPerformanceLoading,
  } = useVaultPerformance(BORING_VAULT_ADDRESS);

  // react hooks
  const [breakdownApyPercentages, setBreakdownApyPercentages] = useState<BreakdownApy>({
    realApy: 0,
    maturityApy: 0,
  });

  // debounce hooks
  const [totalApy, setTotalApy] = useDebounceValue(0, 400);

  // effects
  useEffect(
    function debounceApyPercentage() {
      if (!vaultPerformance) {
        return;
      }

      const { global_apy_breakdown } = vaultPerformance.Response;

      const realApy = global_apy_breakdown.real_apy ?? 0;
      const maturityApy = global_apy_breakdown.maturity_apy ?? 0;

      const combinedApy = realApy + maturityApy;

      setTotalApy(combinedApy);
      setBreakdownApyPercentages({
        realApy: Number((realApy * 100).toFixed(2)),
        maturityApy: Number((maturityApy * 100).toFixed(2)),
      });
    },
    [vaultPerformance, setTotalApy],
  );

  return {
    error: errorVaultPerformance,
    isLoading: isVaultPerformanceLoading,
    data: { totalApy, breakdownApyPercentages },
  };
}
