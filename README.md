# Privacy-Preserving Museum Visit Tracker

[![CI/CD Pipeline](https://github.com/USERNAME/REPO/workflows/CI%2FCD%20Pipeline/badge.svg)](https://github.com/USERNAME/REPO/actions)
[![Code Coverage](https://codecov.io/gh/USERNAME/REPO/branch/main/graph/badge.svg)](https://codecov.io/gh/USERNAME/REPO)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.24-blue.svg)](https://soliditylang.org/)
[![Hardhat](https://img.shields.io/badge/Built%20with-Hardhat-yellow.svg)](https://hardhat.org/)

A confidential cultural consumption data system powered by Fully Homomorphic Encryption (FHE) technology, enabling privacy-preserving visitor analytics for museums and cultural institutions.

## 🎯 Core Concept

The Privacy-Preserving Museum Visit Tracker leverages **Fully Homomorphic Encryption (FHE)** technology to create a revolutionary solution for collecting and analyzing visitor data while maintaining complete privacy. This system addresses a critical challenge in the cultural sector: how to gather valuable visitor insights without compromising individual privacy.

### Privacy-Preserving Analytics

Traditional visitor tracking systems require museums to collect and store sensitive personal information in plaintext, creating privacy risks and regulatory compliance challenges. Our FHE-based solution encrypts all sensitive data **before** it reaches the blockchain, allowing statistical analysis to be performed on encrypted data without ever decrypting it.

### Key Innovation

- **Encrypted Visitor Attributes:** Age, satisfaction ratings, and interest levels are stored as encrypted values using Zama's fhEVM technology
- **Confidential Feedback:** Visitors can provide honest feedback knowing their individual responses remain completely private
- **Aggregate Analytics:** Museums can still derive valuable insights from visitor patterns and trends without accessing individual data
- **Blockchain Verification:** All data is immutably recorded on-chain, ensuring transparency and auditability while maintaining privacy

## 📋 Smart Contract

**Contract Name:** PrivateMuseumVisitTracker

**Contract Address:** `0xe4432488D78fd8CF32b096c385Ca251230427458`

**Network:** Sepolia Testnet (Zama FHE-enabled)

**Chain ID:** 11155111

**Etherscan:** [View Contract](https://sepolia.etherscan.io/address/0xe4432488D78fd8CF32b096c385Ca251230427458)

## 🔒 Privacy Features

### What Data is Protected?

1. **Visitor Age** - Encrypted using FHE (euint8)
2. **Satisfaction Ratings** - Encrypted 1-10 scale feedback (euint8)
3. **Interest Levels** - Encrypted 1-5 interest indicators (euint8)
4. **Visit Duration** - Time spent at exhibitions (euint32)

### What Data is Public?

- Exhibition names and types
- Total visitor counts (aggregate numbers only)
- Exhibition dates and status
- Registration timestamps

This selective encryption ensures privacy where it matters while maintaining the transparency needed for institutional accountability.

## ✨ Key Features

### For Visitors

- **Complete Anonymity:** Your personal information is encrypted end-to-end
- **Honest Feedback:** Rate exhibitions freely without fear of identification
- **Blockchain Verification:** Your participation is permanently recorded and verifiable
- **Simple Interface:** Connect wallet, register once, and start tracking visits

### For Museums & Cultural Institutions

- **Privacy-Compliant Analytics:** Collect visitor data without GDPR/privacy concerns
- **Visitor Behavior Insights:** Understand patterns without compromising individual privacy
- **Exhibition Performance Metrics:** Track aggregate satisfaction and engagement
- **Transparent Operations:** All data collection is auditable on blockchain

### Exhibition Types Supported

- 🏛️ History
- 🎨 Art
- 🔬 Science
- 🌍 Culture
- 💻 Technology
- 🌿 Nature

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MetaMask wallet
- Sepolia testnet ETH

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd museum-visit-tracker

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your credentials
```

### Configuration

Create a `.env` file:

```env
SEPOLIA_RPC_URL=https://rpc.sepolia.org
PRIVATE_KEY=your_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key
CONTRACT_ADDRESS=0xe4432488D78fd8CF32b096c385Ca251230427458
```

### Compilation

```bash
npm run compile
```

### Deployment

```bash
# Deploy to Sepolia testnet
npm run deploy

# Deploy to local network
npm run deploy:local
```

### Verification

```bash
npm run verify
```

### Testing

```bash
# Run tests
npm test

# Run interaction script
npm run interact

# Run simulation on local network
npm run simulate
```

## 📊 How It Works

### For Visitors

1. **Connect Wallet:** Connect your MetaMask wallet to Sepolia testnet
2. **Register:** Register as a visitor (one-time process)
   - Enter your age (will be encrypted automatically)
   - Submit registration transaction
3. **Visit & Rate:** After visiting an exhibition
   - Select exhibition ID
   - Rate satisfaction (1-10)
   - Indicate interest level (1-5)
   - Record visit duration
   - Submit encrypted feedback

### For Museum Administrators

1. **Create Exhibition:** Set up new exhibitions with
   - Exhibition name
   - Type (History, Art, Science, etc.)
   - Start and end dates
2. **View Analytics:** Access aggregate statistics
   - Total exhibitions count
   - Total registered visitors
   - Visit counts per exhibition
   - All without accessing individual data

## 🛡️ Technology Stack

### Blockchain & Encryption

- **Zama fhEVM:** Fully Homomorphic Encryption for Ethereum
- **Solidity 0.8.24:** Smart contract development
- **Hardhat:** Development framework and testing
- **Sepolia Testnet:** Ethereum test network with FHE support

### Development Tools

- **Hardhat:** Compilation, testing, deployment
- **Ethers.js v6:** Ethereum interaction library
- **Hardhat Toolbox:** Complete development suite

### Key FHE Operations

```solidity
// Encrypted data types from Zama
euint8 encryptedAge;
euint8 encryptedSatisfaction;
euint8 encryptedInterestLevel;
euint32 encryptedDuration;
```

All computations on encrypted data preserve privacy while enabling analytics.

## 📖 Smart Contract Functions

### Public Functions

#### `registerVisitor(uint8 _age)`
Register as a new visitor with encrypted age

#### `recordPrivateVisit(uint32 _exhibitionId, uint8 _satisfaction, uint32 _duration, uint8 _interestLevel)`
Record an encrypted visit with private feedback

#### `createExhibition(string _name, uint8 _type, uint32 _startDate, uint32 _endDate)`
Create a new exhibition (for administrators)

#### `getPublicStats()`
View aggregate statistics (total exhibitions and visitors)

#### `getExhibitionInfo(uint32 _exhibitionId)`
Get public information about a specific exhibition

#### `getMyStats()`
Check your registration status

## 🎓 Use Cases

### Cultural Institutions

- **Museums:** Track visitor engagement across exhibitions
- **Art Galleries:** Understand artwork appeal and visitor preferences
- **Science Centers:** Measure educational impact and interest levels
- **Historical Sites:** Gather feedback while respecting visitor privacy

### Research & Analysis

- **Cultural Studies:** Analyze visitor behavior patterns
- **Exhibition Design:** Optimize based on aggregated feedback
- **Visitor Experience:** Improve services using privacy-safe data
- **Demographic Insights:** Understand audience composition without individual tracking

## 🔐 Privacy Guarantees

### What We Encrypt

- Individual visitor ages
- Personal satisfaction ratings
- Individual interest levels
- Sensitive personal preferences

### What We Never See

- Your actual age (only encrypted value on-chain)
- Your specific ratings (only encrypted values)
- Your individual behavior (only aggregate stats)
- Your identity linked to feedback

### How Privacy is Maintained

1. **Client-Side Encryption:** Data encrypted before leaving your browser
2. **FHE Computation:** Analytics performed on encrypted data
3. **No Decryption Keys:** Smart contract cannot decrypt individual values
4. **Zero-Knowledge Analytics:** Museums see trends, not individuals

## 🌟 Benefits

### Privacy by Design

- GDPR and privacy regulation compliant
- No personal data exposure risk
- Encrypted storage on immutable blockchain
- Visitor trust and participation

### Valuable Insights

- Aggregate visitor demographics
- Exhibition popularity metrics
- Satisfaction trend analysis
- Data-driven decision making

### Blockchain Advantages

- Immutable record keeping
- Transparent operations
- Verifiable data collection
- Decentralized trust

## 🔬 Technical Deep Dive

### FHE Integration

This project utilizes Zama's fhEVM technology, which brings Fully Homomorphic Encryption to Ethereum smart contracts. FHE allows computations to be performed on encrypted data without decryption, enabling:

- **Privacy-preserving analytics:** Aggregate visitor data without exposing individuals
- **Confidential on-chain storage:** Sensitive data encrypted on the blockchain
- **Secure computations:** Statistical operations on encrypted values
- **Zero-knowledge insights:** Museums learn trends without compromising privacy

### Encryption Flow

```
Visitor Input → Client-Side Encryption → Blockchain Storage → FHE Computation → Aggregate Results
     ↓                    ↓                       ↓                  ↓                ↓
  Raw Data         Encrypted Data          euint Types      Analytics Engine    Public Stats
```

## 🌍 Real-World Impact

### Solving Industry Challenges

**Problem:** Museums need visitor data but face privacy concerns and regulations

**Solution:** FHE-based system that provides analytics while guaranteeing individual privacy

**Impact:**
- Increased visitor willingness to provide honest feedback
- Compliance with strict privacy regulations
- Better exhibition design based on real insights
- Trust between institutions and visitors

## 📁 Project Structure

```
museum-visit-tracker/
├── .github/
│   └── workflows/
│       ├── test.yml           # Main CI/CD pipeline
│       └── manual.yml         # Manual testing workflow
├── contracts/
│   └── PrivateMuseumVisitTracker.sol
├── scripts/
│   ├── deploy.js
│   ├── verify.js
│   ├── interact.js
│   └── simulate.js
├── test/
│   └── MuseumVisitTracker.test.cjs
├── .solhint.json              # Solidity linting config
├── .prettierrc.yml            # Code formatting config
├── codecov.yml                # Coverage reporting config
├── hardhat.config.js
├── package.json
├── .env.example
├── LICENSE                    # MIT License
├── CI_CD.md                   # CI/CD documentation
└── README.md
```

## 📄 Documentation

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Complete deployment guide with network information
- **Contract Address:** 0xe4432488D78fd8CF32b096c385Ca251230427458
- **Network:** Sepolia Testnet
- **Etherscan:** [View on Explorer](https://sepolia.etherscan.io/address/0xe4432488D78fd8CF32b096c385Ca251230427458)

## 🛠️ Development Scripts

```bash
npm run compile        # Compile contracts
npm run test          # Run tests
npm run deploy        # Deploy to Sepolia testnet
npm run deploy:local  # Deploy to local network
npm run verify        # Verify contract on Etherscan
npm run interact      # Interact with deployed contract
npm run simulate      # Run comprehensive simulation
npm run node          # Start local Hardhat node
npm run clean         # Clean artifacts
```

## 🔮 Future Enhancements

- Multi-language support for international museums
- Advanced analytics dashboard with FHE-based computations
- Integration with museum membership systems
- Mobile app for seamless exhibition tracking
- Reward mechanisms for active participants
- Cross-museum analytics network

## 🤝 Contributing

We welcome contributions from the community! Whether you're interested in:

- Adding new features
- Improving privacy mechanisms
- Enhancing the smart contract
- Expanding exhibition types
- Creating documentation
- Writing tests

Please feel free to submit pull requests or open issues.

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For questions or support:
- Review the [DEPLOYMENT.md](./DEPLOYMENT.md) documentation
- Check contract on [Etherscan](https://sepolia.etherscan.io/address/0xe4432488D78fd8CF32b096c385Ca251230427458)
- Open an issue for bug reports or feature requests

---

**Built with privacy in mind. Powered by Zama FHE Technology.**

*Enabling the future of confidential cultural data analytics.*
