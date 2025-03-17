import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { z } from "zod";

// schemas
const lbtcPriceSchema = z.object({
	price_usd: z.number(),
	total_supply: z.number(),
	usd_market_cap: z.number(),
});

// types
type LbtcPrice = z.infer<typeof lbtcPriceSchema>;

export function useLbtcPrice(): UseQueryResult<LbtcPrice> {
	return useQuery({
		queryKey: ["lbtc-price"],
		queryFn: async () => {
			const response = await fetch(
				"https://cors-anywhere.herokuapp.com/https://app.ether.fi/api/pricing/lbtc",
			);
			const data = await response.json();

			return lbtcPriceSchema.parse(data);
		},
	});
}
