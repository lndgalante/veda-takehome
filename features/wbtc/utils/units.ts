export function getSatoshisToBtc(satoshis: bigint): number {
	return Number(satoshis) / 10 ** 8;
}
