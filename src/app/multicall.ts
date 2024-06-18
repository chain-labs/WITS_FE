import { publicClient } from "./providers";
import { abi } from "./utils/abi";
import { skaleNebulaTestnet } from "viem/chains";
import { CONTRACT_ADDRESS } from "./utils/constants";
import toast from "react-hot-toast";

const witsContract = {
  address: CONTRACT_ADDRESS,
  abi: abi,
} as const;

export async function performMulticall() {
  try {
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
      multicallAddress: skaleNebulaTestnet.contracts.multicall3.address,
    });

    if (result) {
      const res = result.map((r) => r.result?.toString());
      console.log("MultiCall: ", res);
      console.log("MultiCall Raw Result: ", result);
    }
  } catch (error) {
    toast.error("Error during multicall");
    console.error(error);
  }
}
