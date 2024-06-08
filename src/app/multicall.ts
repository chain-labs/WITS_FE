import { publicClient } from "./utils/client";
import { abi } from "./utils/abi";
import { CONTRACT_ADDRESS, MULTICALL_ADDRESS } from "./utils/constants";

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
      multicallAddress: MULTICALL_ADDRESS,
    });

    if (result) {
      const res = result.map((r) => r.result?.toString());
      console.log("MultiCall: ", res);
    }
  } catch (error) {
    console.error(error);
  }
}
