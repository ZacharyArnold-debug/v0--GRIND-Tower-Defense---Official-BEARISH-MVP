"use client"

import { type ReactNode, useMemo } from "react"
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react"
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"

// Import the wallet adapter styles
import "@solana/wallet-adapter-react-ui/styles.css"

// Solana-only providers - removing Web3React to avoid conflicts
export function WalletProviders({ children }: { children: ReactNode }) {
  // Set up Solana network and wallets
  const network = WalletAdapterNetwork.Devnet // Change to Mainnet for production

  // Initialize wallet adapters
  const wallets = useMemo(() => [new PhantomWalletAdapter(), new SolflareWalletAdapter({ network })], [network])

  return (
    <ConnectionProvider endpoint={`https://api.${network}.solana.com`}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
