import { useReadContract } from "wagmi";

// internals
import { BORING_VAULT_ABI } from "../abis/boring-vault";
import { BORING_VAULT_ADDRESS } from "../constants/boring-vault";

export function useVaultBalanceOf(address: `0x${string}` | undefined) {
  return useReadContract({
    abi: BORING_VAULT_ABI,
    functionName: "balanceOf",
    address: BORING_VAULT_ADDRESS,
    query: { enabled: Boolean(address) },
    args: address ? [address] : undefined,
  });
}
