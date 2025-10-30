import { useState } from 'react';
import { useFHEVMWrite } from 'fhevm-sdk';
import type { FHEVMClient } from 'fhevm-sdk';
import './Card.css';

interface Props {
  client: FHEVMClient;
  userAddress: string;
}

export default function VisitorRegistration({ client }: Props) {
  const [age, setAge] = useState('');
  const { write, isLoading, txHash, error } = useFHEVMWrite(client, 'registerVisitor');
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccess(false);

    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 119) {
      alert('Please enter a valid age between 1 and 119');
      return;
    }

    try {
      const instance = client.instance;
      const contractAddress = await client.contract.getAddress();
      const encryptedInput = instance.createEncryptedInput(contractAddress, client.signer?.address);
      encryptedInput.add8(BigInt(ageNum));
      const encrypted = encryptedInput.encrypt();

      const tx = await write(encrypted.handles, encrypted.inputProof);
      if (tx) {
        setSuccess(true);
        setAge('');
      }
    } catch (err) {
      console.error('Registration failed:', err);
    }
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3>🎫 Register as Visitor</h3>
        <p className="subtitle">Your age will be encrypted using FHE</p>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="age">Age (1-119)</label>
            <input
              type="number"
              id="age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Enter your age"
              min="1"
              max="119"
              required
              disabled={isLoading}
            />
          </div>
          <button type="submit" disabled={isLoading || !age} className="submit-button">
            {isLoading ? 'Registering...' : 'Register with Encrypted Age'}
          </button>
        </form>
        {success && txHash && (
          <div className="success-message">
            <span className="icon">✓</span> Successfully registered!
            <div className="tx-info">Tx: {txHash.slice(0, 10)}...{txHash.slice(-8)}</div>
          </div>
        )}
        {error && <div className="error-message">{error.message}</div>}
      </div>
    </div>
  );
}
