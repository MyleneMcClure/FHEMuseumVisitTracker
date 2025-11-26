# Privacy-Preserving Museum Visit Tracker - Enhanced Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.24-blue.svg)](https://soliditylang.org/)
[![Hardhat](https://img.shields.io/badge/Built%20with-Hardhat-yellow.svg)](https://hardhat.org/)
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB.svg)](https://reactjs.org/)

**Enterprise-Grade Privacy-Preserving Cultural Analytics Platform**

A complete Web3 application providing privacy-preserving visitor analytics for museums using Fully Homomorphic Encryption (FHE) with advanced features including Gateway callback pattern, refund mechanism, and timeout protection.

---

## 🎯 Key Features (v2.0 Enhanced)

### 1. Gateway Callback Pattern ⚡

**Asynchronous Decryption Architecture**

- User submits encrypted statistics request → Contract records → Gateway decrypts → Callback completes
- Non-blocking operations prevent contract state lock
- Automatic proof verification
- Complete request lifecycle tracking

**Benefits:**
- Solves FHE limitations for direct decryption
- Scalable for multiple concurrent requests
- Gas-efficient callback execution
- Enterprise-ready reliability

### 2. Refund Mechanism 💰

**Automatic Compensation for Failures**

- Failed decryption → Automatic refund eligibility
- Timed out request → Refund claim within 48-hour window
- One-time refund per exhibition (prevent double-claiming)
- Reentrancy-protected refund processing

**Eligibility:**
```
Refund When:
- Decryption fails (Gateway unable to decrypt)
- Timeout occurs (24 hours elapsed)
- Callback never executes
- Within 48-hour refund window
```

### 3. Timeout Protection ⏰

**Prevents Permanent Locking**

- 24-hour timeout for pending requests
- Anyone can trigger timeout marking
- Automatic status update to TimedOut
- Enables refund claim after timeout
- 48-hour refund window from initial request

**Timeout Timeline:**
```
t = 0:      Request initiated
t = 24h:    DECRYPTION_TIMEOUT reached
t = 24h+:   Eligible for timeout marking
t = 48h:    MAX_REFUND_WINDOW expires
```

### 4. Privacy Protection 🔒

**Multiple Layers of Privacy Safeguards**

#### Division Problem Solution
- **Problem**: FHE cannot perform division on encrypted data
- **Solution**: Random multiplier technique (1000x)
- **Result**: (sum × 1000) / count = precision-safe average

#### Small Sample Protection
- **Problem**: Small groups (< 5 visitors) can leak individual information
- **Solution**: Deterministic noise addition
- **Implementation**: Obfuscation nonce incremented by owner
- **Benefit**: Same sample looks different over time

#### Input Validation
```solidity
require(_age > 0 && _age < 120, "Valid age range");
require(_satisfaction >= 1 && _satisfaction <= 10, "Valid rating");
require(_duration > 0 && _duration <= 1440, "Valid duration");
```

### 5. Security Hardening 🛡️

**Enterprise-Grade Protection**

- **Input Validation**: Comprehensive range checks on all user inputs
- **Access Control**: Role-based modifiers (Owner, Manager, Visitor)
- **Overflow Protection**: Explicit uint32.max checks
- **Reentrancy Protection**: nonReentrant modifier on sensitive functions
- **Proof Verification**: FHE.checkSignatures() validation
- **State Consistency**: Single exhibition decryption at a time

### 6. Gas Optimization ⛽

**Efficient HCU Usage**

- Batch permission settings for related encrypted values
- Public counters for non-sensitive metrics
- Minimal encrypted operations per function
- Strategic use of views vs state-changing calls
- Optimized data structures

---

## 📋 Contract Architecture

### Exhibition Management

```solidity
struct Exhibition {
    string name;                           // Exhibition name
    ExhibitionType exhibitionType;         // Type: History, Art, Science, Culture, Technology, Nature
    uint32 startDate;                      // Start timestamp
    uint32 endDate;                        // End timestamp
    bool isActive;                         // Active flag
    euint32 privateVisitorCount;           // Encrypted visitor count
    euint32 privateSatisfactionSum;        // Encrypted satisfaction sum
    uint32 publicVisitorCount;             // Public visitor count (aggregate)
    uint256 decryptionRequestId;           // Gateway request ID
    uint256 requestTimestamp;              // Request timestamp for timeout
    bool isDecryptionPending;              // Decryption in progress flag
}
```

### Request Tracking

```solidity
struct DecryptionRequest {
    uint32 exhibitionId;                   // Associated exhibition
    address requester;                     // Who requested decryption
    uint256 timestamp;                     // Request timestamp
    RequestStatus status;                  // Status: Pending/Completed/Failed/TimedOut
    bool callbackCalled;                   // Callback execution flag
}

enum RequestStatus {
    Pending,    // Awaiting callback
    Completed,  // Successfully decrypted
    Failed,     // Decryption failed
    TimedOut    // Timeout period elapsed
}
```

### Privacy Protection

```solidity
// Constants
uint256 public constant DECRYPTION_TIMEOUT = 24 hours;
uint256 public constant MAX_REFUND_WINDOW = 48 hours;
uint256 private constant PRIVACY_MULTIPLIER = 1000;

// Nonce for obfuscation
uint256 private nonce;
```

---

## 🔄 Request Flow Diagram

### Complete Decryption Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. REQUEST PHASE                                               │
├─────────────────────────────────────────────────────────────────┤
│ Manager calls: requestExhibitionStats(exhibitionId)             │
│                                                                 │
│ Contract:                                                       │
│ - Validates exhibition exists                                  │
│ - Checks no pending decryption                                 │
│ - Prepares encrypted ciphertexts                               │
│ - Creates DecryptionRequest tracking                           │
│ - Calls FHE.requestDecryption()                                │
│ - Emits StatisticsRequested event                              │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 2. GATEWAY PROCESSING                                           │
├─────────────────────────────────────────────────────────────────┤
│ Gateway receives request ID                                     │
│                                                                 │
│ Gateway:                                                        │
│ - Decrypts ciphertexts securely off-chain                       │
│ - Generates cryptographic proof                                │
│ - Prepares callback transaction                                │
│ - Sends to blockchain (relayer)                                │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 3. CALLBACK PHASE                                               │
├─────────────────────────────────────────────────────────────────┤
│ Gateway calls: processStatsReveal(requestId, cleartexts, proof) │
│                                                                 │
│ Contract:                                                       │
│ - Verifies proof: FHE.checkSignatures()                         │
│ - Decodes cleartexts to uint32 values                           │
│ - Stores revealed data                                         │
│ - Updates request status to Completed                          │
│ - Resets decryption pending flag                               │
│ - Emits StatisticsRevealed event                                │
│                                                                 │
│ OR on failure:                                                  │
│ - Catches decryption failure                                   │
│ - Sets status to Failed                                        │
│ - Emits DecryptionFailed event                                 │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 4. RESULT/RECOVERY PHASE                                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ SUCCESS PATH:                                                   │
│ Manager calls: getRevealedStats(exhibitionId)                   │
│ Returns: avgSatisfaction (with privacy multiplier)             │
│          visitorCount                                          │
│                                                                 │
│ FAILURE/TIMEOUT PATH:                                           │
│ Manager can:                                                    │
│ 1. Wait 24 hours → call markDecryptionTimeout()                 │
│ 2. Call claimDecryptionRefund() (within 48h window)             │
│ 3. Retry requestExhibitionStats() for new attempt              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📚 Documentation

### Complete Documentation Suite

| Document | Purpose |
|----------|---------|
| **ARCHITECTURE.md** | Complete system architecture, Gateway pattern, privacy techniques |
| **API.md** | Full API reference, all function signatures, examples |
| **SECURITY.md** | Security considerations, audit notes, best practices |
| **TESTING.md** | 68+ test cases, testing strategies, coverage |
| **DEPLOYMENT.md** | Deployment instructions, network setup |

### Quick Navigation

- **For Developers**: Start with API.md
- **For Architects**: Read ARCHITECTURE.md
- **For Security Auditors**: Review SECURITY.md
- **For DevOps**: Check DEPLOYMENT.md
- **For QA**: See TESTING.md

---

## 🚀 Getting Started

### Prerequisites

```bash
Node.js v18 or higher
npm or yarn package manager
MetaMask browser extension
Sepolia testnet ETH
```

### Installation

```bash
# Clone repository
git clone <repository-url>
cd museum-tracker

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your configuration
```

### Configuration (`.env`)

```env
# Network
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
PRIVATE_KEY=your_private_key

# Contract
CONTRACT_ADDRESS=0x...

# Gateway
GATEWAY_URL=https://gateway.zama.ai
```

### Running

#### Frontend Development

```bash
cd frontend
npm install
npm run dev     # Start dev server (localhost:5173)
npm run build   # Build for production
npm run lint    # TypeScript & ESLint
```

#### Smart Contracts

```bash
npm run compile       # Compile contracts
npm test              # Run 68+ tests
npm run deploy        # Deploy to Sepolia
npm run verify        # Verify on Etherscan
npm run node         # Local hardhat node
```

#### Full-Stack Local Development

```bash
# Terminal 1: Hardhat node
npm run node

# Terminal 2: Deploy
npm run deploy:local

# Terminal 3: Frontend
cd frontend && npm run dev
```

---

## 🔧 API Quick Reference

### Core Functions

#### Exhibition Management
- `createExhibition()` - Create new exhibition
- `setExhibitionStatus()` - Activate/deactivate

#### Visitor Management
- `registerVisitor()` - Register with encrypted age
- `recordPrivateVisit()` - Record visit with encrypted feedback

#### Decryption Operations
- `requestExhibitionStats()` - Request Gateway decryption
- `processStatsReveal()` - Gateway callback (called automatically)

#### Timeout & Refund
- `checkDecryptionTimeout()` - Check if timed out
- `markDecryptionTimeout()` - Mark timed out request
- `claimDecryptionRefund()` - Claim refund for failed/timed request

#### Query Functions
- `getRevealedStats()` - Get decrypted statistics with privacy
- `getExhibitionInfo()` - Get basic exhibition info
- `getRequestStatus()` - Track decryption request
- `getMyVisitRecord()` - Check if user visited
- `getMyStats()` - Get user registration info

### Complete API Documentation

See **docs/API.md** for:
- Full function signatures
- Parameter descriptions
- Return values
- Usage examples
- Error handling
- Event monitoring

---

## 📊 Privacy Features

### Encrypted Data Types

```solidity
euint8:   Age, Age Group, Satisfaction, Interest Level
euint32:  Timestamp, Duration, Visitor Count, Satisfaction Sum
```

### Privacy Guarantees

✅ **End-to-End Encryption**: Data encrypted before blockchain storage
✅ **Aggregate Analytics Only**: Individual data never revealed
✅ **Small Sample Protection**: Noise for <5 visitors
✅ **Division Privacy**: Multiplier-based technique
✅ **Audit Trail**: Immutable on-chain records
✅ **GDPR Compliant**: Privacy-by-design architecture

---

## ⚙️ Technical Stack

### Blockchain
- **Language**: Solidity 0.8.24
- **Framework**: Hardhat 2.19.0
- **FHE**: Zama fhEVM + Gateway
- **Testing**: Mocha + Chai + Hardhat Network

### Frontend
- **Framework**: React 18.2.0
- **Language**: TypeScript 5.0.0
- **Build Tool**: Vite 4.4.0
- **Web3**: Ethers.js v6, MetaMask

### Development Tools
- **Linting**: ESLint 8.50.0
- **Formatting**: Prettier
- **Hooks**: Husky
- **CI/CD**: GitHub Actions
- **Hosting**: Vercel

---

## 📈 Performance Metrics

### Contract Gas/HCU

| Operation | Approx Cost | Notes |
|-----------|------------|-------|
| Create Exhibition | 150k gas | HCU for encrypted init |
| Register Visitor | 200k gas | Age encryption |
| Record Visit | 250k+ HCU | Multiple FHE ops |
| Request Decryption | 100k gas | Gateway coordination |
| Process Callback | 200k+ HCU | Proof verification |

### Timeout Specifications

| Parameter | Value |
|-----------|-------|
| Decryption Timeout | 24 hours |
| Refund Window | 48 hours |
| Max Request Age | 48 hours |
| Nonce Increment | Owner-controlled |

---

## 🔐 Security Considerations

### Audited Features

- Input validation on all user-facing functions
- Access control with role-based modifiers
- Overflow protection (uint32.max checks)
- Reentrancy protection on callbacks and refunds
- Proof verification via FHE.checkSignatures()

### Known Limitations

- FHE operations slower than plaintext (expected trade-off)
- Gateway callback latency varies
- Privacy vs utility trade-off (some operations impossible with encryption)
- Higher gas/HCU costs than traditional contracts

### Recommended Audits

Professional security audit recommended before mainnet deployment:
- Smart contract security audit
- FHE-specific cryptography review
- Gateway integration testing
- Load/stress testing

---

## 🧪 Testing

### Test Coverage

- 68+ comprehensive test cases
- Unit tests for all functions
- Integration tests for full workflows
- Gas estimation tests
- Privacy assumption tests

### Running Tests

```bash
npm test                           # Run all tests
npm run test -- --grep "keyword"   # Run specific tests
npm run coverage                   # Generate coverage report
```

See **TESTING.md** for detailed test documentation.

---

## 📝 Examples

### Frontend Integration Example

```javascript
// 1. Request statistics
await contract.requestExhibitionStats(exhibitionId);

// 2. Listen for completion
contract.on("StatisticsRevealed", (exhibitionId, visitors, satisfaction) => {
    const avg = (visitors * 1000) / satisfaction;  // Reverse privacy multiplier
    console.log(`Average satisfaction: ${avg}`);
});

// 3. Handle timeout
contract.on("DecryptionTimedOut", async (requestId, exhibitionId) => {
    await contract.markDecryptionTimeout(requestId);
    await contract.claimDecryptionRefund(exhibitionId);
});
```

### Backend Integration Example

```javascript
// Monitor decryption requests
async function monitorRequests() {
    const exhibitionId = 1;
    const requestId = await getLastRequestId(exhibitionId);

    // Check timeout
    if (await contract.checkDecryptionTimeout(requestId)) {
        await contract.markDecryptionTimeout(requestId);

        // Claim refund
        await contract.claimDecryptionRefund(exhibitionId);
    }

    // Query results if completed
    const status = await contract.getRequestStatus(requestId);
    if (status.status === 1) { // Completed
        const stats = await contract.getRevealedStats(exhibitionId);
        console.log(`Stats available: ${stats.visitorCount} visitors`);
    }
}
```

---

## 🚢 Deployment

### Testnet Deployment

```bash
npm run deploy
# Follow prompts, contract deployed to Sepolia
```

### Verification

```bash
npm run verify
# Verify on Etherscan for transparency
```

### Current Deployment

**Network**: Sepolia Testnet
**Status**: Ready for testing
**See**: DEPLOYMENT.md for detailed instructions

---

## 🤝 Contributing

### Development Workflow

1. Create feature branch: `git checkout -b feature/your-feature`
2. Implement changes with tests
3. Ensure all tests pass: `npm test`
4. Submit PR with description

### Code Style

- Solidity: Follow Solidity style guide
- TypeScript: ESLint + Prettier
- Comments: NatSpec for smart contracts
- Documentation: Markdown for guides

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🙏 Acknowledgments

- **Zama**: FHE technology and Gateway
- **Ethereum**: Blockchain platform
- **OpenZeppelin**: Security standards
- **Hardhat**: Development framework
- **React Community**: Frontend framework

---

## 📞 Support & Contact

### Documentation
- **API Reference**: docs/API.md
- **Architecture**: docs/ARCHITECTURE.md
- **Security**: SECURITY.md
- **Testing**: TESTING.md

### Issues & Feedback
- GitHub Issues: Report bugs or request features
- Security Issues: See SECURITY.md for responsible disclosure

### Live Demo
https://fhe-museum-visit-tracker.vercel.app/

---

## 📊 Version History

### v2.0.0 (Current)
- Gateway callback pattern for decryption
- Refund mechanism for failed decryptions
- Timeout protection (24 hours)
- Privacy protection techniques
- Comprehensive security hardening
- Full documentation suite

### v1.0.0
- Basic museum visit tracking
- FHE encryption for sensitive data
- Exhibition management
- React frontend

---

**Built with ❤️ for privacy-preserving cultural analytics**

**Powered by Zama FHE Technology**

🔒 Privacy First • 📊 Analytics Second • 🏛️ Culture Always
