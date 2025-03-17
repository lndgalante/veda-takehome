import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import { z } from "zod";

// schemas
const vaultPerformanceResponseSchema = z.object({
  Response: z.object({
    aggregation_period: z.string(),
    apy: z.number(),
    chain_allocation: z.object({ ethereum: z.number() }),
    fees: z.number(),
    global_apy_breakdown: z.object({
      fee: z.number(),
      maturity_apy: z.number(),
      real_apy: z.number(),
    }),
    maturity_apy_breakdown: z.array(z.unknown()),
    real_apy_breakdown: z.array(
      z.object({
        allocation: z.number(),
        apy: z.number(),
        chain: z.string(),
        protocol: z.string(),
      }),
    ),
    timestamp: z.string(),
  }),
});

// types
type VaultPerformanceResponse = z.infer<typeof vaultPerformanceResponseSchema>;

export function useVaultPerformance(vaultAddress: string): UseQueryResult<VaultPerformanceResponse> {
  return useQuery({
    queryKey: ["vault-performance", vaultAddress],
    queryFn: async () => {
      const response = await fetch(`https://api.sevenseas.capital/etherfi/ethereum/performance/${vaultAddress}`);
      const data = await response.json();

      return vaultPerformanceResponseSchema.parse(data);
    },
  });
}
