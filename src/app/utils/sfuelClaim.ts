import { createWalletClient, http } from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { skaleNebulaTestnet } from "viem/chains";
import { publicClient } from "../providers";
import Miner from "./miners";
import {
  MIN_SFUEL_BALANCE,
  SKALE_FUEL_STATION_ADDRESS,
  functionSignature,
  gasLimit,
} from "./constants";

async function requestSFuel(userAddress: `0x${string}`): Promise<void> {
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

    console.log("Gas Price: ", gasPrice);

    const tx = await client.sendTransaction({
      to: SKALE_FUEL_STATION_ADDRESS,
      data: `${functionSignature}000000000000000000000000${userAddress.substring(
        2
      )}`,
      gasLimit: 100_000,
      gasPrice: gasPrice,
    });

    await new Promise<void>((resolve) => setTimeout(resolve, 1000));

    console.log(`sFUEL requested for address: ${userAddress}`);
  } catch (error) {
    console.error("Error requesting sFUEL:", error);
  }
}

async function checkAndRequestSFuel(
  userAddress: `0x${string}`
): Promise<bigint> {
  const balance = await publicClient.getBalance({ address: userAddress });

  if (balance < MIN_SFUEL_BALANCE) {
    await requestSFuel(userAddress);
    const newBalance = await publicClient.getBalance({ address: userAddress });
    return newBalance;
  }
  return balance;
}

export { requestSFuel, checkAndRequestSFuel };
