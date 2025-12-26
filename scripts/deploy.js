const hre = require("hardhat");

async function main() {
  console.log("Deploying CampaignEscrow contract...\n");

  // Get the deployer's address
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  // Check balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH\n");

  // Deploy the contract
  const CampaignEscrow = await hre.ethers.getContractFactory("CampaignEscrow");
  const escrow = await CampaignEscrow.deploy();

  await escrow.waitForDeployment();
  const contractAddress = await escrow.getAddress();

  console.log("================================================");
  console.log("CampaignEscrow deployed successfully!");
  console.log("================================================");
  console.log("Contract Address:", contractAddress);
  console.log("Network:", hre.network.name);
  console.log("Chain ID:", (await hre.ethers.provider.getNetwork()).chainId.toString());
  console.log("================================================\n");

  // Get initial contract state
  const owner = await escrow.owner();
  const platformFee = await escrow.platformFeeBps();
  
  console.log("Contract Owner:", owner);
  console.log("Platform Fee:", platformFee.toString(), "bps (", Number(platformFee) / 100, "%)");
  console.log("");

  // Verification instructions
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("To verify on Basescan, run:");
    console.log(`npx hardhat verify --network ${hre.network.name} ${contractAddress}`);
    console.log("");
  }

  // Output for frontend integration
  console.log("Add this to your frontend config:");
  console.log("------------------------------------------------");
  console.log(`CAMPAIGN_ESCROW_ADDRESS: "${contractAddress}"`);
  console.log(`NETWORK: "${hre.network.name}"`);
  console.log("------------------------------------------------");

  return contractAddress;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });

