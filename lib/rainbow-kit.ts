import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { z } from "zod";

// helpers
function getReownProjectId(): string {
	return z.string().parse(process.env.NEXT_PUBLIC_REOWN_PROJECT_ID);
}

function getAlchemyMainnetRpcUrl(): string {
	return z.string().parse(process.env.NEXT_PUBLIC_ALCHEMY_MAINNET_RPC_URL);
}

function getAlchemySepoliaRpcUrl(): string {
	return z.string().parse(process.env.NEXT_PUBLIC_ALCHEMY_SEPOLIA_RPC_URL);
}

export const rainbowConfig = getDefaultConfig({
	ssr: true,
	appName: "Veda Challenge",
	chains: [mainnet, sepolia],
	projectId: getReownProjectId(),
	transports: {
		[mainnet.id]: http(getAlchemyMainnetRpcUrl()),
		[sepolia.id]: http(getAlchemySepoliaRpcUrl()),
	},
});
