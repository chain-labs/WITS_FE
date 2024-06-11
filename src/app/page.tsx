"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { zeroAddress } from "./utils/constants";
import { requestTxn } from "./utils/gaslessTxn";
import { SyncLoader } from "react-spinners";
import toast, { Toaster } from "react-hot-toast";
import { performMulticall } from "./multicall";
import { isValid32ByteHexString, isValidChainId } from "./utils/helperFuncs";

export default function Home() {
  const [hash, setHash] = useState("");
  const [isClaiming, setIsClaiming] = useState(false);
  const { address, isConnected, chainId } = useAccount();
  const searchParams = useSearchParams();

  const searchHash = searchParams.get("hash") || zeroAddress;

  useEffect(() => {
    if (hash) {
      toast.success("Claimed Cards Successfully");
    }
  }, [hash]);

  useEffect(() => {
    performMulticall().catch(console.error);
  }, []);

  const onClaim = async () => {
    if (!isConnected || !address) {
      toast.error("Please connect your wallet");
      return;
    }
    if (!isValidChainId(chainId ?? 0)) {
      toast.error("Please switch to Skale Nebula Testnet");
      return;
    }
    if (!isValid32ByteHexString(searchHash)) {
      toast.error("Invalid Hash Url");
      return;
    }
    try {
      setIsClaiming(true);
      const res = await requestTxn(address, searchHash);
      setHash(res);
    } catch (error) {
      console.error("Error during claim process:", error);
      toast.error("Error during claim process");
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
            {isClaiming ? <SyncLoader size={12} color={"#FACA15"} /> : "Claim"}
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
        {hash && (
          <p className="text-yellow-200 font-bold">
            Claimed Cards Txn Hash : {hash}
          </p>
        )}
      </div>
      <Toaster />
    </main>
  );
}
