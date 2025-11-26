# FHE Museum Visit Tracker - Full-Stack Privacy-Preserving Application

[![CI/CD Pipeline](https://github.com/MyleneMcClure/FHEMuseumVisitTracker/workflows/CI%2FCD%20Pipeline/badge.svg)](https://github.com/MyleneMcClure/FHEMuseumVisitTracker/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.24-blue.svg)](https://soliditylang.org/)
[![Hardhat](https://img.shields.io/badge/Built%20with-Hardhat-yellow.svg)](https://hardhat.org/)
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-3178C6.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-4.4.0-646CFF.svg)](https://vitejs.dev/)
[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen.svg)](https://fhe-museum-visit-tracker.vercel.app/)

**Confidential Cultural Consumption Data System** - A complete full-stack Web3 application powered by Fully Homomorphic Encryption (FHE) technology, enabling privacy-preserving visitor analytics for museums and cultural institutions.

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


## 📦 Project Structure

This is a **full-stack Web3 application** with both smart contract and frontend components:

```
museum-tracker/
├── contracts/                          # Smart Contract Layer
│   └── PrivateMuseumVisitTracker.sol  # FHE-enabled Solidity contract (400+ lines)
│
├── frontend/                           # Frontend Application Layer
│   ├── src/
│   │   ├── components/                # React Components (5 components)
│   │   │   ├── WalletConnect.tsx      # MetaMask wallet integration
│   │   │   ├── VisitorRegistration.tsx # Encrypted visitor registration
│   │   │   ├── VisitRecorder.tsx      # Private visit recording
│   │   │   ├── ExhibitionList.tsx     # Exhibition browser
│   │   │   └── ExhibitionManager.tsx  # Exhibition management
│   │   ├── lib/
│   │   │   └── contract.ts            # Contract ABI and configuration
│   │   ├── App.tsx                    # Main application component
│   │   ├── main.tsx                   # React entry point
│   │   └── index.html                 # HTML entry point
│   ├── vite.config.ts                 # Vite build configuration
│   ├── tsconfig.json                  # TypeScript configuration
│   └── package.json                   # Frontend dependencies
│
├── scripts/                            # Deployment & Interaction Scripts
│   ├── deploy.js                      # Smart contract deployment
│   └── interact.js                    # Contract interaction examples
│
├── config/
│   └── hardhat.config.js              # Hardhat development configuration
│
├── package.json                        # Root project dependencies
└── README.md                          # Project documentation

Total Files: 27
Total Lines of Code: 4,665
```

### Application Architecture

**Three-Layer Architecture:**

1. **Smart Contract Layer** (Blockchain)
   - Solidity contract with FHE encryption
   - Deployed on Sepolia testnet
   - Handles visitor registration, visit recording, exhibition management

2. **Frontend Layer** (React + TypeScript + Vite)
   - Modern React 18 with hooks
   - TypeScript for type safety
   - Vite for fast development and optimized builds
   - MetaMask integration for Web3 wallet

3. **Integration Layer** (fhevm-sdk + Ethers.js)
   - Custom SDK for FHE operations
   - Ethers.js for blockchain interaction
   - Encrypted data handling before blockchain submission

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

#### Option 1: Frontend Development (React + Vite)

```bash
# Navigate to frontend directory
cd frontend

# Install frontend dependencies
npm install

# Start development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint TypeScript code
npm run lint
```

#### Option 2: Smart Contract Development

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

#### Option 3: Full-Stack Development

```bash
# Terminal 1: Start Hardhat local node
npm run node

# Terminal 2: Deploy contract to local network
npm run deploy:local

# Terminal 3: Start frontend dev server
cd frontend && npm run dev
```

### Quick Test Drive

Want to try it immediately? Visit the live application:

🌐 **[https://fhe-museum-visit-tracker.vercel.app/](https://fhe-museum-visit-tracker.vercel.app/)**

1. Connect your MetaMask wallet (Sepolia testnet)
2. Register as a visitor with your encrypted age
3. Browse available exhibitions
4. Record a private visit with encrypted feedback
5. See your transaction confirmed on blockchain

## 🎨 Frontend Features

### React Components Overview

The frontend application consists of **5 main React components**, each responsible for a specific feature:

#### 1. **WalletConnect Component** (`WalletConnect.tsx`)
- MetaMask wallet connection and disconnection
- Automatic network detection and switching to Sepolia
- Wallet address display with truncation
- Connection status indicator
- Responsive design with gradient styling

**Key Features:**
- Detects if MetaMask is installed
- Handles account changes automatically
- Switches to Sepolia testnet if needed
- Shows user-friendly connection status

#### 2. **VisitorRegistration Component** (`VisitorRegistration.tsx`)
- One-time visitor registration with encrypted age
- Age validation (1-120 years)
- Integration with smart contract `registerVisitor()` function
- Transaction confirmation and status display
- Clean, intuitive form interface

**Privacy Features:**
- Age is encrypted client-side before blockchain submission
- No plaintext age data ever stored on-chain
- User confirmation of successful registration

#### 3. **VisitRecorder Component** (`VisitRecorder.tsx`)
- Record private visit experiences
- Encrypted feedback submission
- Multiple data points collection:
  - Exhibition ID selection
  - Satisfaction rating (1-10 scale) - encrypted
  - Visit duration in minutes
  - Interest level (1-5 scale) - encrypted
- Input validation and error handling
- Real-time transaction status

**Encryption Flow:**
```
User Input → Client-Side Encryption → Blockchain → Permanent Privacy
```

#### 4. **ExhibitionList Component** (`ExhibitionList.tsx`)
- Display all available exhibitions
- Real-time data from smart contract
- Exhibition information display:
  - Exhibition name and type
  - Start and end dates
  - Active/inactive status
  - Public visitor count (aggregate only)
- Responsive grid layout
- Color-coded exhibition types

**Exhibition Types:**
- 🏛️ History - Orange theme
- 🎨 Art - Pink theme
- 🔬 Science - Blue theme
- 🌍 Culture - Green theme
- 💻 Technology - Purple theme
- 🌿 Nature - Teal theme

#### 5. **ExhibitionManager Component** (`ExhibitionManager.tsx`)
- Museum manager functionality
- Create new exhibitions
- Set exhibition dates and types
- Access control (only authorized managers)
- Exhibition activation/deactivation

**Form Fields:**
- Exhibition name (required)
- Exhibition type dropdown (6 options)
- Start date (Unix timestamp)
- End date (Unix timestamp)
- Input validation

### UI/UX Features

**Design Philosophy:**
- **Modern Gradient Design**: Blue-to-purple gradient theme
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Card-Based Interface**: Clean, organized component layout
- **Real-time Feedback**: Loading states and transaction confirmations
- **Error Handling**: User-friendly error messages
- **Accessibility**: Semantic HTML and proper ARIA labels

**Styling Approach:**
- CSS Modules for scoped styling
- Custom CSS with modern features (flexbox, grid)
- Gradient backgrounds and transitions
- Hover effects for better interactivity
- Consistent color scheme across components

### State Management

- **React Hooks**: `useState`, `useEffect` for local state
- **Ethers.js Integration**: Contract instance management
- **Wallet State**: Connected account and network tracking
- **Transaction State**: Loading, success, error states
- **Form State**: Input validation and submission handling

### Performance Optimizations

- **Vite Build Tool**: Lightning-fast HMR (Hot Module Replacement)
- **Code Splitting**: Automatic chunk splitting by Vite
- **Tree Shaking**: Remove unused code in production
- **TypeScript**: Compile-time error detection
- **Lazy Loading**: Components loaded on demand

## 🛠️ Technology Stack

### Frontend Layer

- **React 18.2.0** - Modern UI framework with hooks
- **TypeScript 5.0.0** - Type-safe JavaScript for robust development
- **Vite 4.4.0** - Next-generation frontend build tool
- **Ethers.js v6.0.0** - Ethereum blockchain interaction library
- **fhevm-sdk** - Custom SDK for FHE operations and encryption

### Blockchain & Smart Contracts Layer

- **Solidity 0.8.24** - Smart contract programming language
- **Zama fhEVM** - Fully Homomorphic Encryption for Ethereum
- **@fhevm/solidity ^0.5.0** - FHE library for Solidity contracts
- **Hardhat 2.19.0** - Ethereum development environment
- **Ethers.js v6** - Blockchain interaction and contract deployment

### Development Tools & Build System

- **Vite** - Lightning-fast frontend dev server and bundler
- **@vitejs/plugin-react** - React plugin for Vite with Fast Refresh
- **Hardhat** - Smart contract compilation, testing, deployment
- **Solhint** - Solidity code linting
- **ESLint 8.50.0** - JavaScript/TypeScript linting
- **Prettier** - Code formatting
- **dotenv** - Environment variable management
- **Husky** - Git hooks for code quality
- **GitHub Actions** - Automated CI/CD pipeline

### Testing Framework

- **Mocha** - JavaScript test framework
- **Chai** - Assertion library for tests
- **Hardhat Network** - Local blockchain for testing
- **Hardhat Coverage** - Smart contract code coverage
- **Gas Reporter** - Transaction gas usage analysis

### Type System & Definitions

- **TypeScript** - Static type checking across entire stack
- **@types/react** - React type definitions
- **@types/react-dom** - React DOM type definitions
- **@types/node** - Node.js type definitions

### Deployment & Infrastructure

- **Vercel** - Frontend deployment and hosting
- **Sepolia Testnet** - Ethereum test network with FHE support
- **Infura** - Ethereum node provider
- **MetaMask** - Web3 wallet integration

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
