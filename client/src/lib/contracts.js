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

// Contract addresses (update after deployment)
export const CONTRACT_ADDRESSES = {
  // Testnet (Sepolia)
  11155111: '0x0000000000000000000000000000000000000000', // TODO: Deploy and update
  // Mainnet
  1: '0x0000000000000000000000000000000000000000', // TODO: Deploy and update
  // Base (recommended for lower fees)
  8453: '0x0000000000000000000000000000000000000000', // TODO: Deploy and update
}

export function getContractAddress(chainId) {
  return CONTRACT_ADDRESSES[chainId] || CONTRACT_ADDRESSES[11155111]
}

