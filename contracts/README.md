# Formative Smart Contracts

## CampaignEscrow.sol

A smart contract for escrowing campaign payments on Base (Ethereum L2).

---

## Features

- **Escrow Payments**: Funds locked until deliverables approved
- **Platform Fees**: Configurable fee (default 5%)
- **Deadline Protection**: Influencers can claim after deadline if brand doesn't respond
- **Cancellation**: Brands can cancel before deadline for full refund

---

## How It Works

1. **Brand creates campaign**: Sends ETH to contract with influencer address and deadline
2. **Brand approves**: After deliverables completed, releases payment to influencer
3. **Or cancel**: Brand can cancel before deadline and get refund
4. **Or influencer claims**: If deadline passes without brand action, influencer can claim

---

## Deployment Guide (Using Remix IDE)

The easiest way to deploy is using Remix - a browser-based IDE. No local setup required.

### Prerequisites

1. **MetaMask** browser extension installed
2. **ETH on Base** for gas fees:
   - Testnet: Get free ETH from [Base Sepolia Faucet](https://www.alchemy.com/faucets/base-sepolia)
   - Mainnet: Bridge ETH to Base via [bridge.base.org](https://bridge.base.org)

### Step 1: Open Remix IDE

Go to [remix.ethereum.org](https://remix.ethereum.org)

### Step 2: Create the Contract File

1. In the File Explorer (left sidebar), click the "+" icon
2. Name it `CampaignEscrow.sol`
3. Copy the entire contents of `contracts/CampaignEscrow.sol` into this file

### Step 3: Compile the Contract

1. Click the "Solidity Compiler" tab (left sidebar, looks like "S")
2. Select compiler version `0.8.20`
3. Click "Compile CampaignEscrow.sol"
4. You should see a green checkmark

### Step 4: Connect MetaMask to Base

1. Open MetaMask
2. Click the network dropdown
3. Select "Add Network" and add Base:

**Base Sepolia (Testnet):**
```
Network Name: Base Sepolia
RPC URL: https://sepolia.base.org
Chain ID: 84532
Currency Symbol: ETH
Block Explorer: https://sepolia.basescan.org
```

**Base Mainnet:**
```
Network Name: Base
RPC URL: https://mainnet.base.org
Chain ID: 8453
Currency Symbol: ETH
Block Explorer: https://basescan.org
```

### Step 5: Deploy the Contract

1. Click the "Deploy & Run Transactions" tab (left sidebar)
2. Change "Environment" to **"Injected Provider - MetaMask"**
3. MetaMask will pop up - connect your wallet
4. Make sure you're on the correct network (Base Sepolia for testing)
5. Select `CampaignEscrow` from the contract dropdown
6. Click **"Deploy"**
7. Confirm the transaction in MetaMask

### Step 6: Save the Contract Address

After deployment:
1. The contract will appear under "Deployed Contracts"
2. Click the copy icon next to the address
3. **Save this address** - you'll need it for the frontend

Example address: `0x1234567890abcdef1234567890abcdef12345678`

### Step 7: Verify on Basescan (Optional but Recommended)

1. Go to [sepolia.basescan.org](https://sepolia.basescan.org) (or basescan.org for mainnet)
2. Search for your contract address
3. Click "Contract" tab, then "Verify & Publish"
4. Select:
   - Compiler Type: Solidity (Single file)
   - Compiler Version: v0.8.20
   - License: MIT
5. Paste your contract code
6. Click "Verify and Publish"

---

## Integrating with the Frontend

### Option 1: Environment Variables (Recommended)

Add to your Railway environment variables:

```
VITE_ESCROW_CONTRACT_SEPOLIA=0xYourTestnetAddress
VITE_ESCROW_CONTRACT_MAINNET=0xYourMainnetAddress
```

### Option 2: Direct Update

Edit `client/src/lib/contracts.js`:

```javascript
export const CONTRACT_ADDRESSES = {
  // Base Sepolia (Testnet)
  84532: "0xYourTestnetAddress",
  
  // Base Mainnet
  8453: "0xYourMainnetAddress",
}
```

---

## Testing the Contract

After deployment, you can test directly in Remix:

### Test 1: Create a Campaign

1. Under "Deployed Contracts", expand your contract
2. Find `createCampaign`
3. Enter:
   - `_influencer`: A test wallet address
   - `_deadline`: Unix timestamp in the future (use [unixtimestamp.com](https://www.unixtimestamp.com))
   - `_platformCampaignId`: Any string like "test-001"
4. In the "VALUE" field above, enter ETH amount (e.g., 0.001)
5. Click "createCampaign"
6. Confirm in MetaMask

### Test 2: Check Campaign

1. Call `getCampaign` with ID `1`
2. You should see the campaign details

### Test 3: Approve and Release

1. Call `approveAndRelease` with ID `1`
2. Funds will be sent to the influencer wallet

---

## Contract Functions

### For Brands

| Function | Description |
|----------|-------------|
| `createCampaign(influencer, deadline, campaignId)` | Create escrow with payment |
| `approveAndRelease(campaignId)` | Approve work and release funds |
| `cancelCampaign(campaignId)` | Cancel and get refund (before deadline) |

### For Influencers

| Function | Description |
|----------|-------------|
| `claimAfterDeadline(campaignId)` | Claim payment if brand doesn't respond |

### View Functions

| Function | Description |
|----------|-------------|
| `getCampaign(campaignId)` | Get campaign details |
| `getBalance()` | Get contract ETH balance |
| `platformFeeBps()` | Get platform fee (basis points) |

---

## Gas Costs

Base has very low gas fees (under $0.01 per transaction typically).

| Function | Approximate Gas |
|----------|-----------------|
| createCampaign | ~150,000 |
| approveAndRelease | ~50,000 |
| cancelCampaign | ~40,000 |

---

## Security Notes

- Only the brand who created a campaign can approve/cancel it
- Only the assigned influencer can claim after deadline
- Platform fee is capped at 10% maximum
- Contract owner (deployer) receives platform fees
- All transfers use safe `call` pattern

---

## Networks Quick Reference

| Network | Chain ID | Faucet/Bridge |
|---------|----------|---------------|
| Base Sepolia | 84532 | [Faucet](https://www.alchemy.com/faucets/base-sepolia) |
| Base Mainnet | 8453 | [Bridge](https://bridge.base.org) |

---

## Troubleshooting

**"Insufficient funds for gas"**
- Make sure you have ETH on Base (not regular Ethereum)
- Use the faucet for testnet

**"Transaction failed"**
- Check you're calling functions with the right account (brand vs influencer)
- Make sure deadline hasn't passed for cancel function

**Contract not showing in Remix**
- Make sure compilation was successful (green checkmark)
- Refresh the page and reconnect MetaMask

---

## Support

For questions, open an issue on GitHub.
