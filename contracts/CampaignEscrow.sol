// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title CampaignEscrow
 * @dev Smart contract for escrowing campaign payments
 * Funds are locked until deliverables are approved
 */
contract CampaignEscrow {
    struct Campaign {
        address brand;           // Brand who created the campaign
        address influencer;      // Influencer receiving payment
        uint256 amount;          // Total payment amount in wei
        uint256 platformFee;     // Platform fee (in basis points, e.g., 500 = 5%)
        uint256 deadline;        // Unix timestamp deadline
        bool approved;           // Whether deliverables are approved
        bool released;           // Whether payment has been released
        bool cancelled;          // Whether campaign was cancelled
        string campaignId;       // Platform campaign ID for reference
    }

    address public owner;        // Platform owner (can update fees)
    uint256 public platformFeeBps = 500; // 5% default platform fee (in basis points)
    
    mapping(uint256 => Campaign) public campaigns;
    uint256 public campaignCount;
    
    event CampaignCreated(
        uint256 indexed campaignId,
        address indexed brand,
        address indexed influencer,
        uint256 amount,
        string platformCampaignId
    );
    
    event CampaignApproved(uint256 indexed campaignId);
    event PaymentReleased(uint256 indexed campaignId, address influencer, uint256 amount);
    event CampaignCancelled(uint256 indexed campaignId, address refundedTo);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    modifier onlyBrand(uint256 _campaignId) {
        require(campaigns[_campaignId].brand == msg.sender, "Not brand");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    /**
     * @dev Create a new escrow campaign
     * @param _influencer Address of the influencer
     * @param _deadline Unix timestamp deadline
     * @param _platformCampaignId Platform campaign ID
     */
    function createCampaign(
        address _influencer,
        uint256 _deadline,
        string memory _platformCampaignId
    ) external payable {
        require(msg.value > 0, "Amount must be > 0");
        require(_influencer != address(0), "Invalid influencer");
        require(_deadline > block.timestamp, "Deadline must be in future");
        require(_influencer != msg.sender, "Cannot create campaign for yourself");
        
        uint256 fee = (msg.value * platformFeeBps) / 10000;
        uint256 netAmount = msg.value - fee;
        
        campaignCount++;
        campaigns[campaignCount] = Campaign({
            brand: msg.sender,
            influencer: _influencer,
            amount: netAmount,
            platformFee: fee,
            deadline: _deadline,
            approved: false,
            released: false,
            cancelled: false,
            campaignId: _platformCampaignId
        });
        
        emit CampaignCreated(campaignCount, msg.sender, _influencer, netAmount, _platformCampaignId);
    }
    
    /**
     * @dev Brand approves deliverables and releases payment
     * @param _campaignId Campaign ID
     */
    function approveAndRelease(uint256 _campaignId) external onlyBrand(_campaignId) {
        Campaign storage campaign = campaigns[_campaignId];
        require(!campaign.released, "Already released");
        require(!campaign.cancelled, "Campaign cancelled");
        
        campaign.approved = true;
        campaign.released = true;
        
        // Transfer to influencer
        (bool success, ) = campaign.influencer.call{value: campaign.amount}("");
        require(success, "Transfer failed");
        
        // Transfer platform fee to owner
        if (campaign.platformFee > 0) {
            (bool feeSuccess, ) = owner.call{value: campaign.platformFee}("");
            require(feeSuccess, "Fee transfer failed");
        }
        
        emit CampaignApproved(_campaignId);
        emit PaymentReleased(_campaignId, campaign.influencer, campaign.amount);
    }
    
    /**
     * @dev Brand cancels campaign before deadline (refund)
     * @param _campaignId Campaign ID
     */
    function cancelCampaign(uint256 _campaignId) external onlyBrand(_campaignId) {
        Campaign storage campaign = campaigns[_campaignId];
        require(!campaign.released, "Already released");
        require(!campaign.cancelled, "Already cancelled");
        require(block.timestamp < campaign.deadline, "Past deadline");
        
        campaign.cancelled = true;
        
        // Refund brand (amount + fee)
        uint256 refund = campaign.amount + campaign.platformFee;
        (bool success, ) = campaign.brand.call{value: refund}("");
        require(success, "Refund failed");
        
        emit CampaignCancelled(_campaignId, campaign.brand);
    }
    
    /**
     * @dev Influencer can claim after deadline if not approved (dispute resolution)
     * This allows influencers to claim if brand doesn't respond
     * @param _campaignId Campaign ID
     */
    function claimAfterDeadline(uint256 _campaignId) external {
        Campaign storage campaign = campaigns[_campaignId];
        require(msg.sender == campaign.influencer, "Not influencer");
        require(!campaign.released, "Already released");
        require(!campaign.cancelled, "Campaign cancelled");
        require(block.timestamp >= campaign.deadline, "Deadline not passed");
        require(!campaign.approved, "Not approved by brand");
        
        campaign.released = true;
        
        // Transfer to influencer (they get paid even if brand doesn't approve)
        (bool success, ) = campaign.influencer.call{value: campaign.amount}("");
        require(success, "Transfer failed");
        
        // Platform fee still goes to owner
        if (campaign.platformFee > 0) {
            (bool feeSuccess, ) = owner.call{value: campaign.platformFee}("");
            require(feeSuccess, "Fee transfer failed");
        }
        
        emit PaymentReleased(_campaignId, campaign.influencer, campaign.amount);
    }
    
    /**
     * @dev Update platform fee (owner only)
     * @param _newFeeBps New fee in basis points (e.g., 500 = 5%)
     */
    function setPlatformFee(uint256 _newFeeBps) external onlyOwner {
        require(_newFeeBps <= 1000, "Fee cannot exceed 10%");
        platformFeeBps = _newFeeBps;
    }
    
    /**
     * @dev Get campaign details
     */
    function getCampaign(uint256 _campaignId) external view returns (Campaign memory) {
        return campaigns[_campaignId];
    }
    
    /**
     * @dev Get contract balance
     */
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}

