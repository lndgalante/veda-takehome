import { useReadContract } from "wagmi";

// internals
import { boringVaultAbi } from "../abis/boring-vault";
import { BORING_VAULT_ADDRESS } from "../constants/boring-vault";

export function useVaultTotalSupply() {
	return useReadContract({
		abi: boringVaultAbi,
		functionName: "totalSupply",
		address: BORING_VAULT_ADDRESS,
	});
}
