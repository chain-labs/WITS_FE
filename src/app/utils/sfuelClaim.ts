import { createWalletClient, http, createPublicClient } from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { skaleNebulaTestnet } from "viem/chains";
import Miner from "./miners";

const SKALE_RPC_URL =
  "https://testnet.skalenodes.com/v1/lanky-ill-funny-testnet";
const MIN_SFUEL_BALANCE = BigInt(10 ** 16); // 0.01 sFUEL in wei
const SKALE_FUEL_STATION_ADDRESS = "0x000E9c53C4e2e21F5063f2e232d0AA907318dccb";
const functionSignature = "0x0c11dedd";

async function requestSFuel(userAddress: `0x${string}`): Promise<void> {
  const publicClient = createPublicClient({
    transport: http(SKALE_RPC_URL),
  });

  const privateKey = generatePrivateKey();
  const account = privateKeyToAccount(privateKey);
  const client = createWalletClient({
    account,
    chain: skaleNebulaTestnet,
    transport: http(SKALE_RPC_URL),
  });

  console.log(`Random wallet created: ${account.address}`);
  const nonce = await publicClient.getTransactionCount({
    address: account.address,
  });
  const miner = new Miner();

  try {
    const { gasPrice } = await miner.mineGasForTransaction(
      nonce,
      100_000,
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

    const randomWalletBalance = await publicClient.getBalance({
      address: account.address,
    });
    console.log(`Random wallet balance: ${randomWalletBalance}`);
    console.log(
      `userAddress balance: ${await publicClient.getBalance({
        address: userAddress,
      })}`
    );
    console.log(`sFUEL requested for address: ${userAddress}`);
  } catch (error) {
    console.error("Error requesting sFUEL:", error);
  }
}

async function checkAndRequestSFuel(
  userAddress: `0x${string}`
): Promise<bigint> {
  const publicClient = createPublicClient({
    transport: http(SKALE_RPC_URL),
  });
  const balance = await publicClient.getBalance({ address: userAddress });

  if (balance < MIN_SFUEL_BALANCE) {
    await requestSFuel(userAddress);
    const newBalance = await publicClient.getBalance({ address: userAddress });
    return newBalance;
  }

  return balance;
}

export { requestSFuel, checkAndRequestSFuel };
