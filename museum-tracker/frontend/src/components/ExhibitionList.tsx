import { FHEVMClient } from 'fhevm-sdk';
import './Card.css';

export default function ExhibitionList({ client }: { client: FHEVMClient }) {
  return (
    <div className="card">
      <div className="card-header">
        <h3>🎨 Exhibitions</h3>
        <p className="subtitle">Browse available exhibitions</p>
      </div>
      <div className="card-body">
        <p style={{color: '#718096'}}>Exhibition list displays here</p>
      </div>
    </div>
  );
}
