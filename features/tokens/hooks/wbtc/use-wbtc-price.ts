import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { z } from "zod";

// schemas
const wbtcPriceSchema = z.object({
	price_usd: z.number(),
	total_supply: z.number(),
	usd_market_cap: z.number(),
});

// types
type WbtcPrice = z.infer<typeof wbtcPriceSchema>;

export function useWbtcPrice(): UseQueryResult<WbtcPrice> {
	return useQuery({
		queryKey: ["wbtc-price"],
		queryFn: async () => {
			const response = await fetch(
				"https://cors-anywhere.herokuapp.com/https://app.ether.fi/api/pricing/wbtc",
			);
			const data = await response.json();

			return wbtcPriceSchema.parse(data);
		},
	});
}
