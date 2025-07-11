const hre = require("hardhat");

async function main() {
  console.log("Starting Museum Visit Tracker Simulation...");
  console.log("=".repeat(50));

  // Deploy contract to local network
  console.log("\n[1/6] Deploying Contract to Local Network");
  console.log("-".repeat(50));

  const [owner, manager, visitor1, visitor2, visitor3] =
    await hre.ethers.getSigners();

  console.log("Accounts:");
  console.log("- Owner:", owner.address);
  console.log("- Manager:", manager.address);
  console.log("- Visitor 1:", visitor1.address);
  console.log("- Visitor 2:", visitor2.address);
  console.log("- Visitor 3:", visitor3.address);

  const PrivateMuseumVisitTracker = await hre.ethers.getContractFactory(
    "PrivateMuseumVisitTracker"
  );
  const contract = await PrivateMuseumVisitTracker.deploy();
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log("\n✓ Contract deployed to:", contractAddress);

  // Verify initial state
  console.log("\n[2/6] Verifying Initial State");
  console.log("-".repeat(50));

  const initialStats = await contract.getPublicStats();
  console.log("Initial Exhibitions:", initialStats[0].toString());
  console.log("Initial Registered Visitors:", initialStats[1].toString());

  // Set museum manager
  console.log("\n[3/6] Setting Museum Manager");
  console.log("-".repeat(50));

  const setManagerTx = await contract.setMuseumManager(manager.address);
  await setManagerTx.wait();
  console.log("✓ Museum manager set to:", manager.address);

  // Create multiple exhibitions
  console.log("\n[4/6] Creating Multiple Exhibitions");
  console.log("-".repeat(50));

  const currentTime = Math.floor(Date.now() / 1000);
  const exhibitions = [
    {
      name: "Ancient Civilizations: Egypt and Mesopotamia",
      type: 0, // History
      duration: 30,
    },
    {
      name: "Renaissance Masters: Art Through the Ages",
      type: 1, // Art
      duration: 45,
    },
    {
      name: "Quantum Physics: The Science of the Universe",
      type: 2, // Science
      duration: 60,
    },
    {
      name: "Indigenous Cultures: Heritage and Traditions",
      type: 3, // Culture
      duration: 40,
    },
    {
      name: "AI and Robotics: Technology of Tomorrow",
      type: 4, // Technology
      duration: 35,
    },
    {
      name: "Biodiversity: Exploring Natural Wonders",
      type: 5, // Nature
      duration: 50,
    },
  ];

  for (let i = 0; i < exhibitions.length; i++) {
    const ex = exhibitions[i];
    const tx = await contract
      .connect(manager)
      .createExhibition(
        ex.name,
        ex.type,
        currentTime,
        currentTime + ex.duration * 24 * 60 * 60
      );
    await tx.wait();
    console.log(`✓ Created: ${ex.name}`);
  }

  // Register visitors
  console.log("\n[5/6] Registering Visitors");
  console.log("-".repeat(50));

  const visitors = [
    { signer: visitor1, age: 25, name: "Visitor 1 (Adult, Age 25)" },
    { signer: visitor2, age: 45, name: "Visitor 2 (Adult, Age 45)" },
    { signer: visitor3, age: 65, name: "Visitor 3 (Senior, Age 65)" },
  ];

  for (const visitor of visitors) {
    const tx = await contract.connect(visitor.signer).registerVisitor(visitor.age);
    await tx.wait();
    console.log(`✓ Registered: ${visitor.name}`);
  }

  // Record visits and feedback
  console.log("\n[6/6] Recording Museum Visits");
  console.log("-".repeat(50));

  const visits = [
    {
      visitor: visitor1,
      name: "Visitor 1",
      exhibitionId: 1,
      satisfaction: 8,
      duration: 90,
      interest: 4,
      exhibitionName: "Ancient Civilizations",
    },
    {
      visitor: visitor1,
      name: "Visitor 1",
      exhibitionId: 2,
      satisfaction: 9,
      duration: 120,
      interest: 5,
      exhibitionName: "Renaissance Masters",
    },
    {
      visitor: visitor2,
      name: "Visitor 2",
      exhibitionId: 3,
      satisfaction: 10,
      duration: 150,
      interest: 5,
      exhibitionName: "Quantum Physics",
    },
    {
      visitor: visitor2,
      name: "Visitor 2",
      exhibitionId: 5,
      satisfaction: 7,
      duration: 60,
      interest: 3,
      exhibitionName: "AI and Robotics",
    },
    {
      visitor: visitor3,
      name: "Visitor 3",
      exhibitionId: 4,
      satisfaction: 9,
      duration: 100,
      interest: 5,
      exhibitionName: "Indigenous Cultures",
    },
    {
      visitor: visitor3,
      name: "Visitor 3",
      exhibitionId: 6,
      satisfaction: 10,
      duration: 130,
      interest: 5,
      exhibitionName: "Biodiversity",
    },
  ];

  for (const visit of visits) {
    const tx = await contract
      .connect(visit.visitor)
      .recordPrivateVisit(
        visit.exhibitionId,
        visit.satisfaction,
        visit.duration,
        visit.interest
      );
    await tx.wait();
    console.log(
      `✓ ${visit.name} visited "${visit.exhibitionName}" (Satisfaction: ${visit.satisfaction}/10, Duration: ${visit.duration}min)`
    );
  }

  // Display simulation results
  console.log("\n" + "=".repeat(50));
  console.log("Simulation Results");
  console.log("=".repeat(50));

  const finalStats = await contract.getPublicStats();
  console.log("\nOverall Statistics:");
  console.log("- Total Exhibitions:", finalStats[0].toString());
  console.log("- Total Registered Visitors:", finalStats[1].toString());
  console.log("- Total Recorded Visits:", visits.length);

  console.log("\nExhibition Details:");
  for (let i = 1; i <= exhibitions.length; i++) {
    const info = await contract.getExhibitionInfo(i);
    console.log(`\n${i}. ${info[0]}`);
    console.log(`   Type: ${getExhibitionTypeName(info[1])}`);
    console.log(`   Active: ${info[4]}`);
    console.log(`   Public Visitor Count: ${info[5].toString()}`);
  }

  console.log("\nVisitor Statistics:");
  for (let i = 0; i < visitors.length; i++) {
    const visitor = visitors[i];
    const stats = await contract.connect(visitor.signer).getMyStats();
    const visitorVisits = visits.filter((v) => v.visitor === visitor.signer);

    console.log(`\n${visitor.name}:`);
    console.log(`   Registered: ${stats[0]}`);
    console.log(
      `   Registration Date: ${new Date(Number(stats[1]) * 1000).toLocaleString()}`
    );
    console.log(`   Total Visits: ${visitorVisits.length}`);
    console.log(
      `   Average Satisfaction: ${(
        visitorVisits.reduce((sum, v) => sum + v.satisfaction, 0) /
        visitorVisits.length
      ).toFixed(1)}/10`
    );
  }

  console.log("\n" + "=".repeat(50));
  console.log("Privacy Features Active:");
  console.log("=".repeat(50));
  console.log("✓ Individual ages encrypted (euint8)");
  console.log("✓ Satisfaction ratings encrypted (euint8)");
  console.log("✓ Interest levels encrypted (euint8)");
  console.log("✓ Visit durations encrypted (euint32)");
  console.log("✓ Only aggregate counts publicly visible");
  console.log("✓ Individual feedback remains private");

  console.log("\n" + "=".repeat(50));
  console.log("Simulation Complete");
  console.log("=".repeat(50));
  console.log("\nContract Address:", contractAddress);
  console.log("Network: Local Hardhat Network");
  console.log("\nThe simulation demonstrates:");
  console.log("1. Multiple exhibition creation");
  console.log("2. Visitor registration with encrypted ages");
  console.log("3. Private visit recording with encrypted feedback");
  console.log("4. Aggregate statistics without privacy compromise");
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
    console.error("\n❌ Simulation failed:");
    console.error(error);
    process.exit(1);
  });
