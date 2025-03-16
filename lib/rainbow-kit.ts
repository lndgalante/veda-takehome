import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { z } from "zod";

function getReownProjectId(): string {
	return z.string().parse(process.env.NEXT_PUBLIC_REOWN_PROJECT_ID);
}

export const rainbowConfig = getDefaultConfig({
	ssr: true,
	appName: "Veda Challenge",
	chains: [mainnet, sepolia],
	projectId: getReownProjectId(),
	transports: { [mainnet.id]: http(), [sepolia.id]: http() },
});
