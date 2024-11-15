"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import {
  sepolia,
  baseSepolia,
  optimismSepolia,
  worldchainSepolia,
  worldchain,
  base,
  optimism,
  localhost,
} from "viem/chains";

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
        ],
      }}
    >
      {children}
    </PrivyProvider>
  );
}
