import { parseUnits } from "viem";
import { useWriteContract } from "wagmi";

// vault
import { BORING_VAULT_ABI } from "@/features/vault/abis/boring-vault";
import { BORING_VAULT_ADDRESS } from "@/features/vault/constants/boring-vault";

export function useVaultTokenApprove() {
	const { writeContractAsync } = useWriteContract();

	return async ({
		amount,
		address,
		decimals,
	}: {
		amount: string;
		decimals: number;
		address: `0x${string}` | undefined;
	}) => {
		if (!address) {
			throw new Error("Address is required");
		}

		const parsedAmount = amount ? parseUnits(amount, decimals) : BigInt(0);

		return writeContractAsync({
			address,
			abi: BORING_VAULT_ABI,
			functionName: "approve",
			args: [BORING_VAULT_ADDRESS, parsedAmount],
		});
	};
}
