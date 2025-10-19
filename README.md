# FHE Museum Visit Tracker

[![CI/CD Pipeline](https://github.com/MyleneMcClure/FHEMuseumVisitTracker/workflows/CI%2FCD%20Pipeline/badge.svg)](https://github.com/MyleneMcClure/FHEMuseumVisitTracker/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.24-blue.svg)](https://soliditylang.org/)
[![Hardhat](https://img.shields.io/badge/Built%20with-Hardhat-yellow.svg)](https://hardhat.org/)
[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen.svg)](https://fhe-museum-visit-tracker.vercel.app/)

**Confidential Cultural Consumption Data System** powered by Fully Homomorphic Encryption (FHE) technology, enabling privacy-preserving visitor analytics for museums and cultural institutions.

## 🔗 Quick Links

- **🌐 Live Application**: [https://fhe-museum-visit-tracker.vercel.app/](https://fhe-museum-visit-tracker.vercel.app/)
- **💻 GitHub Repository**: [https://github.com/MyleneMcClure/FHEMuseumVisitTracker](https://github.com/MyleneMcClure/FHEMuseumVisitTracker)
- **🎬 Demo Video**: `demo.mp4` - Download the video file from the repository to watch the complete demonstration (the video file requires download to view, links cannot be opened directly)

## 🎯 Core Concept

### FHE Contract for Private Museum Visit Statistics

The **FHE Museum Visit Tracker** leverages **Fully Homomorphic Encryption (FHE)** smart contracts to revolutionize how cultural institutions collect and analyze visitor data. This system transforms **confidential cultural consumption data** into actionable insights while maintaining absolute privacy.

### The Challenge: Confidential Cultural Consumption Data

Museums and cultural institutions need to understand visitor behavior, preferences, and satisfaction levels to improve their services. However, traditional data collection methods expose sensitive personal information, creating:

- **Privacy Risks**: Visitor age, preferences, and feedback stored in plaintext
- **Regulatory Compliance Issues**: GDPR, CCPA, and other privacy regulations
- **Trust Barriers**: Visitors reluctant to provide honest feedback
- **Data Security Concerns**: Centralized databases vulnerable to breaches

### The Solution: FHE-Based Privacy-Preserving Analytics

Our system uses **Zama's fhEVM technology** to encrypt all sensitive visitor data **before** it reaches the blockchain. This enables:

✅ **Complete Data Privacy**: All personal information encrypted end-to-end  
✅ **Statistical Analysis on Encrypted Data**: Museums can derive insights without decryption  
✅ **Honest Feedback**: Visitors provide truthful responses knowing privacy is guaranteed  
✅ **Regulatory Compliance**: Built-in GDPR compliance through privacy-by-design  
✅ **Immutable Audit Trail**: Blockchain ensures transparency and accountability

### Key Innovation: Homomorphic Encryption for Cultural Data

Traditional encryption requires decryption before analysis, exposing data. **Fully Homomorphic Encryption** allows computations on encrypted data, producing encrypted results that, when decrypted, match the results of operations performed on plaintext.

**Example**:
```
Traditional: Decrypt(Age) → Compute Average → Store Result
FHE: Compute on Encrypted(Age) → Encrypted(Average) → Decrypt Only Result
```

This means museums can:
- Calculate average visitor satisfaction **without seeing individual ratings**
- Analyze age demographics **without knowing specific ages**
- Track visit durations **without identifying individual visitors**
- Generate reports **without ever accessing raw personal data**


## 📋 Smart Contract Information

### Deployment Details

**Contract Name**: `PrivateMuseumVisitTracker`

**Contract Address**: `0xe4432488D78fd8CF32b096c385Ca251230427458`

**Network**: Sepolia Testnet (Zama FHE-enabled)

**Chain ID**: 11155111

**Block Explorer**: [View on Etherscan](https://sepolia.etherscan.io/address/0xe4432488D78fd8CF32b096c385Ca251230427458)

**Compiler Version**: Solidity 0.8.24

**Optimization**: Enabled (800 runs)

### Contract Architecture

```
PrivateMuseumVisitTracker
├── Visitor Management
│   ├── registerVisitor() - Register with encrypted age
│   └── visitorProfiles - Encrypted visitor data storage
├── Exhibition Management
│   ├── createExhibition() - Museum managers create exhibitions
│   ├── setExhibitionStatus() - Activate/deactivate exhibitions
│   └── exhibitions - Exhibition data and encrypted statistics
├── Visit Recording
│   ├── recordPrivateVisit() - Record visit with encrypted feedback
│   └── visitRecords - Individual encrypted visit records
└── Access Control
    ├── onlyOwner - Contract owner permissions
    ├── onlyMuseumManager - Manager permissions
    └── onlyRegisteredVisitor - Visitor permissions
```

## 🔒 Privacy Features

### Confidential Cultural Consumption Data Protection

#### What Data is Encrypted (Private)?

All sensitive personal information is encrypted using FHE:

1. **👤 Visitor Age** (euint8)
   - Encrypted age between 1-119 years
   - Enables demographic analysis without individual exposure
   - Age group classification preserved under encryption

2. **⭐ Satisfaction Ratings** (euint8)
   - Scale: 1-10 (encrypted)
   - Honest feedback without fear of identification
   - Aggregate satisfaction metrics computable on encrypted data

3. **💡 Interest Levels** (euint8)
   - Scale: 1-5 (encrypted)
   - Engagement measurement while preserving privacy
   - Pattern analysis without individual tracking

4. **⏱️ Visit Duration** (euint32)
   - Time spent at exhibitions in minutes (encrypted)
   - Behavior analysis without visitor identification
   - Statistical insights on engagement duration

#### What Data is Public (Transparent)?

For institutional accountability and transparency:

- **Exhibition Information**: Names, types, descriptions
- **Aggregate Visitor Counts**: Total registered visitors (number only)
- **Exhibition Schedules**: Start dates, end dates, active status
- **Registration Timestamps**: When visitors registered (not who)

This **selective encryption strategy** ensures privacy where it matters while maintaining the transparency needed for public institutions.

## ✨ Key Features

### For Visitors

**🔐 Complete Anonymity**
- Your personal information is encrypted before blockchain storage
- Museum staff cannot see your individual data
- Only aggregate statistics are visible

**💬 Honest Feedback**
- Rate exhibitions freely without fear of identification
- Your satisfaction ratings remain confidential
- Contribute to improvement without privacy concerns

**🔍 Blockchain Verification**
- Your participation is permanently recorded
- Verifiable proof of museum visits
- Immutable audit trail

**🚀 Simple Interface**
- Connect MetaMask wallet
- Register once with encrypted age
- Start tracking visits immediately

### For Museums & Cultural Institutions

**📊 Privacy-Compliant Analytics**
- Collect visitor data without GDPR/CCPA concerns
- Built-in privacy-by-design architecture
- No personally identifiable information stored

**📈 Visitor Behavior Insights**
- Understand patterns without compromising individual privacy
- Demographic analysis on encrypted data
- Engagement metrics and satisfaction trends

**🎨 Exhibition Performance Metrics**
- Track aggregate satisfaction scores
- Measure visitor interest levels
- Analyze visit durations and patterns

**✅ Transparent Operations**
- All data collection is auditable on blockchain
- Visitors can verify their data is encrypted
- Regulatory compliance demonstrable

### Exhibition Types Supported

The system supports comprehensive cultural institution coverage:

- 🏛️ **History** - Historical artifacts and heritage
- 🎨 **Art** - Fine arts, galleries, installations
- 🔬 **Science** - Scientific exhibits and demonstrations
- 🌍 **Culture** - Cultural heritage and traditions
- 💻 **Technology** - Tech innovations and digital exhibits
- 🌿 **Nature** - Natural history and environmental exhibits


## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have:

- **Node.js** v18 or higher
- **npm** or **yarn** package manager
- **MetaMask** browser extension
- **Sepolia testnet ETH** (get from [Sepolia Faucet](https://sepoliafaucet.com/))

### Installation

```bash
# Clone the repository
git clone https://github.com/MyleneMcClure/FHEMuseumVisitTracker.git
cd FHEMuseumVisitTracker

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Configure your environment variables
# Edit .env with your Sepolia RPC URL and private key
```

### Configuration

Edit your `.env` file:

```env
# Network Configuration
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=your_private_key_here

# Contract Configuration
CONTRACT_ADDRESS=0xe4432488D78fd8CF32b096c385Ca251230427458

# Etherscan Verification
ETHERSCAN_API_KEY=your_etherscan_api_key

# Gateway Configuration
GATEWAY_URL=https://gateway.zama.ai
```

### Running the Application

#### Smart Contract Development

```bash
# Compile contracts
npm run compile

# Run tests (68 comprehensive test cases)
npm test

# Deploy to Sepolia
npm run deploy

# Verify on Etherscan
npm run verify

# Interact with deployed contract
npm run interact
```

### Quick Test Drive

Want to try it immediately? Visit the live application:

🌐 **[https://fhe-museum-visit-tracker.vercel.app/](https://fhe-museum-visit-tracker.vercel.app/)**

1. Connect your MetaMask wallet (Sepolia testnet)
2. Register as a visitor with your encrypted age
3. Browse available exhibitions
4. Record a private visit with encrypted feedback
5. See your transaction confirmed on blockchain

## 🛠️ Technology Stack

### Blockchain Layer

- **Solidity 0.8.24** - Smart contract language
- **Zama fhEVM** - Fully Homomorphic Encryption
- **Hardhat** - Development environment
- **Ethers.js v6** - Blockchain interaction

### Development Tools

- **Hardhat** - Compilation, testing, deployment
- **Solhint** - Solidity linting
- **ESLint** - JavaScript linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **GitHub Actions** - CI/CD pipeline

### Testing Framework

- **Mocha** - Test framework
- **Chai** - Assertion library
- **Hardhat Network** - Local blockchain
- **Hardhat Coverage** - Code coverage
- **Gas Reporter** - Gas usage analysis

## 📚 Documentation

### Core Documentation

- **[TESTING.md](TESTING.md)** - Comprehensive testing guide (68 test cases)
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Deployment instructions and verification
- **[CI_CD.md](CI_CD.md)** - CI/CD pipeline documentation
- **[SECURITY.md](SECURITY.md)** - Security features and optimization guide

### Additional Resources

- **[TEST_SUMMARY.md](TEST_SUMMARY.md)** - Test coverage summary
- **[CICD_SUMMARY.md](CICD_SUMMARY.md)** - CI/CD implementation summary
- **[SECURITY_OPTIMIZATION_SUMMARY.md](SECURITY_OPTIMIZATION_SUMMARY.md)** - Complete optimization details

## 🎬 Demo Video

**Important**: The demonstration video `demo.mp4` is included in the repository.

**To watch the demo**:
1. Clone or download the repository from GitHub
2. Locate the `demo.mp4` file in the root directory
3. Download and open the file with your video player

**Note**: The video file requires download to view. Direct video links cannot be opened in browsers due to file size and format. Please download the file from the GitHub repository to watch the complete demonstration of the FHE Museum Visit Tracker system.

The demo video covers:
- System overview and core concepts
- Wallet connection and setup
- Visitor registration with encrypted age
- Exhibition browsing
- Private visit recording with encrypted feedback
- Transaction confirmation and verification
- Privacy features demonstration

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Zama** - For fhEVM technology and FHE libraries
- **Ethereum Foundation** - For the blockchain platform
- **Hardhat** - For excellent development tools
- **OpenZeppelin** - For security best practices

## 📞 Contact & Support

- **GitHub Repository**: [https://github.com/MyleneMcClure/FHEMuseumVisitTracker](https://github.com/MyleneMcClure/FHEMuseumVisitTracker)
- **GitHub Issues**: [Report bugs or request features](https://github.com/MyleneMcClure/FHEMuseumVisitTracker/issues)
- **Live Demo**: [https://fhe-museum-visit-tracker.vercel.app/](https://fhe-museum-visit-tracker.vercel.app/)

---

**Built with ❤️ for privacy-preserving cultural analytics**

**Powered by Zama FHE Technology**

**🔒 Privacy First • 📊 Analytics Second • 🏛️ Culture Always**
