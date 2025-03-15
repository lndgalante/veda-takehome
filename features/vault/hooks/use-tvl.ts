import { useReadContract } from "wagmi";

// internals
import { boringVaultAbi } from "../abis/boring-vault";

export function useVaultTotalSupply() {
	return useReadContract({
		abi: boringVaultAbi,
		functionName: "totalSupply",
		address: "0x5f46d540b6eD704C3c8789105F30E075AA900726",
	});
}
