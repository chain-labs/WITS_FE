"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { abi } from "./utils/abi";
import { useSearchParams } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { skaleNebulaTestnet } from "viem/chains";
import { zeroAddress } from "./utils/constants";
import { checkAndRequestSFuel } from "./utils/sfuelClaim";
import { SyncLoader } from "react-spinners";
import toast, { Toaster } from "react-hot-toast";
import { performMulticall } from "./multicall";
import { MIN_SFUEL_BALANCE, CONTRACT_ADDRESS } from "./utils/constants";

export default function Home() {
  const [isClaiming, setIsClaiming] = useState(false);
  const { address, isConnected, chainId } = useAccount();
  const searchParams = useSearchParams();

  const searchHash = searchParams.get("hash") || zeroAddress;

  // function to check if url hash is a valid 32 byte hex string
  // currently not used but can be used to validate the hash
  function isValid32ByteHexString(hexString: string): boolean {
    return /^0x[0-9a-fA-F]{64}$/.test(hexString);
  }

  const {
    data: hash,
    isPending,
    isError,
    error,
    writeContract,
  } = useWriteContract();
  const { isSuccess, isLoading } = useWaitForTransactionReceipt({
    hash: hash,
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success("Claimed Cards Successfully");
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      toast.error("Error during claim process");
      console.error("Error during claim process:", error);
    }
  }, [isError, error]);

  useEffect(() => {
    performMulticall().catch(console.error);
  }, []);

  const onClaim = async () => {
    if (!isConnected || !address) {
      toast.error("Please connect your wallet");
      return;
    }
    if (chainId !== skaleNebulaTestnet.id) {
      toast.error("Please switch to Skale Nebula Testnet");
      return;
    }
    try {
      setIsClaiming(true);
      const sFuelBalance = await checkAndRequestSFuel(address);
      if (BigInt(sFuelBalance) < MIN_SFUEL_BALANCE) {
        console.error("Insufficient sFUEL balance");
        setIsClaiming(false);
        return;
      }
      writeContract({
        abi: abi,
        address: CONTRACT_ADDRESS,
        functionName: "claimCards",
        args: [address, 0, searchHash, "", []],
      });
    } catch (error) {
      console.error("Error during claim process:", error);
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <main className="flex flex-col min-h-screen bg-[url('/background.png')] bg-cover items-center justify-around relative">
      <div className="relative z-30">
        <ConnectButton />
      </div>
      <div className="h-full w-full bg-black bg-opacity-50 absolute z-10" />
      <button
        onClick={onClaim}
        className="relative group h-10 w-40 cursor-pointer z-20 p-10 flex items-center justify-center"
      >
        <div className="group-hover:text-black group-active:text-black text-yellow-300 z-40">
          <p className="text-[25px] font-bold z-40">
            {isClaiming || isPending || isLoading ? (
              <SyncLoader size={12} color={"#FACA15"} />
            ) : (
              "Claim"
            )}
          </p>
        </div>
        <Image
          src="/default.png"
          className="w-full group-hover:hidden group-active:hidden"
          alt=""
          fill
        />
        <Image
          src="/hover.png"
          className="w-full hidden group-hover:block group-active:hidden"
          alt=""
          fill
        />
        <Image
          src="/active.png"
          className="w-full hidden group-active:block"
          alt=""
          fill
        />
      </button>
      <div className="relative z-30">
        {isSuccess && (
          <p className="text-yellow-200 font-bold">
            Claimed Cards Txn Hash : {hash}
          </p>
        )}
      </div>
      <Toaster />
    </main>
  );
}
