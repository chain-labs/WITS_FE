import { createPublicClient, http } from "viem";
import { skaleNebulaTestnet } from "viem/chains";
import { abi } from "./utils/abi";

const CONTRACT_ADDRESS = "0x40f72B6ac30bca6Bdc67321F7706406871C7E36c";

export const publicClient = createPublicClient({
  chain: skaleNebulaTestnet,
  transport: http(),
});

const witsContract = {
  address: CONTRACT_ADDRESS,
  abi: abi,
} as const;

export async function performMulticall() {
  const result = await publicClient.multicall({
    contracts: [
      {
        ...witsContract,
        functionName: "name",
      },
      {
        ...witsContract,
        functionName: "tokenId",
      },
      {
        ...witsContract,
        functionName: "symbol",
      },
    ],
    multicallAddress: "0xca11bde05977b3631167028862be2a173976ca11",
  });

  console.log(result);
}
