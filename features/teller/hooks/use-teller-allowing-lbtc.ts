// internals
import { useTellerAssetData } from "./use-teller-asset-data";

// constants
import { BTC_DERIVATED_TOKENS } from "@/features/tokens/constants/tokens";

export function useTellerAllowingLbtc() {
	return useTellerAssetData(BTC_DERIVATED_TOKENS.LBTC.address);
}
