const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Starting deployment of PrivateMuseumVisitTracker...");
  console.log("=".repeat(50));

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Check balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");

  if (balance === 0n) {
    throw new Error("Deployer account has no funds");
  }

  console.log("\nDeploying PrivateMuseumVisitTracker contract...");

  // Deploy the contract
  const PrivateMuseumVisitTracker = await hre.ethers.getContractFactory(
    "PrivateMuseumVisitTracker"
  );

  const contract = await PrivateMuseumVisitTracker.deploy();
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log("✓ PrivateMuseumVisitTracker deployed to:", contractAddress);

  // Get deployment transaction
  const deployTx = contract.deploymentTransaction();
  console.log("Deployment transaction hash:", deployTx.hash);

  // Wait for confirmations
  console.log("\nWaiting for confirmations...");
  await deployTx.wait(3);
  console.log("✓ Deployment confirmed");

  // Get network information
  const network = await hre.ethers.provider.getNetwork();
  console.log("\nNetwork Information:");
  console.log("- Network Name:", network.name);
  console.log("- Chain ID:", network.chainId);

  // Verify initial state
  console.log("\nVerifying initial contract state...");
  const owner = await contract.owner();
  const museumManager = await contract.museumManager();
  const totalExhibitions = await contract.totalExhibitions();
  const totalRegisteredVisitors = await contract.totalRegisteredVisitors();

  console.log("- Owner:", owner);
  console.log("- Museum Manager:", museumManager);
  console.log("- Total Exhibitions:", totalExhibitions.toString());
  console.log("- Total Registered Visitors:", totalRegisteredVisitors.toString());

  // Save deployment information
  const deploymentInfo = {
    contractName: "PrivateMuseumVisitTracker",
    contractAddress: contractAddress,
    deployer: deployer.address,
    owner: owner,
    museumManager: museumManager,
    network: {
      name: network.name,
      chainId: network.chainId.toString(),
    },
    transactionHash: deployTx.hash,
    blockNumber: deployTx.blockNumber,
    timestamp: new Date().toISOString(),
    etherscanUrl: `https://${network.name !== "unknown" ? network.name + "." : ""}etherscan.io/address/${contractAddress}`,
  };

  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const filename = `${network.name}_${Date.now()}.json`;
  const filepath = path.join(deploymentsDir, filename);
  fs.writeFileSync(filepath, JSON.stringify(deploymentInfo, null, 2));

  console.log("\n" + "=".repeat(50));
  console.log("Deployment Summary");
  console.log("=".repeat(50));
  console.log("Contract Address:", contractAddress);
  console.log("Network:", network.name, `(Chain ID: ${network.chainId})`);
  console.log("Deployer:", deployer.address);
  console.log("Transaction Hash:", deployTx.hash);
  console.log("Etherscan URL:", deploymentInfo.etherscanUrl);
  console.log("Deployment Info Saved:", filename);
  console.log("=".repeat(50));

  console.log("\nNext Steps:");
  console.log("1. Update .env file with CONTRACT_ADDRESS");
  console.log("2. Run verification: npm run verify");
  console.log("3. Test interaction: npm run interact");
  console.log("4. Update frontend with new contract address");

  return {
    contract,
    contractAddress,
    deploymentInfo,
  };
}

// Handle deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });

module.exports = main;
