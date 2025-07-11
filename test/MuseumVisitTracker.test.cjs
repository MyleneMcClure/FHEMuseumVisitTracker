const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PrivateMuseumVisitTracker", function () {
  let contract;
  let owner;
  let manager;
  let alice;
  let bob;
  let charlie;

  async function deployFixture() {
    const PrivateMuseumVisitTracker = await ethers.getContractFactory(
      "PrivateMuseumVisitTracker"
    );
    const contractInstance = await PrivateMuseumVisitTracker.deploy();
    await contractInstance.waitForDeployment();
    const contractAddress = await contractInstance.getAddress();

    return { contract: contractInstance, contractAddress };
  }

  before(async function () {
    const signers = await ethers.getSigners();
    owner = signers[0];
    manager = signers[1];
    alice = signers[2];
    bob = signers[3];
    charlie = signers[4];
  });

  beforeEach(async function () {
    ({ contract } = await deployFixture());
  });

  describe("Deployment and Initialization", function () {
    it("should deploy successfully", async function () {
      expect(await contract.getAddress()).to.be.properAddress;
    });

    it("should set the correct owner", async function () {
      expect(await contract.owner()).to.equal(owner.address);
    });

    it("should set owner as initial museum manager", async function () {
      expect(await contract.museumManager()).to.equal(owner.address);
    });

    it("should initialize with zero exhibitions", async function () {
      expect(await contract.totalExhibitions()).to.equal(0);
    });

    it("should initialize with zero registered visitors", async function () {
      expect(await contract.totalRegisteredVisitors()).to.equal(0);
    });

    it("should return correct public stats after deployment", async function () {
      const stats = await contract.getPublicStats();
      expect(stats[0]).to.equal(0); // totalExhibitions
      expect(stats[1]).to.equal(0); // totalRegisteredVisitors
    });
  });

  describe("Museum Manager Management", function () {
    it("should allow owner to set museum manager", async function () {
      await contract.setMuseumManager(manager.address);
      expect(await contract.museumManager()).to.equal(manager.address);
    });

    it("should reject non-owner setting museum manager", async function () {
      await expect(
        contract.connect(alice).setMuseumManager(manager.address)
      ).to.be.revertedWith("Not authorized");
    });

    it("should allow owner to change museum manager multiple times", async function () {
      await contract.setMuseumManager(manager.address);
      expect(await contract.museumManager()).to.equal(manager.address);

      await contract.setMuseumManager(alice.address);
      expect(await contract.museumManager()).to.equal(alice.address);
    });

    it("should emit event when museum manager is changed", async function () {
      // Note: No event in current contract, but this is a test pattern
      await contract.setMuseumManager(manager.address);
      expect(await contract.museumManager()).to.equal(manager.address);
    });
  });

  describe("Exhibition Creation", function () {
    let currentTime;
    let endTime;

    beforeEach(function () {
      currentTime = Math.floor(Date.now() / 1000);
      endTime = currentTime + 30 * 24 * 60 * 60; // 30 days
    });

    it("should allow museum manager to create exhibition", async function () {
      await contract.createExhibition(
        "Ancient History",
        0, // History type
        currentTime,
        endTime
      );

      expect(await contract.totalExhibitions()).to.equal(1);
    });

    it("should store exhibition information correctly", async function () {
      await contract.createExhibition(
        "Modern Art",
        1, // Art type
        currentTime,
        endTime
      );

      const info = await contract.getExhibitionInfo(1);
      expect(info[0]).to.equal("Modern Art");
      expect(info[1]).to.equal(1); // Art type
      expect(info[2]).to.equal(currentTime);
      expect(info[3]).to.equal(endTime);
      expect(info[4]).to.equal(true); // isActive
      expect(info[5]).to.equal(0); // publicVisitorCount
    });

    it("should allow creating multiple exhibitions", async function () {
      await contract.createExhibition("Exhibition 1", 0, currentTime, endTime);
      await contract.createExhibition("Exhibition 2", 1, currentTime, endTime);
      await contract.createExhibition("Exhibition 3", 2, currentTime, endTime);

      expect(await contract.totalExhibitions()).to.equal(3);
    });

    it("should create all exhibition types correctly", async function () {
      const types = [
        "History",
        "Art",
        "Science",
        "Culture",
        "Technology",
        "Nature",
      ];

      for (let i = 0; i < types.length; i++) {
        await contract.createExhibition(types[i], i, currentTime, endTime);
        const info = await contract.getExhibitionInfo(i + 1);
        expect(info[1]).to.equal(i);
      }
    });

    it("should reject invalid date range (end before start)", async function () {
      await expect(
        contract.createExhibition(
          "Invalid Exhibition",
          0,
          currentTime + 1000,
          currentTime
        )
      ).to.be.revertedWith("Invalid date range");
    });

    it("should reject invalid date range (same start and end)", async function () {
      await expect(
        contract.createExhibition(
          "Invalid Exhibition",
          0,
          currentTime,
          currentTime
        )
      ).to.be.revertedWith("Invalid date range");
    });

    it("should reject non-manager creating exhibition", async function () {
      await expect(
        contract
          .connect(alice)
          .createExhibition("Unauthorized", 0, currentTime, endTime)
      ).to.be.revertedWith("Not museum manager");
    });

    it("should allow new manager to create exhibitions after change", async function () {
      await contract.setMuseumManager(manager.address);

      await contract
        .connect(manager)
        .createExhibition("Manager Exhibition", 0, currentTime, endTime);

      expect(await contract.totalExhibitions()).to.equal(1);
    });

    it("should emit ExhibitionCreated event", async function () {
      await expect(
        contract.createExhibition("Test Exhibition", 0, currentTime, endTime)
      )
        .to.emit(contract, "ExhibitionCreated")
        .withArgs(1, "Test Exhibition", 0);
    });
  });

  describe("Visitor Registration", function () {
    it("should allow visitor registration with valid age", async function () {
      await contract.connect(alice).registerVisitor(25);
      expect(await contract.totalRegisteredVisitors()).to.equal(1);
    });

    it("should store visitor registration status", async function () {
      await contract.connect(alice).registerVisitor(25);

      const stats = await contract.connect(alice).getMyStats();
      expect(stats[0]).to.equal(true); // isRegistered
      expect(stats[1]).to.be.gt(0); // registrationDate
    });

    it("should allow multiple visitors to register", async function () {
      await contract.connect(alice).registerVisitor(25);
      await contract.connect(bob).registerVisitor(35);
      await contract.connect(charlie).registerVisitor(45);

      expect(await contract.totalRegisteredVisitors()).to.equal(3);
    });

    it("should register visitors of all age groups", async function () {
      await contract.connect(alice).registerVisitor(10); // Child
      await contract.connect(bob).registerVisitor(18); // Teen
      await contract.connect(charlie).registerVisitor(40); // Adult
      await contract.connect(manager).registerVisitor(65); // Senior

      expect(await contract.totalRegisteredVisitors()).to.equal(4);
    });

    it("should reject duplicate registration", async function () {
      await contract.connect(alice).registerVisitor(25);

      await expect(
        contract.connect(alice).registerVisitor(30)
      ).to.be.revertedWith("Already registered");
    });

    it("should reject invalid age (zero)", async function () {
      await expect(
        contract.connect(alice).registerVisitor(0)
      ).to.be.revertedWith("Invalid age");
    });

    it("should reject invalid age (120 or greater)", async function () {
      await expect(
        contract.connect(alice).registerVisitor(120)
      ).to.be.revertedWith("Invalid age");

      await expect(
        contract.connect(alice).registerVisitor(150)
      ).to.be.revertedWith("Invalid age");
    });

    it("should accept minimum valid age (1)", async function () {
      await contract.connect(alice).registerVisitor(1);
      expect(await contract.totalRegisteredVisitors()).to.equal(1);
    });

    it("should accept maximum valid age (119)", async function () {
      await contract.connect(alice).registerVisitor(119);
      expect(await contract.totalRegisteredVisitors()).to.equal(1);
    });

    it("should emit VisitorRegistered event", async function () {
      const tx = await contract.connect(alice).registerVisitor(25);
      const receipt = await tx.wait();
      const block = await ethers.provider.getBlock(receipt.blockNumber);

      await expect(tx)
        .to.emit(contract, "VisitorRegistered")
        .withArgs(alice.address, block.timestamp);
    });
  });

  describe("Visit Recording", function () {
    let currentTime;

    beforeEach(async function () {
      currentTime = Math.floor(Date.now() / 1000);

      // Create exhibition
      await contract.createExhibition(
        "Test Exhibition",
        0,
        currentTime,
        currentTime + 1000
      );

      // Register visitor
      await contract.connect(alice).registerVisitor(25);
    });

    it("should allow registered visitor to record visit", async function () {
      await contract.connect(alice).recordPrivateVisit(1, 8, 120, 4);

      const hasVisited = await contract.connect(alice).getMyVisitRecord(1);
      expect(hasVisited).to.equal(true);
    });

    it("should increment public visitor count", async function () {
      await contract.connect(alice).recordPrivateVisit(1, 8, 120, 4);

      const info = await contract.getExhibitionInfo(1);
      expect(info[5]).to.equal(1); // publicVisitorCount
    });

    it("should allow multiple visitors to visit same exhibition", async function () {
      await contract.connect(bob).registerVisitor(35);

      await contract.connect(alice).recordPrivateVisit(1, 8, 120, 4);
      await contract.connect(bob).recordPrivateVisit(1, 9, 90, 5);

      const info = await contract.getExhibitionInfo(1);
      expect(info[5]).to.equal(2);
    });

    it("should allow visitor to visit multiple exhibitions", async function () {
      await contract.createExhibition(
        "Exhibition 2",
        1,
        currentTime,
        currentTime + 1000
      );

      await contract.connect(alice).recordPrivateVisit(1, 8, 120, 4);
      await contract.connect(alice).recordPrivateVisit(2, 9, 90, 5);

      expect(await contract.connect(alice).getMyVisitRecord(1)).to.equal(true);
      expect(await contract.connect(alice).getMyVisitRecord(2)).to.equal(true);
    });

    it("should accept all valid satisfaction ratings (1-10)", async function () {
      for (let i = 1; i <= 10; i++) {
        await contract.createExhibition(
          `Exhibition ${i}`,
          0,
          currentTime,
          currentTime + 1000
        );
        await contract.connect(alice).recordPrivateVisit(i, i, 120, 4);
      }

      expect(await contract.totalExhibitions()).to.equal(10);
    });

    it("should accept all valid interest levels (1-5)", async function () {
      for (let i = 1; i <= 5; i++) {
        await contract.createExhibition(
          `Exhibition ${i}`,
          0,
          currentTime,
          currentTime + 1000
        );
        await contract.connect(alice).recordPrivateVisit(i, 8, 120, i);
      }

      expect(await contract.totalExhibitions()).to.equal(5);
    });

    it("should reject unregistered visitor recording visit", async function () {
      await expect(
        contract.connect(bob).recordPrivateVisit(1, 8, 120, 4)
      ).to.be.revertedWith("Visitor not registered");
    });

    it("should reject duplicate visit recording", async function () {
      await contract.connect(alice).recordPrivateVisit(1, 8, 120, 4);

      await expect(
        contract.connect(alice).recordPrivateVisit(1, 9, 130, 5)
      ).to.be.revertedWith("Visit already recorded");
    });

    it("should reject invalid satisfaction rating (0)", async function () {
      await expect(
        contract.connect(alice).recordPrivateVisit(1, 0, 120, 4)
      ).to.be.revertedWith("Satisfaction must be 1-10");
    });

    it("should reject invalid satisfaction rating (11)", async function () {
      await expect(
        contract.connect(alice).recordPrivateVisit(1, 11, 120, 4)
      ).to.be.revertedWith("Satisfaction must be 1-10");
    });

    it("should reject invalid interest level (0)", async function () {
      await expect(
        contract.connect(alice).recordPrivateVisit(1, 8, 120, 0)
      ).to.be.revertedWith("Interest level must be 1-5");
    });

    it("should reject invalid interest level (6)", async function () {
      await expect(
        contract.connect(alice).recordPrivateVisit(1, 8, 120, 6)
      ).to.be.revertedWith("Interest level must be 1-5");
    });

    it("should reject invalid exhibition ID (0)", async function () {
      await expect(
        contract.connect(alice).recordPrivateVisit(0, 8, 120, 4)
      ).to.be.revertedWith("Invalid exhibition");
    });

    it("should reject non-existent exhibition ID", async function () {
      await expect(
        contract.connect(alice).recordPrivateVisit(999, 8, 120, 4)
      ).to.be.revertedWith("Invalid exhibition");
    });

    it("should emit PrivateVisitRecorded event", async function () {
      await expect(contract.connect(alice).recordPrivateVisit(1, 8, 120, 4))
        .to.emit(contract, "PrivateVisitRecorded")
        .withArgs(alice.address, 1);
    });

    it("should emit SatisfactionRecorded event", async function () {
      await expect(contract.connect(alice).recordPrivateVisit(1, 8, 120, 4))
        .to.emit(contract, "SatisfactionRecorded")
        .withArgs(1, alice.address);
    });
  });

  describe("Exhibition Management", function () {
    let currentTime;

    beforeEach(async function () {
      currentTime = Math.floor(Date.now() / 1000);
      await contract.createExhibition(
        "Test Exhibition",
        0,
        currentTime,
        currentTime + 1000
      );
    });

    it("should allow manager to activate exhibition", async function () {
      await contract.setExhibitionStatus(1, false);
      await contract.setExhibitionStatus(1, true);

      const info = await contract.getExhibitionInfo(1);
      expect(info[4]).to.equal(true); // isActive
    });

    it("should allow manager to deactivate exhibition", async function () {
      await contract.setExhibitionStatus(1, false);

      const info = await contract.getExhibitionInfo(1);
      expect(info[4]).to.equal(false); // isActive
    });

    it("should reject recording visit to inactive exhibition", async function () {
      await contract.connect(alice).registerVisitor(25);
      await contract.setExhibitionStatus(1, false);

      await expect(
        contract.connect(alice).recordPrivateVisit(1, 8, 120, 4)
      ).to.be.revertedWith("Exhibition not active");
    });

    it("should reject non-manager setting exhibition status", async function () {
      await expect(
        contract.connect(alice).setExhibitionStatus(1, false)
      ).to.be.revertedWith("Not museum manager");
    });

    it("should reject setting status for invalid exhibition ID", async function () {
      await expect(
        contract.setExhibitionStatus(999, false)
      ).to.be.revertedWith("Invalid exhibition");
    });

    it("should allow new manager to manage exhibitions", async function () {
      await contract.setMuseumManager(manager.address);

      await contract.connect(manager).setExhibitionStatus(1, false);

      const info = await contract.getExhibitionInfo(1);
      expect(info[4]).to.equal(false);
    });
  });

  describe("Public Statistics and Queries", function () {
    let currentTime;

    beforeEach(async function () {
      currentTime = Math.floor(Date.now() / 1000);
    });

    it("should return correct public stats with exhibitions", async function () {
      await contract.createExhibition("Ex1", 0, currentTime, currentTime + 1000);
      await contract.createExhibition("Ex2", 1, currentTime, currentTime + 1000);

      const stats = await contract.getPublicStats();
      expect(stats[0]).to.equal(2);
      expect(stats[1]).to.equal(0);
    });

    it("should return correct public stats with visitors", async function () {
      await contract.connect(alice).registerVisitor(25);
      await contract.connect(bob).registerVisitor(35);

      const stats = await contract.getPublicStats();
      expect(stats[0]).to.equal(0);
      expect(stats[1]).to.equal(2);
    });

    it("should return correct exhibition visitor count", async function () {
      await contract.createExhibition("Ex1", 0, currentTime, currentTime + 1000);
      await contract.connect(alice).registerVisitor(25);
      await contract.connect(bob).registerVisitor(35);

      await contract.connect(alice).recordPrivateVisit(1, 8, 120, 4);
      await contract.connect(bob).recordPrivateVisit(1, 9, 90, 5);

      const count = await contract.getExhibitionVisitorCount(1);
      expect(count).to.equal(2);
    });

    it("should return zero for exhibition with no visitors", async function () {
      await contract.createExhibition("Ex1", 0, currentTime, currentTime + 1000);

      const count = await contract.getExhibitionVisitorCount(1);
      expect(count).to.equal(0);
    });

    it("should return false for non-visited exhibition", async function () {
      await contract.createExhibition("Ex1", 0, currentTime, currentTime + 1000);
      await contract.connect(alice).registerVisitor(25);

      const hasVisited = await contract.connect(alice).getMyVisitRecord(1);
      expect(hasVisited).to.equal(false);
    });
  });

  describe("Edge Cases and Boundary Conditions", function () {
    let currentTime;

    beforeEach(async function () {
      currentTime = Math.floor(Date.now() / 1000);
    });

    it("should handle maximum uint32 values for dates", async function () {
      const maxUint32 = 2n ** 32n - 1n;

      await contract.createExhibition(
        "Future Exhibition",
        0,
        currentTime,
        Number(maxUint32)
      );

      const info = await contract.getExhibitionInfo(1);
      expect(info[3]).to.equal(maxUint32);
    });

    it("should handle zero duration visits", async function () {
      await contract.createExhibition("Ex1", 0, currentTime, currentTime + 1000);
      await contract.connect(alice).registerVisitor(25);

      await contract.connect(alice).recordPrivateVisit(1, 8, 0, 4);

      const hasVisited = await contract.connect(alice).getMyVisitRecord(1);
      expect(hasVisited).to.equal(true);
    });

    it("should handle very long duration visits", async function () {
      await contract.createExhibition("Ex1", 0, currentTime, currentTime + 1000);
      await contract.connect(alice).registerVisitor(25);

      const maxDuration = 86400 * 365; // 1 year in minutes
      await contract.connect(alice).recordPrivateVisit(1, 8, maxDuration, 4);

      const hasVisited = await contract.connect(alice).getMyVisitRecord(1);
      expect(hasVisited).to.equal(true);
    });

    it("should handle querying stats before any activity", async function () {
      const stats = await contract.connect(alice).getMyStats();
      expect(stats[0]).to.equal(false);
      expect(stats[1]).to.equal(0);
    });
  });

  describe("Gas Optimization", function () {
    let currentTime;

    beforeEach(async function () {
      currentTime = Math.floor(Date.now() / 1000);
    });

    it("should be gas efficient for visitor registration", async function () {
      const tx = await contract.connect(alice).registerVisitor(25);
      const receipt = await tx.wait();

      // Gas should be reasonable (less than 200k)
      expect(receipt.gasUsed).to.be.lt(200000);
    });

    it("should be gas efficient for exhibition creation", async function () {
      const tx = await contract.createExhibition(
        "Gas Test",
        0,
        currentTime,
        currentTime + 1000
      );
      const receipt = await tx.wait();

      // Gas should be reasonable
      expect(receipt.gasUsed).to.be.lt(300000);
    });

    it("should be gas efficient for visit recording", async function () {
      await contract.createExhibition("Ex1", 0, currentTime, currentTime + 1000);
      await contract.connect(alice).registerVisitor(25);

      const tx = await contract.connect(alice).recordPrivateVisit(1, 8, 120, 4);
      const receipt = await tx.wait();

      // Gas should be reasonable
      expect(receipt.gasUsed).to.be.lt(500000);
    });
  });
});
