import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";

import { alchemyMainnetRpcUrl, alchemySepoliaRpcUrl } from "./alchemy";
// internals
import { getReownProjectId } from "./reown";

// constants
export const rainbowConfig = getDefaultConfig({
  ssr: true,
  appName: "Veda Challenge",
  chains: [mainnet, sepolia],
  projectId: getReownProjectId(),
  transports: {
    [mainnet.id]: http(alchemyMainnetRpcUrl),
    [sepolia.id]: http(alchemySepoliaRpcUrl),
  },
});
