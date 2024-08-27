"use client"; // Indicates that this file is a React component meant to be rendered on the client side.

import React from "react";
import {
  RainbowKitProvider, // Provides wallet connection UI components.
  getDefaultWallets, // Retrieves default wallets for quick integration.
  connectorsForWallets, // Creates connectors for the specified wallets.
} from "@rainbow-me/rainbowkit";
import {
  argentWallet, // Imports Argent wallet for integration.
  trustWallet, // Imports Trust wallet for integration.
  ledgerWallet, // Imports Ledger wallet for integration.
} from "@rainbow-me/rainbowkit/wallets";
import { configureChains, createConfig, WagmiConfig } from "wagmi"; // wagmi library imports for chain configuration and client setup.
import { polygon, sepolia, lineaTestnet } from "wagmi/chains"; // Importing specific chains (Polygon, Sepolia, Linea Testnet).
import { publicProvider } from "wagmi/providers/public"; // Uses a public provider for blockchain communication.

// Fetches the project ID from environment variables.
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

// Configures chains and sets up the public client and WebSocket client.
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [polygon, sepolia, lineaTestnet], // The chains to be used in the dApp.
  [publicProvider()] // The provider for blockchain communication.
);

// Retrieves default wallets based on the app name, project ID, and chains.
const { wallets } = getDefaultWallets({
  appName: "network-and-wallet-changes", // The name of the dApp.
  projectId, // The project ID for wallet configuration.
  chains, // The configured chains.
});

// Additional information to be displayed in the wallet connection modal.
const demoAppInfo = {
  appName: "network-and-wallet-changes", // Name of the app displayed in the modal.
};

// Creates connectors for the default and additional wallets.
const connectors = connectorsForWallets([
  ...wallets, // Spread the default wallets.
  {
    groupName: "Other", // Group name for additional wallets.
    wallets: [
      argentWallet({ projectId, chains }), // Adds Argent wallet.
      trustWallet({ projectId, chains }), // Adds Trust wallet.
      ledgerWallet({ projectId, chains }), // Adds Ledger wallet.
    ],
  },
]);

// Creates a wagmi configuration object with auto-connect enabled.
const wagmiConfig = createConfig({
  autoConnect: true, // Automatically connects to the last connected wallet.
  connectors, // Wallet connectors.
  publicClient, // The public client for the configured chains.
  webSocketPublicClient, // WebSocket client for real-time updates.
});

// React component that wraps children with WagmiConfig and RainbowKitProvider.
const Providers = ({ children }) => {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        chains={chains} // Passes configured chains to RainbowKit.
        appInfo={demoAppInfo} // App info to be displayed in the wallet modal.
        modalSize="compact" // Sets the modal size to "compact".
      >
        {children} {/* Renders children components within the provider. */}
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default Providers;
