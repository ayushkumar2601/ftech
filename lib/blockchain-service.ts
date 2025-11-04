// import { type BrowserProvider, Contract } from "ethers"

// const FORECHAIN_ABI = [
//   "function anchorHash(string memory evidenceId, string memory hash, address uploader) public returns (bool)",
//   "function getHashByEvidenceId(string memory evidenceId) public view returns (tuple(string evidenceId, bytes32 hash, uint256 timestamp, address uploader))",
//   "function getAllHashes() public view returns (tuple(string evidenceId, bytes32 hash, uint256 timestamp, address uploader)[])",
//   "function fileHashes(bytes32 hashKey) public view returns (bool)",
//   "function getTotalHashes() public view returns (uint256)",
//   "function verifyHash(string memory hash) public view returns (bool)",
// ]

// const FORECHAIN_CONTRACT_ADDRESS =
//   process.env.NEXT_PUBLIC_FORECHAIN_ADDRESS || "0x0000000000000000000000000000000000000000"

// const MOCK_HASHES = [
//   {
//     evidenceId: "EV-1698765432000-abc123de",
//     hash: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
//     timestamp: Math.floor(Date.now() / 1000) - 86400,
//     uploader: "0x1234567890123456789012345678901234567890",
//     verified: true,
//   },
//   {
//     evidenceId: "EV-1698768432000-def456gh",
//     hash: "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
//     timestamp: Math.floor(Date.now() / 1000) - 43200,
//     uploader: "0x0987654321098765432109876543210987654321",
//     verified: true,
//   },
//   {
//     evidenceId: "EV-1698771432000-ghi789jk",
//     hash: "cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc",
//     timestamp: Math.floor(Date.now() / 1000) - 3600,
//     uploader: "0x1111111111111111111111111111111111111111",
//     verified: true,
//   },
// ]

// export async function getForeChaineContract(provider: BrowserProvider) {
//   const signer = await provider.getSigner()
//   return new Contract(FORECHAIN_CONTRACT_ADDRESS, FORECHAIN_ABI, signer)
// }

// async function isContractDeployed(provider: BrowserProvider): Promise<boolean> {
//   try {
//     if (FORECHAIN_CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
//       console.log("[v0] Contract address is placeholder - using mock data")
//       return false
//     }

//     const code = await provider.getCode(FORECHAIN_CONTRACT_ADDRESS)
//     return code !== "0x"
//   } catch (error) {
//     console.log("[v0] Error checking contract deployment:", error)
//     return false
//   }
// }

// export async function hashAlreadyExists(fileHash: string, provider: BrowserProvider): Promise<boolean> {
//   try {
//     const deployed = await isContractDeployed(provider)

//     if (!deployed) {
//       // For mock data, check if hash exists
//       const hashLower = fileHash.toLowerCase()
//       return MOCK_HASHES.some((h) => h.hash.toLowerCase() === hashLower)
//     }

//     const contract = await getForeChaineContract(provider)
//     // Convert hash to bytes32 for contract call
//     const hashBytes = "0x" + fileHash
//     const exists = await contract.fileHashes(hashBytes)
//     return exists
//   } catch (error) {
//     console.error("[v0] Error checking if hash exists:", error)
//     return false
//   }
// }

// export async function anchorHashToBlockchain(
//   evidenceId: string,
//   fileHash: string,
//   uploaderAddress: string,
//   provider: BrowserProvider,
// ) {
//   try {
//     const deployed = await isContractDeployed(provider)

//     const duplicate = await hashAlreadyExists(fileHash, provider)
//     if (duplicate) {
//       throw new Error("File already recorded on blockchain. Prevent duplicate uploads.")
//     }

//     if (!deployed) {
//       console.log("[v0] Contract not deployed - simulating anchor")
//       // Add to mock data to maintain consistency
//       MOCK_HASHES.push({
//         evidenceId,
//         hash: fileHash.toLowerCase(),
//         timestamp: Math.floor(Date.now() / 1000),
//         uploader: uploaderAddress,
//         verified: true,
//       })

//       return {
//         success: true,
//         txHash: "0x" + Math.random().toString(16).slice(2).padEnd(64, "0"),
//         blockNumber: Math.floor(Math.random() * 1000000),
//         timestamp: new Date().toISOString(),
//         isSimulated: true,
//         evidenceId,
//       }
//     }

//     const contract = await getForeChaineContract(provider)
//     const tx = await contract.anchorHash(evidenceId, fileHash, uploaderAddress)
//     const receipt = await tx.wait()

//     if (!receipt) {
//       throw new Error("Transaction failed - no receipt received")
//     }

//     return {
//       success: true,
//       txHash: tx.hash,
//       blockNumber: receipt.blockNumber,
//       timestamp: new Date().toISOString(),
//       evidenceId,
//     }
//   } catch (error) {
//     console.error("[v0] Blockchain anchoring error:", error)
//     throw error
//   }
// }

// export async function verifyHashOnBlockchain(
//   fileHash: string,
//   provider: BrowserProvider,
// ): Promise<{
//   isVerified: boolean
//   blockchainHash: string | null
//   localHash: string
//   matchStatus: "verified" | "compromised" | "not-found"
// }> {
//   try {
//     const deployed = await isContractDeployed(provider)
//     const fileHashLower = fileHash.toLowerCase()

//     if (!deployed) {
//       console.log("[v0] Contract not deployed - simulating verification")
//       for (const entry of MOCK_HASHES) {
//         if (entry.hash.toLowerCase() === fileHashLower) {
//           return {
//             isVerified: true,
//             blockchainHash: entry.hash,
//             localHash: fileHash,
//             matchStatus: "verified",
//           }
//         }
//       }

//       return {
//         isVerified: false,
//         blockchainHash: null,
//         localHash: fileHash,
//         matchStatus: "not-found",
//       }
//     }

//     const contract = await getForeChaineContract(provider)
//     const allHashes = await contract.getAllHashes()

//     for (const entry of allHashes) {
//       const storedHashClean = (entry.hash as string).replace("0x", "").toLowerCase()
//       if (fileHashLower === storedHashClean) {
//         return {
//           isVerified: true,
//           blockchainHash: storedHashClean,
//           localHash: fileHash,
//           matchStatus: "verified",
//         }
//       }
//     }

//     return {
//       isVerified: false,
//       blockchainHash: null,
//       localHash: fileHash,
//       matchStatus: "not-found",
//     }
//   } catch (error) {
//     console.error("[v0] Hash verification error:", error)
//     throw error
//   }
// }

// export async function getAllStoredHashes(provider: BrowserProvider) {
//   try {
//     const deployed = await isContractDeployed(provider)

//     if (!deployed) {
//       console.log("[v0] Contract not deployed - returning mock data")
//       const uniqueHashes = Array.from(new Map(MOCK_HASHES.map((h) => [h.hash, h])).values())
//       return uniqueHashes.sort((a, b) => b.timestamp - a.timestamp)
//     }

//     const contract = await getForeChaineContract(provider)
//     const hashes = await contract.getAllHashes()

//     const hashMap = new Map()
//     for (const entry of hashes) {
//       const key = (entry.hash as string).toLowerCase()
//       if (!hashMap.has(key)) {
//         hashMap.set(key, {
//           evidenceId: entry.evidenceId,
//           hash: (entry.hash as string).replace("0x", "").toLowerCase(),
//           timestamp: Number(entry.timestamp),
//           uploader: entry.uploader,
//           verified: true,
//         })
//       }
//     }

//     return Array.from(hashMap.values()).sort((a, b) => b.timestamp - a.timestamp)
//   } catch (error) {
//     console.error("[v0] Error fetching hashes:", error)
//     console.log("[v0] Returning mock data due to contract error")
//     return MOCK_HASHES
//   }
// }

// export async function getTotalHashCount(provider: BrowserProvider) {
//   try {
//     const deployed = await isContractDeployed(provider)

//     if (!deployed) {
//       console.log("[v0] Contract not deployed - returning mock count")
//       const unique = new Set(MOCK_HASHES.map((h) => h.hash))
//       return unique.size
//     }

//     const contract = await getForeChaineContract(provider)
//     const total = await contract.getTotalHashes()
//     return Number(total)
//   } catch (error) {
//     console.error("[v0] Error getting hash count:", error)
//     return MOCK_HASHES.length
//   }
// }
import { type BrowserProvider, Contract } from "ethers"

const FORECHAIN_ABI = [
  "function anchorHash(string memory evidenceId, string memory hash, address uploader) public returns (bool)",
  "function getHashByEvidenceId(string memory evidenceId) public view returns (tuple(string evidenceId, bytes32 hash, uint256 timestamp, address uploader))",
  "function getAllHashes() public view returns (tuple(string evidenceId, bytes32 hash, uint256 timestamp, address uploader)[])",
  "function fileHashes(bytes32 hashKey) public view returns (bool)",
  "function getTotalHashes() public view returns (uint256)",
  "function verifyHash(string memory hash) public view returns (bool)",
]

const FORECHAIN_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_FORECHAIN_ADDRESS || "0x0000000000000000000000000000000000000000"

// ----------------------
// 🧠 Local Storage Helpers
// ----------------------

function getLocalHashes() {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem("forechain_hashes")
  return stored ? JSON.parse(stored) : []
}

function saveLocalHashes(hashes: any[]) {
  if (typeof window === "undefined") return
  localStorage.setItem("forechain_hashes", JSON.stringify(hashes))
}

// ----------------------
// 🧱 Core Blockchain Functions
// ----------------------

export async function getForeChaineContract(provider: BrowserProvider) {
  const signer = await provider.getSigner()
  return new Contract(FORECHAIN_CONTRACT_ADDRESS, FORECHAIN_ABI, signer)
}

async function isContractDeployed(provider: BrowserProvider): Promise<boolean> {
  try {
    if (FORECHAIN_CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
      console.log("[v0] Contract address is placeholder - using local data")
      return false
    }
    const code = await provider.getCode(FORECHAIN_CONTRACT_ADDRESS)
    return code !== "0x"
  } catch (error) {
    console.log("[v0] Error checking contract deployment:", error)
    return false
  }
}

// ----------------------
// 🔍 Check if hash already exists
// ----------------------
export async function hashAlreadyExists(fileHash: string, provider: BrowserProvider): Promise<boolean> {
  try {
    const deployed = await isContractDeployed(provider)
    const hashLower = fileHash.toLowerCase()

    if (!deployed) {
      const hashes = getLocalHashes()
      return hashes.some((h) => h.hash.toLowerCase() === hashLower)
    }

    const contract = await getForeChaineContract(provider)
    const hashBytes = "0x" + fileHash
    return await contract.fileHashes(hashBytes)
  } catch (error) {
    console.error("[v0] Error checking if hash exists:", error)
    return false
  }
}

// ----------------------
// ⛓️ Anchor hash locally or on blockchain
// ----------------------
export async function anchorHashToBlockchain(
  evidenceId: string,
  fileHash: string,
  uploaderAddress: string,
  provider: BrowserProvider,
) {
  try {
    const deployed = await isContractDeployed(provider)
    const duplicate = await hashAlreadyExists(fileHash, provider)

    if (duplicate) throw new Error("File already recorded. Prevent duplicate uploads.")

    if (!deployed) {
      console.log("[v0] Contract not deployed - storing locally")

      const hashes = getLocalHashes()
      const newEntry = {
        evidenceId,
        hash: fileHash.toLowerCase(),
        timestamp: Math.floor(Date.now() / 1000),
        uploader: uploaderAddress,
        verified: true,
      }

      hashes.push(newEntry)
      saveLocalHashes(hashes)

      return {
        success: true,
        txHash: "0x" + Math.random().toString(16).slice(2).padEnd(64, "0"),
        blockNumber: Math.floor(Math.random() * 1000000),
        timestamp: new Date().toISOString(),
        isSimulated: true,
        evidenceId,
      }
    }

    // Real blockchain mode
    const contract = await getForeChaineContract(provider)
    const tx = await contract.anchorHash(evidenceId, fileHash, uploaderAddress)
    const receipt = await tx.wait()

    if (!receipt) throw new Error("Transaction failed - no receipt received")

    return {
      success: true,
      txHash: tx.hash,
      blockNumber: receipt.blockNumber,
      timestamp: new Date().toISOString(),
      evidenceId,
    }
  } catch (error) {
    console.error("[v0] Blockchain anchoring error:", error)
    throw error
  }
}

// ----------------------
// 🔎 Verify hash
// ----------------------
export async function verifyHashOnBlockchain(fileHash: string, provider: BrowserProvider) {
  try {
    const deployed = await isContractDeployed(provider)
    const fileHashLower = fileHash.toLowerCase()

    if (!deployed) {
      const hashes = getLocalHashes()
      const match = hashes.find((h) => h.hash.toLowerCase() === fileHashLower)

      if (match) {
        return {
          isVerified: true,
          blockchainHash: match.hash,
          localHash: fileHash,
          matchStatus: "verified" as const,
        }
      }

      return {
        isVerified: false,
        blockchainHash: null,
        localHash: fileHash,
        matchStatus: "not-found" as const,
      }
    }

    const contract = await getForeChaineContract(provider)
    const allHashes = await contract.getAllHashes()
    const found = allHashes.find(
      (entry: any) => fileHashLower === (entry.hash as string).replace("0x", "").toLowerCase(),
    )

    if (found) {
      return {
        isVerified: true,
        blockchainHash: found.hash,
        localHash: fileHash,
        matchStatus: "verified" as const,
      }
    }

    return {
      isVerified: false,
      blockchainHash: null,
      localHash: fileHash,
      matchStatus: "not-found" as const,
    }
  } catch (error) {
    console.error("[v0] Hash verification error:", error)
    throw error
  }
}

// ----------------------
// 📜 Get all stored hashes
// ----------------------
export async function getAllStoredHashes(provider: BrowserProvider) {
  try {
    const deployed = await isContractDeployed(provider)

    if (!deployed) {
      console.log("[v0] Using local stored hashes")
      const hashes = getLocalHashes()
      const unique = Array.from(new Map(hashes.map((h) => [h.hash, h])).values())
      return unique.sort((a, b) => b.timestamp - a.timestamp)
    }

    const contract = await getForeChaineContract(provider)
    const hashes = await contract.getAllHashes()

    return hashes.map((entry: any) => ({
      evidenceId: entry.evidenceId,
      hash: (entry.hash as string).replace("0x", "").toLowerCase(),
      timestamp: Number(entry.timestamp),
      uploader: entry.uploader,
      verified: true,
    }))
  } catch (error) {
    console.error("[v0] Error fetching hashes:", error)
    return getLocalHashes()
  }
}

// ----------------------
// 🔢 Get total hashes
// ----------------------
export async function getTotalHashCount(provider: BrowserProvider) {
  try {
    const deployed = await isContractDeployed(provider)

    if (!deployed) {
      const hashes = getLocalHashes()
      const unique = new Set(hashes.map((h) => h.hash))
      return unique.size
    }

    const contract = await getForeChaineContract(provider)
    const total = await contract.getTotalHashes()
    return Number(total)
  } catch (error) {
    console.error("[v0] Error getting hash count:", error)
    return getLocalHashes().length
  }
}
