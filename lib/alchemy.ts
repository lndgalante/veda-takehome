import { z } from "zod";

// helpers
export function getAlchemyApiKey(): string {
  return z.string().parse(process.env.NEXT_PUBLIC_ALCHEMY_API_KEY);
}

// constants
export const alchemyMainnetRpcUrl = `https://eth-mainnet.g.alchemy.com/v2/${getAlchemyApiKey()}`;
export const alchemySepoliaRpcUrl = `https://eth-sepolia.g.alchemy.com/v2/${getAlchemyApiKey()}`;
