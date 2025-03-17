import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import { z } from "zod";

// schemas
const cbbtcPriceSchema = z.object({
  price_usd: z.number(),
  total_supply: z.number(),
  usd_market_cap: z.number(),
});

// types
type CbbtcPrice = z.infer<typeof cbbtcPriceSchema>;

export function useCbbtcPrice(): UseQueryResult<CbbtcPrice> {
  return useQuery({
    queryKey: ["cbbtc-price"],
    queryFn: async () => {
      const response = await fetch("https://app.ether.fi/api/pricing/cbbtc");
      const data = await response.json();

      return cbbtcPriceSchema.parse(data);
    },
  });
}
