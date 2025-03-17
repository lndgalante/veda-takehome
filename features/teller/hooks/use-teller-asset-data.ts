import { useReadContract } from "wagmi";

// internals
import { tellerAbi } from "../abis/teller";
import { TELLER_ADDRESS } from "../constants/teller";

export function useTellerAssetData(address: `0x${string}`) {
	return useReadContract({
		abi: tellerAbi,
		address: TELLER_ADDRESS,
		functionName: "assetData",
		args: [address],
	});
}
