"use client";

import { usePrivy, useWallets } from "@privy-io/react-auth";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createWalletClient, custom } from "viem";
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

const OPTIMISM_SEPOLIA_ROLLUP_CONTRACT =
  "0x16Fc5058F25648194471939df75CF27A2fdC48BC";

const L1_BRIDGE_ABI = [
  {
    name: "withdrawETH",
    type: "function",
    inputs: [
      { name: "amount", type: "uint256" }, // Amount of ETH to withdraw
      { name: "minGasLimit", type: "uint32" }, // Minimum gas limit for L1 execution
    ],
  },
];

function Page() {
  const { connectWallet } = usePrivy();

  const { wallets } = useWallets();
  const wallet = wallets[0];

  const [walletClient, setWalletClient] = useState();
  const [selectedChain, setSelectedChain] = useState();

  const handleChainSelection = async (chain: any) => {
    setSelectedChain(chain);
    // add chain to wallet if not already added
    await wallet.switchChain(chain.id);
  };

  useEffect(() => {
    console.log("wallet", wallet);
    if (!wallet || !selectedChain) {
      return;
    }

    const initializeWallet = async () => {
      await wallet.switchChain(selectedChain.id);
      const provider = await wallet.getEthereumProvider();
      const walletClient = createWalletClient({
        chain: selectedChain,
        transport: custom(provider),
      });
      // await walletClient.addChain(selectedChain);
      setWalletClient(walletClient);
    };

    initializeWallet();
    console.log("walletClient", walletClient);
  }, [wallet, selectedChain]);

  return (
    <main>
      <div className="navbar bg-base-100">
        <div className="navbar-start">
          <div className="dropdown"></div>
          <Image src="/icons/logo.png" alt="Logo" width={120} height={40} />
        </div>
        <div className="navbar-center hidden lg:flex"></div>
        <div className="navbar-end">
          <button className="btn" onClick={connectWallet}>
            {wallet?.address
              ? wallet?.address.slice(0, 4) + "..." + wallet?.address.slice(-3)
              : "Connect Wallet"}
          </button>
        </div>
      </div>
      {/* Main  */}
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Why Self-Sequence?</h2>
        <p>Self-sequencing may be necessary if:</p>
        <ul className="list-disc list-inside">
          <li>The sequencer is down or censoring your transaction.</li>
          <li>
            You want to avoid potential MEV (Miner Extractable Value) extraction
            by the sequencer.
          </li>
          <li>
            You need stronger guarantees about the inclusion of your transaction
            in a specific order.
          </li>
        </ul>
        <p className="mt-4">
          Note: self-sequencing is expensive because you will have to pay the
          full gas cost of submitting your transaction directly to Ethereum L1.
        </p>
        <br />
        <div className="text-left">
          <h2 className="text-2xl font-bold mb-2">Choose your L2</h2>

          <h3 className="text-xl font-bold mb-2">Testnet:</h3>
          <button
            className="btn btn-primary mr-2"
            onClick={() => handleChainSelection(worldchainSepolia)}
          >
            World Sepolia
          </button>
          <button
            className="btn btn-primary mr-2"
            onClick={() => handleChainSelection(baseSepolia)}
          >
            Base Sepolia
          </button>
          <button
            className="btn btn-primary mr-2"
            onClick={() => handleChainSelection(optimismSepolia)}
          >
            Optimism Sepolia
          </button>
          <button
            className="btn btn-primary "
            onClick={() => handleChainSelection(localhost)}
          >
            Localhost
          </button>
        </div>
        <div className="text-left mt-4">
          <h3 className="text-xl font-bold mb-2">Mainnet:</h3>
          <button
            className="btn btn-primary mr-2"
            onClick={() => handleChainSelection(worldchain)}
          >
            World
          </button>
          <button
            className="btn btn-primary mr-2"
            onClick={() => handleChainSelection(base)}
          >
            Base
          </button>
          <button
            className="btn btn-primary"
            onClick={() => handleChainSelection(optimism)}
          >
            Optimism
          </button>
        </div>
        <br />
        <p>Connected Chain: {selectedChain?.name}</p>
        <div
          tabIndex={0}
          className="collapse collapse-arrow border-base-300 bg-base-200 border"
        >
          <div className="collapse-title text-xl font-medium">
            Focus me to see content
          </div>
          <div className="collapse-content">
            <p>tabindex={0} attribute is necessary to make the div focusable</p>
          </div>
        </div>
        <div
          tabIndex={0}
          className="collapse collapse-arrow border-base-300 bg-base-200 border"
        >
          <div className="collapse-title text-xl font-medium">
            Focus me to see content
          </div>
          <div className="collapse-content">
            <p>tabindex={0} attribute is necessary to make the div focusable</p>
          </div>
        </div>
      </div>
      <footer className="footer bg-neutral text-neutral-content items-center p-4">
        <aside className="grid-flow-col items-center">
          <p>Made with ❤️ at ETHGlobal Bangkok</p>
        </aside>
        <nav className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
          <a href="https://github.com/floberlin/DYOS-ethglobal" target="_blank">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="fill-current"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 0C5.373 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.11.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.835 2.807 1.305 3.492.998.108-.775.418-1.305.76-1.605-2.665-.305-5.466-1.335-5.466-5.93 0-1.31.467-2.38 1.235-3.22-.125-.305-.535-1.54.115-3.205 0 0 1.005-.322 3.3 1.23.955-.265 1.98-.398 3-.403 1.02.005 2.045.138 3 .403 2.28-1.552 3.285-1.23 3.285-1.23.655 1.665.245 2.9.12 3.205.77.84 1.235 1.91 1.235 3.22 0 4.61-2.805 5.62-5.475 5.92.43.37.81 1.1.81 2.22 0 1.605-.015 2.895-.015 3.285 0 .32.215.695.825.575C20.565 21.795 24 17.3 24 12c0-6.627-5.373-12-12-12z"
                fill="#FFFFFF"
              />
            </svg>
          </a>
        </nav>
      </footer>
    </main>
  );
}

export default Page;
