import { Connection, PublicKey } from "@solana/web3.js"

// Token addresses - replace with actual $GRIND token addresses
export const GRIND_SPL_MINT = "GRiNDzNQQArhK1rNPYHLRMGYm5MTnqRsXMGKhVPuFCQZ" // Example Solana address
export const GRIND_ERC20_ADDRESS = "0x1234567890123456789012345678901234567890" // Example Ethereum address

// ERC-20 minimal ABI for balanceOf function
export const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
]

// Function to get SPL token balance
export async function getSplTokenBalance(walletAddress: PublicKey, mintAddress: string): Promise<number> {
  try {
    const connection = new Connection("https://api.devnet.solana.com", "confirmed")
    const mint = new PublicKey(mintAddress)

    // Find the token account for this wallet and mint
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(walletAddress, { mint })

    // If no token account found, return 0
    if (tokenAccounts.value.length === 0) {
      return 0
    }

    // Get the balance from the first token account
    const tokenAccount = tokenAccounts.value[0]
    const balance = tokenAccount.account.data.parsed.info.tokenAmount.uiAmount || 0

    return balance
  } catch (error) {
    console.error("Error fetching SPL token balance:", error)
    return 0
  }
}

// Function to get ERC-20 token balance using ethers.js
export async function getErc20Balance(address: string, tokenAddress: string): Promise<number> {
  try {
    if (!window.ethereum) {
      throw new Error("MetaMask is not installed")
    }

    // Create a provider using window.ethereum
    const provider = new (window as any).ethers.providers.Web3Provider(window.ethereum)

    // Create a contract instance
    const contract = new (window as any).ethers.Contract(tokenAddress, ERC20_ABI, provider)

    // Call balanceOf function
    const balance = await contract.balanceOf(address)

    // Convert from wei to token units (assuming 18 decimals)
    return Number((window as any).ethers.utils.formatUnits(balance, 18))
  } catch (error) {
    console.error("Error fetching ERC-20 balance:", error)
    return 0
  }
}

// Function to format token balance with commas and decimal places
export function formatTokenBalance(balance: number): string {
  return balance.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })
}
