import { FHEVMClient } from 'fhevm-sdk';
import './Card.css';

export default function VisitRecorder({ client }: { client: FHEVMClient; userAddress: string }) {
  return (
    <div className="card">
      <div className="card-header">
        <h3>📝 Record Private Visit</h3>
        <p className="subtitle">All feedback encrypted with FHE</p>
      </div>
      <div className="card-body">
        <p style={{color: '#718096'}}>Visit recording form - encrypt age, satisfaction, duration, and interest level</p>
      </div>
    </div>
  );
}
