import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { CAMPAIGN_ESCROW_ABI, getContractAddress } from '@/lib/contracts'
import { useChainId } from 'wagmi'

export function useCampaignEscrow() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const contractAddress = getContractAddress(chainId)
  
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  // Create escrow campaign
  const createEscrowCampaign = async (influencerAddress, deadline, platformCampaignId, amountEth) => {
    if (!isConnected || !address) {
      throw new Error('Please connect your wallet')
    }

    if (!contractAddress || contractAddress === '0x0000000000000000000000000000000000000000') {
      throw new Error('Contract not deployed on this network. Please switch networks or contact support.')
    }

    const deadlineTimestamp = Math.floor(new Date(deadline).getTime() / 1000)
    const amountWei = parseEther(amountEth.toString())

    return writeContract({
      address: contractAddress,
      abi: CAMPAIGN_ESCROW_ABI,
      functionName: 'createCampaign',
      args: [influencerAddress, BigInt(deadlineTimestamp), platformCampaignId],
      value: amountWei,
    })
  }

  // Approve and release payment
  const approveAndRelease = async (campaignId) => {
    if (!isConnected) {
      throw new Error('Please connect your wallet')
    }

    return writeContract({
      address: contractAddress,
      abi: CAMPAIGN_ESCROW_ABI,
      functionName: 'approveAndRelease',
      args: [BigInt(campaignId)],
    })
  }

  // Cancel campaign
  const cancelCampaign = async (campaignId) => {
    if (!isConnected) {
      throw new Error('Please connect your wallet')
    }

    return writeContract({
      address: contractAddress,
      abi: CAMPAIGN_ESCROW_ABI,
      functionName: 'cancelCampaign',
      args: [BigInt(campaignId)],
    })
  }

  // Claim after deadline (influencer)
  const claimAfterDeadline = async (campaignId) => {
    if (!isConnected) {
      throw new Error('Please connect your wallet')
    }

    return writeContract({
      address: contractAddress,
      abi: CAMPAIGN_ESCROW_ABI,
      functionName: 'claimAfterDeadline',
      args: [BigInt(campaignId)],
    })
  }

  return {
    createEscrowCampaign,
    approveAndRelease,
    cancelCampaign,
    claimAfterDeadline,
    isPending: isPending || isConfirming,
    isSuccess: isConfirmed,
    error,
    hash,
    isConnected,
    address,
    contractAddress,
  }
}

