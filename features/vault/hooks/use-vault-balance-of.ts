import { useReadContract } from "wagmi";

// internals
import { boringVaultAbi } from "../abis/boring-vault";
import { BORING_VAULT_ADDRESS } from "../constants/boring-vault";

export function useVaultBalanceOf(address: `0x${string}` | undefined) {
	return useReadContract({
		abi: boringVaultAbi,
		functionName: "balanceOf",
		address: BORING_VAULT_ADDRESS,
		query: { enabled: !!address },
		args: address ? [address] : undefined,
	});
}
