"use client";

import { usePrivy, useWallets } from "@privy-io/react-auth";
import Image from "next/image";
import { useState, useCallback } from "react";
import {
  sepolia,
  mainnet,
  baseSepolia,
  optimismSepolia,
  worldchainSepolia,
  worldchain,
  base,
  optimism,
  localhost,
} from "viem/chains";
import { useAccount, useWriteContract } from "wagmi";
import { switchChain, disconnect } from "@wagmi/core";
const {
  publicActionsL2,
  publicActionsL1,
  walletActionsL2,
  walletActionsL1,
  getL2TransactionHashes,
} = require("viem/op-stack");

import { config } from "./providers";
import portal from "@utils/abis/portal.json";
import {
  createPublicClient,
  defineChain,
  formatUnits,
  http,
  parseUnits,
} from "viem";

const local = /*#__PURE__*/ defineChain({
  id: 3151908,
  name: "Odyssey Local",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: { http: ["http://127.0.0.1:54687"] },
  },
});

// Sepolia Contracts
const OPTIMISM_SEPOLIA_ROLLUP_CONTRACT =
  "0x16Fc5058F25648194471939df75CF27A2fdC48BC";

const BASE_SEPOLIA_ROLLUP_CONTRACT =
  "0x49f53e41452C74589E85cA1677426Ba426459e85";

const WORLDCHAIN_SEPOLIA_ROLLUP_CONTRACT =
  "0xFf6EBa109271fe6d4237EeeD4bAb1dD9A77dD1A4";

const ODYSSEY_SEPOLIA_ROLLUP_CONTRACT =
  "0xAA1227dCd7CE7059Fa30d42641f7a7689b652b55";

// Mainnet Contracts
const WORLD_MAINNET_ROLLUP_CONTRACT =
  "0xd5ec14a83b7d95be1e2ac12523e2dee12cbeea6c";

const BASE_MAINNET_ROLLUP_CONTRACT =
  "0x49048044D57e1C92A77f79988d21Fa8fAF74E97e";

const OPTIMISM_MAINNET_ROLLUP_CONTRACT =
  "0xbEb5Fc579115071764c7423A4f12eDde41f106Ed";

//CrossChainMsg
const OP_STACK_CROSSCHAIN_CONTRACT =
  "0x4200000000000000000000000000000000000007";

function Page() {
  const { connectWallet } = usePrivy();
  const { wallets } = useWallets();
  const wallet = wallets[0];
  const [selectedChain, setSelectedChain] = useState(null);
  const [usedContractAddress, setUsedContractAddress] = useState(
    OPTIMISM_SEPOLIA_ROLLUP_CONTRACT
  );
  const [l2PublicClient, setL2PublicClient] = useState(null);
  const [l2Balance, setL2Balance] = useState(null);

  const [contractAddr, setContractAddr] = useState();
  const [calldata, setCalldata] = useState();
  const [sendTo, setSendTo] = useState();
  const [ethValue, setEthValue] = useState();

  const [chainExplorer, setChainExplorer] = useState("");

  const [chainExplorerL1, setChainExplorerL1] = useState(
    "https://eth-sepolia.blockscout.com/"
  );

  const handleChainSelection = useCallback(
    async (chain: any) => {
      if (!wallet || !chain) return;

      try {
        console.log("Switching chain:", chain.id);
        setSelectedChain(chain);

        if (chain.id === worldchain.id) {
          setUsedContractAddress(WORLD_MAINNET_ROLLUP_CONTRACT);
          setChainExplorer("https://worldchain-mainnet.explorer.alchemy.com/");
          setChainExplorerL1("https://eth.blockscout.com/");
          const l2PublicClient: ReturnType<typeof createPublicClient> &
            ReturnType<typeof publicActionsL2> = createPublicClient({
            chain: worldchain,
            transport: http("https://worldchain-mainnet.g.alchemy.com/public/"),
          }).extend(publicActionsL2());
          l2PublicClient.getBalance({ address }).then((balance: any) => {
            console.log("Balance", balance);
            setL2Balance(formatUnits(balance, 18));
          });
          setL2PublicClient(l2PublicClient);
          await switchChain(config, { chainId: mainnet.id });
        } else if (chain.id === base.id) {
          setUsedContractAddress(BASE_MAINNET_ROLLUP_CONTRACT);
          setChainExplorerL1("https://eth.blockscout.com/");

          const l2PublicClient: ReturnType<typeof createPublicClient> &
            ReturnType<typeof publicActionsL2> = createPublicClient({
            chain: base,
            transport: http("https://base.llamarpc.com/"),
          }).extend(publicActionsL2());
          l2PublicClient.getBalance({ address }).then((balance: any) => {
            console.log("Balance", balance);
            setL2Balance(formatUnits(balance, 18));
          });
          setL2PublicClient(l2PublicClient);
          setChainExplorer("https://base.blockscout.com/");
          await switchChain(config, { chainId: mainnet.id });
        } else if (chain.id === optimism.id) {
          setChainExplorer("https://optimism.blockscout.com/");
          setChainExplorerL1("https://eth.blockscout.com/");

          setUsedContractAddress(OPTIMISM_MAINNET_ROLLUP_CONTRACT);
          const l2PublicClient: ReturnType<typeof createPublicClient> &
            ReturnType<typeof publicActionsL2> = createPublicClient({
            chain: optimism,
            transport: http("https://mainnet.optimism.io"),
          }).extend(publicActionsL2());
          l2PublicClient.getBalance({ address }).then((balance: any) => {
            console.log("Balance", balance);
            setL2Balance(formatUnits(balance, 18));
          });
          setL2PublicClient(l2PublicClient);
          await switchChain(config, { chainId: mainnet.id });
        } else if (chain.id === worldchainSepolia.id) {
          setChainExplorer("https://worldchain-sepolia.explorer.alchemy.com/");
          setChainExplorerL1("https://eth-sepolia.blockscout.com/");

          setUsedContractAddress(WORLDCHAIN_SEPOLIA_ROLLUP_CONTRACT);
          const l2PublicClient: ReturnType<typeof createPublicClient> &
            ReturnType<typeof publicActionsL2> = createPublicClient({
            chain: worldchainSepolia,
            transport: http("https://worldchain-sepolia.g.alchemy.com/public/"),
          }).extend(publicActionsL2());
          l2PublicClient.getBalance({ address }).then((balance: any) => {
            console.log("Balance", balance);
            setL2Balance(formatUnits(balance, 18));
          });
          setL2PublicClient(l2PublicClient);
          await switchChain(config, { chainId: sepolia.id });
        } else if (chain.id === baseSepolia.id) {
          setChainExplorer("https://base-sepolia.blockscout.com/");
          setChainExplorerL1("https://eth-sepolia.blockscout.com/");

          setUsedContractAddress(BASE_SEPOLIA_ROLLUP_CONTRACT);
          const l2PublicClient: ReturnType<typeof createPublicClient> &
            ReturnType<typeof publicActionsL2> = createPublicClient({
            chain: baseSepolia,
            transport: http(
              "https://base-sepolia.blockpi.network/v1/rpc/public/"
            ),
          }).extend(publicActionsL2());
          l2PublicClient.getBalance({ address }).then((balance: any) => {
            console.log("Balance", balance);
            setL2Balance(formatUnits(balance, 18));
          });
          setL2PublicClient(l2PublicClient);
          await switchChain(config, { chainId: sepolia.id });
        } else if (chain.id === optimismSepolia.id) {
          setChainExplorer("https://optimism-sepolia.blockscout.com/");
          setChainExplorerL1("https://eth-sepolia.blockscout.com/");

          setUsedContractAddress(OPTIMISM_SEPOLIA_ROLLUP_CONTRACT);
          const l2PublicClient: ReturnType<typeof createPublicClient> &
            ReturnType<typeof publicActionsL2> = createPublicClient({
            chain: optimismSepolia,
            transport: http("https://sepolia.optimism.io"),
          }).extend(publicActionsL2());
          l2PublicClient.getBalance({ address }).then((balance: any) => {
            console.log("Balance", balance);
            setL2Balance(formatUnits(balance, 18));
          });
          setL2PublicClient(l2PublicClient);

          await switchChain(config, { chainId: sepolia.id });
        } else if (chain.id === local.id) {
          setUsedContractAddress(ODYSSEY_SEPOLIA_ROLLUP_CONTRACT);
          const l2PublicClient: ReturnType<typeof createPublicClient> &
            ReturnType<typeof publicActionsL2> = createPublicClient({
            chain: local,
            transport: http("http://localhost:54687"),
          }).extend(publicActionsL2());
          l2PublicClient.getBalance({ address }).then((balance: any) => {
            console.log("Balance", balance);
            setL2Balance(formatUnits(balance, 18));
          });
          setL2PublicClient(l2PublicClient);
          await switchChain(config, { chainId: mainnet.id });
        } else if (chain.id === local.id) {
          await switchChain(config, { chainId: local.id });
        }
      } catch (error) {
        console.error("Error switching chain:", error);
      }
    },
    [wallet]
  );

  const { address } = useAccount();
  const { writeContract, error, data, status } = useWriteContract();

  console.log("tx info ", error, data, status);

  return (
    <main className="flex flex-col min-h-screen">
      <div className="flex-grow">
        <div className="navbar bg-base-100">
          <div className="navbar-start">
            <div className="dropdown"></div>
            <Image src="https://i.ibb.co/cTNfBK1/logo.png" alt="Logo" width={120} height={40} />
          </div>
          <div className="navbar-center hidden lg:flex"></div>
          <div className="navbar-end">
            {address ? (
              <button className="btn" onClick={() => disconnect(config)}>
                {address?.slice(0, 4)}...{address?.slice(-3)}
              </button>
            ) : (
              <button className="btn" onClick={connectWallet}>
                Connect Wallet
              </button>
            )}
          </div>
        </div>
        {/* Main content */}
        <div className="container mx-auto p-4">
          <h2 className="text-2xl font-bold mb-4">Why Self-Sequence?</h2>
          <p>Self-Sequencing may be necessary if:</p>
          <ul className="list-disc list-inside">
            <li>The sequencer is down or censoring your transaction.</li>
            <li>
              You want to avoid potential MEV extraction by the sequencer.
            </li>
            <li>
              You need stronger guarantees about the inclusion of your
              transaction in a specific order.
            </li>
          </ul>
          <p className="mt-4">
            Note: self-sequencing is expensive because you will have to pay the
            full gas cost of submitting your transaction directly to Ethereum
            L1.
          </p>
          <br />
          <div className="text-left">
            <h2 className="text-2xl font-bold mb-2">Choose your L2</h2>

            <h3 className="text-xl font-bold mb-2">Testnet:</h3>
            <button
              className={`btn mr-2 ${
                selectedChain === worldchainSepolia
                  ? "btn-primary"
                  : "btn-secondary"
              }`}
              onClick={() => handleChainSelection(worldchainSepolia)}
            >
              World Sepolia
            </button>
            <button
              className={`btn mr-2 ${
                selectedChain === baseSepolia ? "btn-primary" : "btn-secondary"
              }`}
              onClick={() => handleChainSelection(baseSepolia)}
            >
              Base Sepolia
            </button>
            <button
              className={`btn mr-2 ${
                selectedChain === optimismSepolia
                  ? "btn-primary"
                  : "btn-secondary"
              }`}
              onClick={() => handleChainSelection(optimismSepolia)}
            >
              Optimism Sepolia
            </button>
            <button
              className={`btn mr-2 ${
                selectedChain === localhost ? "btn-primary" : "btn-secondary"
              }`}
              onClick={() => handleChainSelection(localhost)}
            >
              Localhost (1337)
            </button>
            <button
              className={`btn ${
                selectedChain === localhost ? "btn-primary" : "btn-secondary"
              }`}
              onClick={() => handleChainSelection(local)}
            >
              Localhost (Alphanet 11155111)
            </button>
          </div>
          <div className="text-left mt-4">
            <h3 className="text-xl font-bold mb-2">Mainnet:</h3>
            <button
              className={`btn mr-2 ${
                selectedChain === worldchain ? "btn-primary" : "btn-secondary"
              }`}
              onClick={() => handleChainSelection(worldchain)}
            >
              World
            </button>
            <button
              className={`btn mr-2 ${
                selectedChain === base ? "btn-primary" : "btn-secondary"
              }`}
              onClick={() => handleChainSelection(base)}
            >
              Base
            </button>
            <button
              className={`btn ${
                selectedChain === optimism ? "btn-primary" : "btn-secondary"
              }`}
              onClick={() => handleChainSelection(optimism)}
            >
              Optimism
            </button>
          </div>
          <br />
          {selectedChain && (
            <p>
              Choosen Chain: {selectedChain?.name} | ETH Balance on L2:{" "}
              {l2Balance} ETH
            </p>
          )}
        </div>

        <div className="m-4">
          <div className="collapse collapse-plus bg-base-200 border ">
            <input type="radio" name="my-accordion-3" defaultChecked />
            <div className="collapse-title text-xl font-medium">
              Withdraw ETH
            </div>
            <div className="collapse-content">
              <button
                className="btn btn-primary"
                onClick={() => {
                  writeContract({
                    abi: portal,
                    address: usedContractAddress,
                    functionName: "depositTransaction",
                    args: [
                      "0x131cf758d9ef6bca88928442dc715c8fdc113952",
                      "1000000302000000100",
                      910000n,
                      false,
                      "",
                    ],
                    gas: 1000000n,
                    maxPriorityFeePerGas: 100000000n,
                  });
                }}
              >
                From {selectedChain?.name} to L1
              </button>
              <br />
              {status !== "idle" && (
                <>
                  <p>Transaction Status: {status}</p>
                  <a
                    className="link"
                    href={chainExplorerL1 + "tx/" + data}
                    target="_blank"
                  >
                    Link to Blockscout
                  </a>
                </>
              )}
            </div>
          </div>
          <br />
          <div className="collapse collapse-plus bg-base-200">
            <input type="radio" name="my-accordion-3" />
            <div className="collapse-title text-xl font-medium">
              More options
            </div>
            <div className="collapse-content">
              <input
                type="text"
                placeholder="Recipient Address"
                className="input input-bordered w-full max-w-xs"
                value={contractAddr}
                onChange={(e: any) => setContractAddr(e.target.value)}
              />
              <input
                type="text"
                placeholder="Amount of ETH"
                className="input input-bordered w-full max-w-xs"
                value={ethValue}
                onChange={(e: any) => setEthValue(e.target.value)}
              />
              <button
                className="btn btn-primary"
                onClick={() => {
                  writeContract({
                    abi: portal,
                    address: usedContractAddress,
                    functionName: "depositTransaction",
                    args: [
                      contractAddr,
                      parseUnits(ethValue?.toString(), 18),
                      910000n,
                      false,
                      "",
                    ],
                    gas: 1000000n,
                    maxPriorityFeePerGas: 100000000n,
                  });
                }}
              >
                Send ETH to address on L2
              </button>
              <br />
              {status !== "idle" && (
                <>
                  <p>Transaction Status: {status}</p>
                  <a
                    className="link"
                    href={chainExplorerL1 + "tx/" + data}
                    target="_blank"
                  >
                    Link to Blockscout
                  </a>
                </>
              )}
            </div>
          </div>
          <br />
          <div className="collapse collapse-plus bg-base-200">
            <input type="radio" name="my-accordion-3" />
            <div className="collapse-title text-xl font-medium">
              Submit own bytecode (advanced)
            </div>
            <div className="collapse-content">
              <input
                type="text"
                placeholder="Smart Contract Address"
                className="input input-bordered w-full max-w-xs"
                value={contractAddr}
                onChange={(e: any) => setContractAddr(e.target.value)}
              />
              <input
                type="text"
                placeholder="Calldata"
                className="input input-bordered w-full max-w-xs"
                value={calldata}
                onChange={(e: any) => setCalldata(e.target.value)}
              />
              <input
                type="text"
                placeholder="Ether Value field (can be 0)"
                className="input input-bordered w-full max-w-xs"
                value={ethValue}
                onChange={(e: any) => setEthValue(e.target.value)}
              />
              <br />
              <button
                className="btn btn-primary"
                onClick={() => {
                  writeContract({
                    abi: portal,
                    address: usedContractAddress,
                    functionName: "depositTransaction",
                    args: [contractAddr, ethValue, 910000n, false, calldata],
                    gas: 1000000n,
                    maxPriorityFeePerGas: 100000000n,
                  });
                }}
              >
                Call any L2 contract
              </button>
            </div>
          </div>
        </div>
      </div>
      <footer className="footer bg-neutral text-neutral-content items-center p-4 mt-auto">
        <aside className="grid-flow-col items-center">
          <p>Made with ❤️ at ETHGlobal Bangkok 2024</p>
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
                fill="#181717"
              />
            </svg>
          </a>
        </nav>
      </footer>
    </main>
  );
}

export default Page;
