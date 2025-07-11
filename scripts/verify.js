const hre = require("hardhat");
require("dotenv").config();

async function main() {
  console.log("Starting contract verification...");
  console.log("=".repeat(50));

  // Get contract address from environment or command line
  const contractAddress =
    process.env.CONTRACT_ADDRESS || process.argv[2];

  if (!contractAddress) {
    throw new Error(
      "Please provide contract address via CONTRACT_ADDRESS env variable or command line argument"
    );
  }

  console.log("Contract Address:", contractAddress);
  console.log("Network:", hre.network.name);

  // Get network information
  const network = await hre.ethers.provider.getNetwork();
  console.log("Chain ID:", network.chainId);

  // Verify the contract is deployed
  const code = await hre.ethers.provider.getCode(contractAddress);
  if (code === "0x") {
    throw new Error("No contract found at the specified address");
  }

  console.log("✓ Contract code found at address");

  // Verify on Etherscan
  console.log("\nVerifying on Etherscan...");
  console.log("This may take a few moments...");

  try {
    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: [],
    });

    console.log("\n✓ Contract verified successfully!");
    console.log(
      `View on Etherscan: https://${hre.network.name !== "hardhat" ? hre.network.name + "." : ""}etherscan.io/address/${contractAddress}#code`
    );
  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("\n✓ Contract is already verified on Etherscan");
      console.log(
        `View on Etherscan: https://${hre.network.name !== "hardhat" ? hre.network.name + "." : ""}etherscan.io/address/${contractAddress}#code`
      );
    } else {
      throw error;
    }
  }

  // Verify contract functionality
  console.log("\nVerifying contract functionality...");
  const contract = await hre.ethers.getContractAt(
    "PrivateMuseumVisitTracker",
    contractAddress
  );

  const owner = await contract.owner();
  const museumManager = await contract.museumManager();
  const totalExhibitions = await contract.totalExhibitions();
  const totalRegisteredVisitors = await contract.totalRegisteredVisitors();
  const publicStats = await contract.getPublicStats();

  console.log("\nContract State:");
  console.log("- Owner:", owner);
  console.log("- Museum Manager:", museumManager);
  console.log("- Total Exhibitions:", totalExhibitions.toString());
  console.log("- Total Registered Visitors:", totalRegisteredVisitors.toString());
  console.log("- Public Stats:");
  console.log("  - Exhibitions:", publicStats[0].toString());
  console.log("  - Visitors:", publicStats[1].toString());

  console.log("\n" + "=".repeat(50));
  console.log("Verification Complete");
  console.log("=".repeat(50));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Verification failed:");
    console.error(error.message);
    process.exit(1);
  });
