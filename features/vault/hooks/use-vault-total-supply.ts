import { useReadContract } from "wagmi";

// internals
import { BORING_VAULT_ABI } from "../abis/boring-vault";
import { BORING_VAULT_ADDRESS } from "../constants/boring-vault";

export function useVaultTotalSupply() {
  return useReadContract({
    abi: BORING_VAULT_ABI,
    functionName: "totalSupply",
    address: BORING_VAULT_ADDRESS,
  });
}
