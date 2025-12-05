# Formative Smart Contracts

## CampaignEscrow.sol

A smart contract for escrowing campaign payments on Ethereum-compatible chains.

### Features

- **Escrow Payments**: Funds locked until deliverables approved
- **Platform Fees**: Configurable fee (default 5%)
- **Deadline Protection**: Influencers can claim after deadline
- **Cancellation**: Brands can cancel before deadline for refund

### Deployment

```bash
# Install dependencies
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox

# Compile
npx hardhat compile

# Deploy (testnet)
npx hardhat run scripts/deploy.js --network sepolia

# Deploy (mainnet)
npx hardhat run scripts/deploy.js --network mainnet
```

### Usage

1. Brand creates campaign: `createCampaign(influencer, deadline, campaignId)` with ETH
2. Brand approves: `approveAndRelease(campaignId)` → Payment released to influencer
3. Or cancel: `cancelCampaign(campaignId)` → Refund to brand
4. Or influencer claims: `claimAfterDeadline(campaignId)` → After deadline passes

### Security

- Only brand can approve/cancel
- Only influencer can claim after deadline
- Platform fee goes to contract owner
- All transfers use `call` with checks

