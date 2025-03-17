import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { z } from "zod";

// schemas
const ethPriceSchema = z.object({
	price_usd: z.number(),
	total_supply: z.number(),
	usd_market_cap: z.number(),
});

// types
type EthPrice = z.infer<typeof ethPriceSchema>;

export function useEthPrice(): UseQueryResult<EthPrice> {
	return useQuery({
		queryKey: ["eth-price"],
		queryFn: async () => {
			const response = await fetch(
				"https://cors-anywhere.herokuapp.com/https://app.ether.fi/api/pricing/eth",
			);
			const data = await response.json();

			return ethPriceSchema.parse(data);
		},
	});
}
