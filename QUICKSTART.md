# Quick Start Guide

Get started with the Privacy-Preserving Museum Visit Tracker in minutes!

## Prerequisites Checklist

- [ ] Node.js v18+ installed
- [ ] npm or yarn installed
- [ ] MetaMask wallet installed
- [ ] Sepolia testnet ETH (get from faucet)
- [ ] Etherscan API key (optional, for verification)

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env file with your credentials
# Required:
# - SEPOLIA_RPC_URL (default: https://rpc.sepolia.org)
# - PRIVATE_KEY (your wallet private key)
# Optional:
# - ETHERSCAN_API_KEY (for contract verification)
```

### 3. Compile Contracts

```bash
npm run compile
```

Expected output:
```
Compiled 1 Solidity file successfully
```

## Deployment Options

### Option A: Use Existing Deployment (Recommended for Testing)

The contract is already deployed on Sepolia:
- **Address:** `0xe4432488D78fd8CF32b096c385Ca251230427458`
- **Network:** Sepolia Testnet
- **Status:** Verified on Etherscan

Skip to the "Interact with Contract" section below.

### Option B: Deploy New Contract

If you want to deploy your own instance:

```bash
# Deploy to Sepolia testnet
npm run deploy
```

This will:
- Deploy the contract to Sepolia
- Display deployment information
- Save deployment details to `deployments/` folder
- Provide Etherscan link

Expected output:
```
Deploying contracts with account: 0x...
✓ PrivateMuseumVisitTracker deployed to: 0x...
Transaction Hash: 0x...
Etherscan URL: https://sepolia.etherscan.io/address/0x...
```

### Option C: Local Development

For local testing:

```bash
# Terminal 1: Start local node
npm run node

# Terminal 2: Deploy to local network
npm run deploy:local

# Terminal 3: Run simulation
npm run simulate
```

## Verify Contract on Etherscan

```bash
# Add contract address to .env
# CONTRACT_ADDRESS=0x...

# Run verification
npm run verify
```

## Interact with Contract

### Test Contract Functions

```bash
npm run interact
```

This script will:
- Connect to the deployed contract
- Display current state
- Create sample exhibitions (if needed)
- Register test visitors
- Record sample visits
- Show results

### Run Full Simulation

```bash
# Start local node first
npm run node

# In another terminal, run simulation
npm run simulate
```

The simulation demonstrates:
- Complete workflow from deployment to interaction
- Multiple exhibition creation
- Visitor registration with different ages
- Private visit recording
- Encrypted feedback collection
- Privacy-preserving analytics

## Project Structure

```
museum-visit-tracker/
├── contracts/
│   └── PrivateMuseumVisitTracker.sol   # Main smart contract
├── scripts/
│   ├── deploy.js                        # Deployment script
│   ├── verify.js                        # Etherscan verification
│   ├── interact.js                      # Contract interaction
│   └── simulate.js                      # Full simulation
├── test/
│   └── MuseumVisitTracker.test.js      # Test suite
├── hardhat.config.js                    # Hardhat configuration
├── package.json                         # Dependencies and scripts
├── .env.example                         # Environment template
├── DEPLOYMENT.md                        # Detailed deployment guide
├── README.md                            # Main documentation
└── QUICKSTART.md                        # This file
```

## Available NPM Scripts

```bash
npm run compile        # Compile smart contracts
npm run test          # Run test suite
npm run deploy        # Deploy to Sepolia testnet
npm run deploy:local  # Deploy to local Hardhat network
npm run verify        # Verify contract on Etherscan
npm run interact      # Interact with deployed contract
npm run simulate      # Run comprehensive simulation
npm run node          # Start local Hardhat node
npm run clean         # Clean compiled artifacts
```

## Testing

### Run All Tests

```bash
npm test
```

Expected output:
```
  PrivateMuseumVisitTracker
    Deployment
      ✓ Should set the correct owner
      ✓ Should set owner as initial museum manager
      ✓ Should initialize with zero exhibitions
    Visitor Registration
      ✓ Should allow visitor registration with valid age
      ✓ Should reject duplicate registration
    ...
  XX passing (Xs)
```

### Test Coverage

To check test coverage:

```bash
npx hardhat coverage
```

## Frontend Integration

### Using the Deployed Contract

Update your frontend code:

```javascript
// Contract configuration
const CONTRACT_ADDRESS = '0xe4432488D78fd8CF32b096c385Ca251230427458';
const NETWORK_ID = 11155111; // Sepolia

// Connect to contract
import { ethers } from 'ethers';
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();
const contract = new ethers.Contract(
  CONTRACT_ADDRESS,
  contractABI,
  signer
);

// Register visitor
const tx = await contract.registerVisitor(25);
await tx.wait();
console.log('Visitor registered!');

// Record visit
const visitTx = await contract.recordPrivateVisit(1, 9, 120, 5);
await visitTx.wait();
console.log('Visit recorded!');
```

### Get Contract ABI

After compilation, find ABI at:
```
artifacts/contracts/PrivateMuseumVisitTracker.sol/PrivateMuseumVisitTracker.json
```

## Common Issues & Solutions

### Issue: "Insufficient funds for intrinsic transaction cost"

**Solution:** Your account needs Sepolia ETH. Get some from:
- https://sepoliafaucet.com
- https://faucet.sepolia.dev
- https://sepolia-faucet.pk910.de

### Issue: "Cannot find module '@nomicfoundation/hardhat-toolbox'"

**Solution:** Run `npm install` to install all dependencies.

### Issue: "Error: network does not support ENS"

**Solution:** This is a warning and can be ignored. The contract will still work.

### Issue: "Nonce too high"

**Solution:** Reset your MetaMask account:
1. Settings > Advanced
2. Clear activity tab data

### Issue: Contract verification fails

**Solution:**
1. Check your Etherscan API key in `.env`
2. Wait a few minutes after deployment
3. Try running `npm run verify` again

## Next Steps

1. **Read Documentation**
   - [README.md](./README.md) - Complete project overview
   - [DEPLOYMENT.md](./DEPLOYMENT.md) - Detailed deployment guide

2. **Explore the Contract**
   - View on Etherscan: https://sepolia.etherscan.io/address/0xe4432488D78fd8CF32b096c385Ca251230427458
   - Read the source code: `contracts/PrivateMuseumVisitTracker.sol`

3. **Understand FHE**
   - Zama Documentation: https://docs.zama.ai
   - fhEVM Documentation: https://docs.zama.ai/fhevm

4. **Customize for Your Use Case**
   - Modify exhibition types
   - Add new features
   - Integrate with your frontend
   - Extend privacy features

## Key Features to Test

### 1. Visitor Registration
```javascript
// Register with encrypted age
await contract.registerVisitor(25);
```

### 2. Exhibition Creation (Manager Only)
```javascript
const currentTime = Math.floor(Date.now() / 1000);
await contract.createExhibition(
  "Ancient History",
  0, // Exhibition type (History)
  currentTime,
  currentTime + 30 * 24 * 60 * 60 // 30 days
);
```

### 3. Record Private Visit
```javascript
await contract.recordPrivateVisit(
  1,    // Exhibition ID
  9,    // Satisfaction (1-10)
  120,  // Duration in minutes
  5     // Interest level (1-5)
);
```

### 4. View Statistics
```javascript
// Get public stats
const stats = await contract.getPublicStats();
console.log('Total Exhibitions:', stats[0]);
console.log('Total Visitors:', stats[1]);

// Get exhibition info
const info = await contract.getExhibitionInfo(1);
console.log('Exhibition:', info[0]);
console.log('Visitor Count:', info[5]);
```

## Support

Need help?
- Check the [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed guides
- Review test files in `test/` for usage examples
- Check Hardhat documentation: https://hardhat.org/docs

## Resources

- **Contract:** https://sepolia.etherscan.io/address/0xe4432488D78fd8CF32b096c385Ca251230427458
- **Hardhat:** https://hardhat.org
- **Ethers.js:** https://docs.ethers.org
- **Zama FHE:** https://docs.zama.ai
- **Sepolia Faucet:** https://sepoliafaucet.com

---

**Ready to start building privacy-preserving applications!**
