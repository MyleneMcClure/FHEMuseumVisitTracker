# Museum Visit Tracker - Frontend Application

React + Vite frontend for the Privacy-Preserving Museum Visit Tracker with FHEVM SDK integration.

## 🎯 Overview

This is a modern web application built with React, Vite, and TypeScript, demonstrating complete FHEVM SDK integration for privacy-preserving museum visit tracking.

## ✨ Features

- **🦊 Wallet Connection**: MetaMask integration for Web3 authentication
- **🎫 Visitor Registration**: Register with encrypted age using FHE
- **📝 Visit Recording**: Record visits with encrypted feedback
- **🎨 Exhibition Browser**: View available exhibitions
- **⚙️ Exhibition Management**: Create and manage exhibitions (for managers)
- **🔒 Complete Privacy**: All sensitive data encrypted before blockchain submission

## 🛠️ Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety
- **FHEVM SDK** - Privacy-preserving encryption
- **Ethers.js v6** - Ethereum interaction
- **CSS Modules** - Component styling

## 📦 Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
# VITE_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
# VITE_CONTRACT_ADDRESS=0x...
```

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # React components
│   │   ├── WalletConnect.tsx       # Wallet connection
│   │   ├── VisitorRegistration.tsx # Registration form
│   │   ├── VisitRecorder.tsx       # Visit recording
│   │   ├── ExhibitionList.tsx      # Exhibition display
│   │   ├── ExhibitionManager.tsx   # Exhibition management
│   │   ├── WalletConnect.css       # Component styles
│   │   └── Card.css                # Shared card styles
│   ├── lib/
│   │   └── contract.ts      # Contract config & ABI
│   ├── App.tsx              # Main app component
│   ├── App.css              # App styles
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── index.html               # HTML template
├── package.json             # Dependencies
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript config
└── .env.example             # Environment template
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file with:

```env
# Ethereum RPC URL (Infura, Alchemy, etc.)
VITE_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY

# Chain ID (11155111 for Sepolia)
VITE_CHAIN_ID=11155111

# Deployed contract address
VITE_CONTRACT_ADDRESS=0x...

# FHEVM Gateway URL
VITE_GATEWAY_URL=https://gateway.zama.ai
```

### Contract Configuration

The contract ABI and address are configured in `src/lib/contract.ts`. Update the `CONTRACT_ADDRESS` after deploying your contract.

## 🎨 Components

### WalletConnect

Handles MetaMask wallet connection and displays connection status.

**Features**:
- Auto-detect existing connection
- Connect/disconnect functionality
- Display wallet address and network
- Error handling

### VisitorRegistration

Allows visitors to register with encrypted age.

**SDK Integration**:
- Uses `useFHEVMWrite` hook
- Encrypts age value with `createEncryptedInput`
- Submits to `registerVisitor` contract function

**Code Example**:
```typescript
const { write, isLoading, txHash } = useFHEVMWrite(client, 'registerVisitor');

// Encrypt age
const encryptedInput = instance.createEncryptedInput(contractAddress, signerAddress);
encryptedInput.add8(BigInt(age));
const encrypted = encryptedInput.encrypt();

// Submit
await write(encrypted.handles, encrypted.inputProof);
```

### VisitRecorder

Records museum visits with encrypted feedback.

**Encrypted Data**:
- Age (euint8)
- Satisfaction rating 1-10 (euint8)
- Visit duration in minutes (euint32)
- Interest level 1-5 (euint8)

### ExhibitionList

Displays all exhibitions with public statistics.

**Features**:
- Real-time exhibition data
- Exhibition type badges
- Visitor counts
- Active/inactive status

### ExhibitionManager

Allows museum managers to create and manage exhibitions.

**Features**:
- Create new exhibitions
- Set exhibition dates
- Activate/deactivate exhibitions
- Manager-only access control

## 📱 User Flow

1. **Connect Wallet**
   - Click "Connect MetaMask"
   - Approve connection in MetaMask
   - FHEVM client initializes automatically

2. **Register as Visitor**
   - Enter age (1-119)
   - Click "Register with Encrypted Age"
   - Age is encrypted with FHE
   - Submit transaction
   - Wait for confirmation

3. **View Exhibitions**
   - Browse available exhibitions
   - See exhibition details
   - View public visitor counts

4. **Record Visit**
   - Select exhibition
   - Enter feedback data
   - All values encrypted in batch
   - Submit encrypted feedback

5. **Manage Exhibitions** (Managers only)
   - Create new exhibitions
   - Set dates and types
   - Activate/deactivate

## 🔒 Privacy Features

### What's Encrypted?

- ✅ Visitor age
- ✅ Satisfaction ratings
- ✅ Visit duration
- ✅ Interest levels
- ✅ Age group classification

### What's Public?

- Exhibition names and details
- Exhibition dates
- Public visitor counts (not individual data)
- Exhibition active status

### Privacy Benefits

1. **On-Chain Privacy**: Personal data never exposed in plaintext
2. **Anonymous Analytics**: Museums get insights without identifying individuals
3. **GDPR Compliant**: No unencrypted personal data stored
4. **Verifiable**: Encryption happens client-side before submission

## 🧪 Development

### Prerequisites

- Node.js 18+
- npm or yarn
- MetaMask browser extension
- Sepolia ETH for testing

### Local Development

```bash
# Start dev server
npm run dev

# In another terminal, ensure contract is deployed
cd ../
npm run deploy:local

# Update VITE_CONTRACT_ADDRESS in .env
```

### Building

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

### Linting

```bash
npm run lint
```

## 🐛 Troubleshooting

### MetaMask Not Connecting

- Ensure MetaMask is installed
- Check you're on Sepolia network
- Try refreshing the page
- Clear browser cache

### Transaction Failing

- Verify you have Sepolia ETH
- Check contract address is correct
- Ensure you're registered as visitor
- Verify network in MetaMask matches configuration

### FHEVM Encryption Error

- Check RPC URL is correct
- Verify gateway URL is accessible
- Ensure contract ABI matches deployed contract
- Check browser console for detailed errors

### Build Errors

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

## 📚 Learn More

### FHEVM SDK Documentation

- [SDK README](../../../packages/fhevm-sdk/README.md)
- [API Reference](../../../packages/fhevm-sdk/README.md#api-reference)

### Contract Documentation

- [Smart Contract Guide](../README.md)
- [Deployment Instructions](../README.md#deployment)

### External Resources

- [Zama FHEVM Docs](https://docs.zama.ai/fhevm)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Ethers.js v6 Docs](https://docs.ethers.org/v6/)

## 🎓 Key Concepts

### FHEVM SDK Integration

This frontend demonstrates complete FHEVM SDK integration:

1. **Client Initialization**
   ```typescript
   const { connect, client } = useFHEVM();
   await connect({ provider, signer, contractAddress, contractABI });
   ```

2. **Encryption**
   ```typescript
   const instance = client.instance;
   const encryptedInput = instance.createEncryptedInput(address, signer);
   encryptedInput.add8(value);
   const { handles, inputProof } = encryptedInput.encrypt();
   ```

3. **Contract Interaction**
   ```typescript
   const { write } = useFHEVMWrite(client, 'functionName');
   await write(handles, inputProof);
   ```

## 🚀 Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Deploy to Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

## 📄 License

MIT

## 🤝 Contributing

Contributions welcome! This frontend serves as a reference implementation for FHEVM SDK integration.

---

**Built with FHEVM SDK | Powered by Zama FHE Technology**
