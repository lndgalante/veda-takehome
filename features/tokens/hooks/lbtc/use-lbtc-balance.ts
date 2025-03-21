import { useBalance } from "wagmi";

// internals
import { BTC_DERIVATED_TOKENS } from "../../constants/tokens";

export function useLbtcBalance(address: `0x${string}` | undefined) {
  return useBalance({
    address,
    query: { enabled: Boolean(address) },
    token: BTC_DERIVATED_TOKENS.LBTC.address,
  });
}
