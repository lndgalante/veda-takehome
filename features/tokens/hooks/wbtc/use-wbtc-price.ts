import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import { z } from "zod";

// internals
import { BTC_DERIVATED_TOKENS } from "../../constants/tokens";

// lib
import { getAlchemyApiKey } from "@/lib/alchemy";

// schemas
const wbtcPriceSchema = z.object({
  data: z.array(
    z.object({
      symbol: z.string(),
      prices: z.array(
        z.object({
          currency: z.string(),
          value: z.string(),
          lastUpdatedAt: z.string(),
        }),
      ),
    }),
  ),
});

export function useWbtcPrice(): UseQueryResult<number> {
  return useQuery({
    queryKey: ["wbtc-price"],
    queryFn: async () => {
      const response = await fetch(
        `https://api.g.alchemy.com/prices/v1/${getAlchemyApiKey()}/tokens/by-symbol?symbols=${BTC_DERIVATED_TOKENS.WBTC.label}`,
      );

      const data = await response.json();
      const parsedData = wbtcPriceSchema.parse(data);

      const price = Number(parsedData.data[0].prices[0].value);

      return price;
    },
  });
}
