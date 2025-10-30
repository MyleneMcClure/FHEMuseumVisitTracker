import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './WalletConnect.css';

interface WalletConnectProps {
  onConnect: (provider: ethers.BrowserProvider, signer: ethers.JsonRpcSigner, address: string) => void;
}

export default function WalletConnect({ onConnect }: WalletConnectProps) {
  const [address, setAddress] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string>('');
  const [network, setNetwork] = useState<string>('');

  useEffect(() => {
    checkConnection();
  }, []);

  async function checkConnection() {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();

        if (accounts.length > 0) {
          const signer = await provider.getSigner();
          const userAddress = await signer.getAddress();
          const networkInfo = await provider.getNetwork();

          setAddress(userAddress);
          setNetwork(networkInfo.name);
          onConnect(provider, signer, userAddress);
        }
      } catch (err) {
        console.error('Failed to check connection:', err);
      }
    }
  }

  async function connectWallet() {
    if (typeof window.ethereum === 'undefined') {
      setError('Please install MetaMask to use this application');
      return;
    }

    setIsConnecting(true);
    setError('');

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);

      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();
      const networkInfo = await provider.getNetwork();

      setAddress(userAddress);
      setNetwork(networkInfo.name);
      onConnect(provider, signer, userAddress);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  }

  function formatAddress(addr: string): string {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  }

  return (
    <div className="wallet-connect-section">
      {!address ? (
        <div className="wallet-connect-card">
          <h3>Connect Your Wallet</h3>
          <p>Connect your MetaMask wallet to interact with the museum tracker</p>
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className="connect-button"
          >
            {isConnecting ? (
              <>
                <span className="spinner"></span>
                Connecting...
              </>
            ) : (
              <>
                <span className="icon">🦊</span>
                Connect MetaMask
              </>
            )}
          </button>
          {error && <div className="error-message">{error}</div>}
        </div>
      ) : (
        <div className="wallet-connected-card">
          <div className="connected-info">
            <div className="info-row">
              <span className="label">Wallet:</span>
              <span className="value address">{formatAddress(address)}</span>
            </div>
            <div className="info-row">
              <span className="label">Network:</span>
              <span className="value">{network || 'Unknown'}</span>
            </div>
          </div>
          <span className="status-badge">
            <span className="dot"></span>
            Connected
          </span>
        </div>
      )}
    </div>
  );
}
