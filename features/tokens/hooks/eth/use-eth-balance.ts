import { useBalance } from "wagmi";

export function useEthBalance(address: `0x${string}` | undefined) {
	return useBalance({
		address,
		query: { enabled: !!address },
	});
}
