import { createPublicClient, http } from "viem";
import { skaleNebulaTestnet } from "viem/chains";

export const publicClient = createPublicClient({
  chain: skaleNebulaTestnet,
  transport: http(),
});
