const hre = require("hardhat");
require("dotenv").config();

async function main() {
  console.log("Interacting with PrivateMuseumVisitTracker...");
  console.log("=".repeat(50));

  // Get contract address
  const contractAddress = process.env.CONTRACT_ADDRESS || process.argv[2];

  if (!contractAddress) {
    throw new Error(
      "Please provide contract address via CONTRACT_ADDRESS env variable or command line argument"
    );
  }

  console.log("Contract Address:", contractAddress);
  console.log("Network:", hre.network.name);

  // Get signers
  const [deployer, visitor1, visitor2] = await hre.ethers.getSigners();
  console.log("\nAccounts:");
  console.log("- Deployer/Manager:", deployer.address);
  console.log("- Visitor 1:", visitor1.address);
  console.log("- Visitor 2:", visitor2.address);

  // Connect to contract
  const contract = await hre.ethers.getContractAt(
    "PrivateMuseumVisitTracker",
    contractAddress
  );

  // Display initial state
  console.log("\n" + "=".repeat(50));
  console.log("Initial Contract State");
  console.log("=".repeat(50));
  const publicStats = await contract.getPublicStats();
  console.log("Total Exhibitions:", publicStats[0].toString());
  console.log("Total Registered Visitors:", publicStats[1].toString());

  // Check if we should perform setup operations
  const shouldSetup = publicStats[0] === 0n;

  if (shouldSetup) {
    console.log("\n" + "=".repeat(50));
    console.log("Creating Sample Exhibitions");
    console.log("=".repeat(50));

    const exhibitions = [
      {
        name: "Ancient Civilizations",
        type: 0, // History
        startDate: Math.floor(Date.now() / 1000),
        endDate: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
      },
      {
        name: "Modern Art Collection",
        type: 1, // Art
        startDate: Math.floor(Date.now() / 1000),
        endDate: Math.floor(Date.now() / 1000) + 60 * 24 * 60 * 60,
      },
      {
        name: "Space Exploration",
        type: 2, // Science
        startDate: Math.floor(Date.now() / 1000),
        endDate: Math.floor(Date.now() / 1000) + 90 * 24 * 60 * 60,
      },
    ];

    for (let i = 0; i < exhibitions.length; i++) {
      console.log(`\nCreating Exhibition ${i + 1}: ${exhibitions[i].name}`);
      const tx = await contract.createExhibition(
        exhibitions[i].name,
        exhibitions[i].type,
        exhibitions[i].startDate,
        exhibitions[i].endDate
      );
      await tx.wait();
      console.log("✓ Exhibition created, Transaction:", tx.hash);
    }
  }

  // Get exhibition information
  console.log("\n" + "=".repeat(50));
  console.log("Exhibition Information");
  console.log("=".repeat(50));

  const totalExhibitions = await contract.totalExhibitions();
  console.log("Total Exhibitions:", totalExhibitions.toString());

  for (let i = 1; i <= totalExhibitions; i++) {
    const info = await contract.getExhibitionInfo(i);
    console.log(`\nExhibition ${i}:`);
    console.log("  Name:", info[0]);
    console.log("  Type:", getExhibitionTypeName(info[1]));
    console.log("  Start Date:", new Date(Number(info[2]) * 1000).toLocaleString());
    console.log("  End Date:", new Date(Number(info[3]) * 1000).toLocaleString());
    console.log("  Active:", info[4]);
    console.log("  Public Visitor Count:", info[5].toString());
  }

  // Register visitors (if needed)
  if (shouldSetup) {
    console.log("\n" + "=".repeat(50));
    console.log("Registering Sample Visitors");
    console.log("=".repeat(50));

    console.log("\nRegistering Visitor 1 (age 25)...");
    const tx1 = await contract.connect(visitor1).registerVisitor(25);
    await tx1.wait();
    console.log("✓ Visitor 1 registered, Transaction:", tx1.hash);

    console.log("\nRegistering Visitor 2 (age 45)...");
    const tx2 = await contract.connect(visitor2).registerVisitor(45);
    await tx2.wait();
    console.log("✓ Visitor 2 registered, Transaction:", tx2.hash);
  }

  // Check visitor registration status
  console.log("\n" + "=".repeat(50));
  console.log("Visitor Status");
  console.log("=".repeat(50));

  const visitor1Stats = await contract.connect(visitor1).getMyStats();
  console.log("\nVisitor 1:");
  console.log("  Registered:", visitor1Stats[0]);
  if (visitor1Stats[0]) {
    console.log(
      "  Registration Date:",
      new Date(Number(visitor1Stats[1]) * 1000).toLocaleString()
    );
  }

  const visitor2Stats = await contract.connect(visitor2).getMyStats();
  console.log("\nVisitor 2:");
  console.log("  Registered:", visitor2Stats[0]);
  if (visitor2Stats[0]) {
    console.log(
      "  Registration Date:",
      new Date(Number(visitor2Stats[1]) * 1000).toLocaleString()
    );
  }

  // Record sample visits (if visitors are registered)
  if (visitor1Stats[0] && totalExhibitions > 0n) {
    console.log("\n" + "=".repeat(50));
    console.log("Recording Sample Visits");
    console.log("=".repeat(50));

    const hasVisited = await contract.connect(visitor1).getMyVisitRecord(1);
    if (!hasVisited) {
      console.log("\nVisitor 1 visiting Exhibition 1...");
      const tx = await contract
        .connect(visitor1)
        .recordPrivateVisit(1, 9, 120, 5);
      await tx.wait();
      console.log("✓ Visit recorded, Transaction:", tx.hash);
    } else {
      console.log("\nVisitor 1 has already visited Exhibition 1");
    }
  }

  // Display final state
  console.log("\n" + "=".repeat(50));
  console.log("Final Contract State");
  console.log("=".repeat(50));

  const finalStats = await contract.getPublicStats();
  console.log("Total Exhibitions:", finalStats[0].toString());
  console.log("Total Registered Visitors:", finalStats[1].toString());

  console.log("\n" + "=".repeat(50));
  console.log("Interaction Complete");
  console.log("=".repeat(50));
  console.log("\nContract is ready for use!");
  console.log("Visitors can now register and record their museum visits.");
}

function getExhibitionTypeName(type) {
  const types = [
    "History",
    "Art",
    "Science",
    "Culture",
    "Technology",
    "Nature",
  ];
  return types[Number(type)] || "Unknown";
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Interaction failed:");
    console.error(error);
    process.exit(1);
  });
