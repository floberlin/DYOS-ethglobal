"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "@privy-io/wagmi";

import {
  sepolia,
  baseSepolia,
  optimismSepolia,
  worldchainSepolia,
  worldchain,
  base,
  optimism,
  localhost,
  mainnet,
} from "viem/chains";

import { http } from "wagmi";

import { createConfig } from "@privy-io/wagmi";
import { defineChain } from "viem";

const queryClient = new QueryClient();

const local = /*#__PURE__*/ defineChain({
  id: 11155111,
  name: "AlphaNet Local",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: { http: ["http://127.0.0.1:8545"] },
  },
});

export const config = createConfig({
  chains: [
    sepolia,
    mainnet,
    baseSepolia,
    worldchainSepolia,
    optimismSepolia,
    optimism,
    base,
    worldchain,
    localhost,
    local,
  ],
  transports: {
    [sepolia.id]: http(),
    [mainnet.id]: http(),
    [baseSepolia.id]: http(),
    [optimismSepolia.id]: http(),
    [worldchainSepolia.id]: http(),
    [worldchain.id]: http(),
    [base.id]: http(),
    [optimism.id]: http(),
    [localhost.id]: http(),
    [local.id]: http(),
  },
});

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId="cm3itvr3h01dpgayqbcmyl7bo"
      config={{
        appearance: {
          accentColor: "#38CCCD",
          theme: "#FFFFF0",
          showWalletLoginFirst: false,
          logo: "https://auth.privy.io/logos/privy-logo.png",
          walletChainType: "ethereum-only",
        },
        loginMethods: ["email", "wallet", "farcaster"],
        fundingMethodConfig: {
          moonpay: {
            useSandbox: true,
          },
        },
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
          requireUserPasswordOnCreate: false,
        },
        mfa: {
          noPromptOnMfaRequired: false,
        },
        supportedChains: [
          sepolia,
          baseSepolia,
          optimismSepolia,
          worldchainSepolia,
          worldchain,
          base,
          optimism,
          localhost,
          local,
        ],
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={config}>{children}</WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
