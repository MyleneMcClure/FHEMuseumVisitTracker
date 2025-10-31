import { FHEVMClient } from 'fhevm-sdk';
import './Card.css';

export default function ExhibitionManager({ client }: { client: FHEVMClient; userAddress: string }) {
  return (
    <div className="card">
      <div className="card-header">
        <h3>⚙️ Exhibition Manager</h3>
        <p className="subtitle">Create and manage exhibitions (Manager only)</p>
      </div>
      <div className="card-body">
        <p style={{color: '#718096'}}>Exhibition management controls</p>
      </div>
    </div>
  );
}
