# Deployment Guide

Complete deployment information for the Privacy-Preserving Museum Visit Tracker smart contract system.

## Contract Information

### Deployed Contract

**Contract Name:** PrivateMuseumVisitTracker

**Contract Address:** `0xe4432488D78fd8CF32b096c385Ca251230427458`

**Network:** Sepolia Testnet (Ethereum)

**Chain ID:** 11155111

### Network Details

**Network Name:** Sepolia

**RPC Endpoint:** https://rpc.sepolia.org

**Explorer:** https://sepolia.etherscan.io

**Faucet:** https://sepoliafaucet.com

### Explorer Links

**Contract on Etherscan:** [View Contract](https://sepolia.etherscan.io/address/0xe4432488D78fd8CF32b096c385Ca251230427458)

**Verified Source Code:** [View Source](https://sepolia.etherscan.io/address/0xe4432488D78fd8CF32b096c385Ca251230427458#code)

**Read Contract:** [Read Functions](https://sepolia.etherscan.io/address/0xe4432488D78fd8CF32b096c385Ca251230427458#readContract)

**Write Contract:** [Write Functions](https://sepolia.etherscan.io/address/0xe4432488D78fd8CF32b096c385Ca251230427458#writeContract)

## Deployment Process

### Prerequisites

Before deploying, ensure you have:

1. **Node.js** (v18 or higher)
2. **npm** or **yarn**
3. **Sepolia ETH** for gas fees
4. **Private Key** for deployment account
5. **Etherscan API Key** for verification (optional)

### Installation

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env file with your credentials
# Add SEPOLIA_RPC_URL, PRIVATE_KEY, and ETHERSCAN_API_KEY
```

### Environment Configuration

Create a `.env` file in the project root:

```env
# Network Configuration
SEPOLIA_RPC_URL=https://rpc.sepolia.org
PRIVATE_KEY=your_private_key_here

# Etherscan API Key
ETHERSCAN_API_KEY=your_etherscan_api_key_here

# Contract Address (after deployment)
CONTRACT_ADDRESS=0xe4432488D78fd8CF32b096c385Ca251230427458
```

### Compilation

Compile the smart contracts:

```bash
npm run compile
```

This will:
- Compile all Solidity contracts
- Generate TypeScript bindings
- Create artifacts in the `artifacts/` directory
- Output ABI files for frontend integration

### Deployment Steps

#### 1. Deploy to Sepolia Testnet

```bash
npm run deploy
```

Expected output:
```
Starting deployment of PrivateMuseumVisitTracker...
==================================================
Deploying contracts with account: 0x...
Account balance: 0.5 ETH

Deploying PrivateMuseumVisitTracker contract...
✓ PrivateMuseumVisitTracker deployed to: 0xe4432488D78fd8CF32b096c385Ca251230427458
Deployment transaction hash: 0x...

Waiting for confirmations...
✓ Deployment confirmed

Network Information:
- Network Name: sepolia
- Chain ID: 11155111
```

#### 2. Verify Contract on Etherscan

```bash
npm run verify
```

Or with custom address:

```bash
npx hardhat run scripts/verify.js --network sepolia 0xe4432488D78fd8CF32b096c385Ca251230427458
```

Expected output:
```
Starting contract verification...
Contract Address: 0xe4432488D78fd8CF32b096c385Ca251230427458
Network: sepolia

Verifying on Etherscan...
✓ Contract verified successfully!
```

#### 3. Test Contract Interaction

```bash
npm run interact
```

This will:
- Connect to the deployed contract
- Display current contract state
- Create sample exhibitions (if needed)
- Register test visitors
- Record sample visits

#### 4. Run Local Simulation

```bash
# Start local Hardhat node (in separate terminal)
npm run node

# Run simulation (in another terminal)
npm run simulate
```

## Deployment Information

### Deployment Transaction

**Transaction Hash:** Check deployment logs or Etherscan

**Block Number:** View on Etherscan explorer

**Timestamp:** View on Etherscan explorer

**Gas Used:** View on Etherscan explorer

**Deployment Cost:** View on Etherscan explorer

### Contract Owner

**Owner Address:** Deployment account address

**Museum Manager:** Same as owner (default)

**Access Control:**
- Owner can set museum manager
- Museum manager can create exhibitions
- All registered visitors can record visits

## Contract Functions

### Public Read Functions

#### `getPublicStats()`
Returns aggregate statistics without exposing private data.

```solidity
function getPublicStats() external view returns (
    uint32 totalExhibitionsCount,
    uint32 totalRegisteredVisitorsCount
)
```

#### `getExhibitionInfo(uint32 _exhibitionId)`
Get public information about a specific exhibition.

```solidity
function getExhibitionInfo(uint32 _exhibitionId) external view returns (
    string memory name,
    ExhibitionType exhibitionType,
    uint32 startDate,
    uint32 endDate,
    bool isActive,
    uint32 publicVisitorCount
)
```

#### `getMyStats()`
Check your own registration status.

```solidity
function getMyStats() external view returns (
    bool isRegistered,
    uint32 registrationDate
)
```

#### `getMyVisitRecord(uint32 _exhibitionId)`
Check if you have visited a specific exhibition.

```solidity
function getMyVisitRecord(uint32 _exhibitionId) external view returns (
    bool hasVisited
)
```

### Public Write Functions

#### `registerVisitor(uint8 _age)`
Register as a visitor with encrypted age.

```solidity
function registerVisitor(uint8 _age) external
```

**Requirements:**
- Not already registered
- Age must be between 1-119

#### `recordPrivateVisit(...)`
Record an encrypted visit with feedback.

```solidity
function recordPrivateVisit(
    uint32 _exhibitionId,
    uint8 _satisfaction,
    uint32 _duration,
    uint8 _interestLevel
) external onlyRegisteredVisitor
```

**Requirements:**
- Must be registered visitor
- Valid exhibition ID
- Exhibition must be active
- Satisfaction: 1-10
- Interest level: 1-5
- Haven't visited this exhibition before

### Admin Functions

#### `createExhibition(...)`
Create a new exhibition (museum manager only).

```solidity
function createExhibition(
    string memory _name,
    ExhibitionType _type,
    uint32 _startDate,
    uint32 _endDate
) external onlyMuseumManager
```

#### `setMuseumManager(address _manager)`
Set the museum manager address (owner only).

```solidity
function setMuseumManager(address _manager) external onlyOwner
```

#### `setExhibitionStatus(uint32 _exhibitionId, bool _isActive)`
Update exhibition active status (museum manager only).

```solidity
function setExhibitionStatus(uint32 _exhibitionId, bool _isActive) external onlyMuseumManager
```

## Testing

### Run Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test -- --coverage

# Run specific test file
npx hardhat test test/MuseumVisitTracker.test.js
```

### Test Coverage

The test suite should cover:
- Contract deployment
- Visitor registration
- Exhibition creation
- Visit recording
- Access control
- Privacy features
- Edge cases and error handling

## Frontend Integration

### ABI Location

After compilation, the contract ABI is located at:

```
artifacts/contracts/PrivateMuseumVisitTracker.sol/PrivateMuseumVisitTracker.json
```

### Integration Example

```javascript
import { ethers } from 'ethers';
import contractABI from './artifacts/contracts/PrivateMuseumVisitTracker.sol/PrivateMuseumVisitTracker.json';

const CONTRACT_ADDRESS = '0xe4432488D78fd8CF32b096c385Ca251230427458';

// Connect to contract
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();
const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer);

// Register visitor
const tx = await contract.registerVisitor(25);
await tx.wait();

// Record visit
const visitTx = await contract.recordPrivateVisit(1, 9, 120, 5);
await visitTx.wait();
```

## Security Considerations

### Privacy Protection

1. **Encrypted Data:**
   - Visitor ages (euint8)
   - Satisfaction ratings (euint8)
   - Interest levels (euint8)
   - Visit durations (euint32)

2. **Public Data:**
   - Exhibition names and types
   - Aggregate visitor counts
   - Exhibition dates

3. **Access Control:**
   - Owner-only functions
   - Museum manager permissions
   - Registered visitor requirements

### Best Practices

- Never share private keys
- Use environment variables for sensitive data
- Verify contract addresses before interaction
- Test on testnet before mainnet deployment
- Keep dependencies updated
- Regular security audits

## Maintenance

### Updating Contract

If you need to deploy a new version:

1. Update contract code
2. Increment version in comments
3. Compile: `npm run compile`
4. Deploy: `npm run deploy`
5. Verify: `npm run verify`
6. Update frontend with new address

### Monitoring

Monitor contract activity:
- View transactions on Etherscan
- Track gas usage patterns
- Monitor event emissions
- Check visitor registration trends

## Troubleshooting

### Common Issues

**Issue:** Deployment fails with "insufficient funds"
**Solution:** Ensure your account has enough Sepolia ETH

**Issue:** Verification fails
**Solution:** Check Etherscan API key and network configuration

**Issue:** Transaction reverts
**Solution:** Check function requirements and input parameters

**Issue:** Contract not found
**Solution:** Verify contract address and network connection

### Support

For deployment issues:
1. Check Hardhat documentation
2. Review error messages in console
3. Verify network configuration
4. Check account balances

## Resources

- **Hardhat Documentation:** https://hardhat.org/docs
- **Ethers.js Documentation:** https://docs.ethers.org
- **Sepolia Testnet:** https://sepolia.dev
- **Zama FHE Documentation:** https://docs.zama.ai
- **OpenZeppelin Contracts:** https://docs.openzeppelin.com

## License

This project is licensed under the MIT License.

## Changelog

### Version 1.0.0 (Current)

- Initial deployment on Sepolia testnet
- FHE-enabled privacy features
- Complete visitor registration system
- Exhibition management functionality
- Encrypted feedback collection
- Aggregate statistics viewing

---

**Last Updated:** 2025-10-28

**Maintainer:** Project Team

**Contract Status:** Active on Sepolia Testnet
