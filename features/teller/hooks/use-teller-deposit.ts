import { parseUnits } from "viem";
import { useWriteContract } from "wagmi";

// internals
import { TELLER_ABI } from "../abis/teller";
import { TELLER_ADDRESS } from "../constants/teller";

export function useTellerDepositFunction() {
  const { writeContractAsync } = useWriteContract();

  return ({
    address,
    amount,
    decimals,
  }: {
    amount: string;
    decimals: number;
    address: `0x${string}` | undefined;
  }) => {
    if (!address) {
      throw new Error("Address is required");
    }

    const depositAsset = address;
    const depositAmount = amount ? parseUnits(amount, decimals) : BigInt(0);
    const minimumMint = BigInt(0);

    return writeContractAsync({
      abi: TELLER_ABI,
      functionName: "deposit",
      address: TELLER_ADDRESS,
      args: [depositAsset, depositAmount, minimumMint],
    });
  };
}
