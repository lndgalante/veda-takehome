import { useReadContract } from "wagmi";

// internals
import { TELLER_ABI } from "../abis/teller";
import { TELLER_ADDRESS } from "../constants/teller";

export function useTellerAssetData(address: `0x${string}`) {
	return useReadContract({
		abi: TELLER_ABI,
		address: TELLER_ADDRESS,
		functionName: "assetData",
		args: [address],
	});
}
