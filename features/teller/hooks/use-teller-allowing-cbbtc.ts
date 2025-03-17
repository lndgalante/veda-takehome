// internals
import { useTellerAssetData } from "./use-teller-asset-data";

// tokens
import { BTC_DERIVATED_TOKENS } from "@/features/tokens/constants/tokens";

export function useTellerAllowingCbBtc() {
  return useTellerAssetData(BTC_DERIVATED_TOKENS.CBBTC.address);
}
