import { useBalance } from "wagmi";

// internals
import { BTC_DERIVATED_TOKENS } from "../../constants/tokens";

export function useEbtcBalance(address: `0x${string}` | undefined) {
	return useBalance({
		address,
		query: { enabled: !!address },
		token: BTC_DERIVATED_TOKENS.EBTC.address,
	});
}
