import { formatUnits } from "viem";

export function getSatoshisToBtc(satoshis: bigint): number {
  return Number(formatUnits(satoshis, 8));
}
