// Smart contract ABI and addresses
export const CAMPAIGN_ESCROW_ABI = [
  {
    inputs: [
      { internalType: "address", name: "_influencer", type: "address" },
      { internalType: "uint256", name: "_deadline", type: "uint256" },
      { internalType: "string", name: "_platformCampaignId", type: "string" }
    ],
    name: "createCampaign",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "_campaignId", type: "uint256" }],
    name: "approveAndRelease",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "_campaignId", type: "uint256" }],
    name: "cancelCampaign",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "_campaignId", type: "uint256" }],
    name: "claimAfterDeadline",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "campaigns",
    outputs: [
      { internalType: "address", name: "brand", type: "address" },
      { internalType: "address", name: "influencer", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "uint256", name: "platformFee", type: "uint256" },
      { internalType: "uint256", name: "deadline", type: "uint256" },
      { internalType: "bool", name: "approved", type: "bool" },
      { internalType: "bool", name: "released", type: "bool" },
      { internalType: "bool", name: "cancelled", type: "bool" },
      { internalType: "string", name: "campaignId", type: "string" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "campaignCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  }
]

// Contract addresses - UPDATE THESE AFTER DEPLOYMENT
export const CONTRACT_ADDRESSES = {
  // Base Sepolia (Testnet) - Deploy here first for testing
  84532: import.meta.env.VITE_ESCROW_CONTRACT_SEPOLIA || '0x0000000000000000000000000000000000000000',
  
  // Base Mainnet - Production deployment
  8453: import.meta.env.VITE_ESCROW_CONTRACT_MAINNET || '0x0000000000000000000000000000000000000000',
  
  // Ethereum Sepolia (Testnet) - Alternative testnet
  11155111: '0x0000000000000000000000000000000000000000',
  
  // Ethereum Mainnet - Not recommended (high gas fees)
  1: '0x0000000000000000000000000000000000000000',
}

// Check if contract is deployed on a given chain
export function isContractDeployed(chainId) {
  const address = CONTRACT_ADDRESSES[chainId]
  return address && address !== '0x0000000000000000000000000000000000000000'
}

export function getContractAddress(chainId) {
  return CONTRACT_ADDRESSES[chainId] || null
}

// Supported chains for escrow (only chains with deployed contracts)
export const SUPPORTED_ESCROW_CHAINS = [84532, 8453] // Base Sepolia, Base Mainnet


