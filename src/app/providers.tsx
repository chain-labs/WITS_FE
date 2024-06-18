"use client";
import * as React from "react";
import {
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider, http } from "wagmi";
import { skaleNebulaTestnet } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { createPublicClient } from "viem";

const config = getDefaultConfig({
  appName: "WITS",
  projectId: "a39f51c51acb488daa956c62ffdca58d",
  chains: [skaleNebulaTestnet],
  transports: {
    [skaleNebulaTestnet.id]: http(),
  },
  ssr: true,
});

export const queryClient = new QueryClient();

export const publicClient = createPublicClient({
  chain: skaleNebulaTestnet,
  transport: http(),
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider modalSize="compact" theme={darkTheme()}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
