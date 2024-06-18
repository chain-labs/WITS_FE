import { createWalletClient, http } from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { skaleNebulaTestnet } from "viem/chains";
import { publicClient } from "../providers";
import Miner from "./miners";
import { abi } from "./abi";
import { gasLimit, CONTRACT_ADDRESS } from "./constants";

async function requestTxn(
  userAddress: `0x${string}`,
  searchHash: string
): Promise<any> {
  const privateKey = generatePrivateKey();
  const account = privateKeyToAccount(privateKey);
  const client = createWalletClient({
    account,
    chain: skaleNebulaTestnet,
    transport: http(),
  });

  const nonce = await publicClient.getTransactionCount({
    address: account.address,
  });

  const miner = new Miner();

  try {
    const { gasPrice } = await miner.mineGasForTransaction(
      nonce,
      gasLimit,
      account.address
    );
    const { request } = await publicClient.simulateContract({
      account,
      address: CONTRACT_ADDRESS,
      abi: abi,
      functionName: "claimCards",
      gasPrice: gasPrice,
      args: [userAddress, 0, searchHash, "", []],
    });

    const hash = await client.writeContract(request);
    return hash;
  } catch (error) {
    console.error("Error requesting sFUEL:", error);
  }
}
export { requestTxn };
