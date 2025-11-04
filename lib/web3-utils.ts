import { BrowserProvider } from "ethers"

const HARDHAT_CHAIN_ID = 31337

export async function detectMetaMask() {
  return typeof window !== "undefined" && window.ethereum !== undefined
}

export async function connectWallet() {
  try {
    if (!window.ethereum) {
      throw new Error("MetaMask not detected. Please install MetaMask.")
    }

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    })

    return accounts[0]
  } catch (error) {
    console.error("[v0] MetaMask connection error:", error)
    throw error
  }
}

export async function switchToHardhat() {
  try {
    if (!window.ethereum) {
      throw new Error("MetaMask not detected.")
    }

    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x${HARDHAT_CHAIN_ID.toString(16)}` }],
    })
  } catch (error) {
    if ((error as any).code === 4902) {
      // Chain not added, try to add it
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: `0x${HARDHAT_CHAIN_ID.toString(16)}`,
            chainName: "Hardhat",
            rpcUrls: ["http://127.0.0.1:8545"],
            nativeCurrency: {
              name: "ETH",
              symbol: "ETH",
              decimals: 18,
            },
          },
        ],
      })
    } else {
      throw error
    }
  }
}

export async function getProvider() {
  if (!window.ethereum) {
    throw new Error("MetaMask not detected.")
  }
  return new BrowserProvider(window.ethereum)
}

export async function getCurrentAccount() {
  try {
    const provider = await getProvider()
    const signer = await provider.getSigner()
    return await signer.getAddress()
  } catch (error) {
    console.error("[v0] Error getting current account:", error)
    return null
  }
}
