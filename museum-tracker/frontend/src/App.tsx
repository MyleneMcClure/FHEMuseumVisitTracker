import { useState } from 'react';
import { ethers } from 'ethers';
import { useFHEVM } from 'fhevm-sdk';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './lib/contract';
import WalletConnect from './components/WalletConnect';
import VisitorRegistration from './components/VisitorRegistration';
import ExhibitionManager from './components/ExhibitionManager';
import VisitRecorder from './components/VisitRecorder';
import ExhibitionList from './components/ExhibitionList';
import './App.css';

function App() {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [address, setAddress] = useState<string>('');

  const { connect, isConnected, client, error } = useFHEVM();

  async function handleWalletConnect(
    newProvider: ethers.BrowserProvider,
    newSigner: ethers.JsonRpcSigner,
    userAddress: string
  ) {
    setProvider(newProvider);
    setSigner(newSigner);
    setAddress(userAddress);

    // Connect FHEVM client
    await connect({
      provider: newProvider,
      signer: newSigner,
      contractAddress: CONTRACT_ADDRESS,
      contractABI: CONTRACT_ABI,
    });
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <span className="icon">🏛️</span>
            <h1>Museum Visit Tracker</h1>
          </div>
          <p className="tagline">Privacy-Preserving Analytics with Fully Homomorphic Encryption</p>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          <WalletConnect onConnect={handleWalletConnect} />

          {error && (
            <div className="error-banner">
              <span className="icon">⚠️</span>
              <span>{error.message}</span>
            </div>
          )}

          {isConnected && client ? (
            <>
              <div className="info-section">
                <h2>🔐 Privacy-First Museum Analytics</h2>
                <p>
                  This application uses <strong>Fully Homomorphic Encryption (FHE)</strong> to protect
                  visitor privacy while enabling valuable analytics. All sensitive data (age, satisfaction,
                  duration, interest) is encrypted before being stored on-chain.
                </p>
                <div className="features-grid">
                  <div className="feature-card">
                    <span className="feature-icon">🔒</span>
                    <h3>Private Data</h3>
                    <p>Personal information encrypted on-chain</p>
                  </div>
                  <div className="feature-card">
                    <span className="feature-icon">📊</span>
                    <h3>Anonymous Analytics</h3>
                    <p>Statistical insights without exposing individuals</p>
                  </div>
                  <div className="feature-card">
                    <span className="feature-icon">✅</span>
                    <h3>GDPR Compliant</h3>
                    <p>No personal data in plaintext</p>
                  </div>
                  <div className="feature-card">
                    <span className="feature-icon">🛡️</span>
                    <h3>Verifiable</h3>
                    <p>Cryptographically secure encryption</p>
                  </div>
                </div>
              </div>

              <div className="main-grid">
                <div className="left-column">
                  <VisitorRegistration client={client} userAddress={address} />
                  <VisitRecorder client={client} userAddress={address} />
                </div>
                <div className="right-column">
                  <ExhibitionList client={client} />
                  <ExhibitionManager client={client} userAddress={address} />
                </div>
              </div>

              <div className="sdk-badge">
                <p>
                  <strong>Powered by FHEVM SDK</strong> - Universal framework-agnostic SDK for
                  privacy-preserving dApps
                </p>
                <div className="tech-tags">
                  <span className="tag">React</span>
                  <span className="tag">Vite</span>
                  <span className="tag">TypeScript</span>
                  <span className="tag">FHEVM SDK</span>
                  <span className="tag">Ethers.js v6</span>
                </div>
              </div>
            </>
          ) : (
            <div className="connect-prompt">
              <span className="large-icon">👋</span>
              <h2>Welcome to Museum Visit Tracker</h2>
              <p>Connect your wallet to start tracking museum visits with complete privacy</p>
              <ul className="feature-list">
                <li>✅ Register as a visitor with encrypted age</li>
                <li>✅ Record private visit feedback</li>
                <li>✅ View exhibitions and statistics</li>
                <li>✅ Create and manage exhibitions (managers only)</li>
              </ul>
            </div>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>Built with FHEVM SDK | Powered by Zama FHE Technology</p>
        <p className="disclaimer">All visitor data is encrypted using Fully Homomorphic Encryption</p>
      </footer>
    </div>
  );
}

export default App;
