'use client';

import { useState } from 'react';

interface EscrowInteractionProps {
  jobId: string;
  escrowAddress: string;
  amount: number;
}

export default function EscrowInteraction({
  jobId,
  escrowAddress,
  amount,
}: EscrowInteractionProps) {
  const [loading, setLoading] = useState(false);

  const handleDeposit = async () => {
    setLoading(true);
    try {
      // TODO: Implement escrow deposit logic
      console.log('Depositing to escrow:', { jobId, escrowAddress, amount });
    } catch (error) {
      console.error('Error depositing:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRelease = async () => {
    setLoading(true);
    try {
      // TODO: Implement escrow release logic
      console.log('Releasing from escrow:', { jobId, escrowAddress });
    } catch (error) {
      console.error('Error releasing:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="text-lg font-semibold">Escrow Controls</h3>
      <p className="text-sm text-muted-foreground">
        Amount: {amount} ADA
      </p>
      <div className="flex gap-2">
        <button
          onClick={handleDeposit}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Deposit to Escrow'}
        </button>
        <button
          onClick={handleRelease}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Release Funds'}
        </button>
      </div>
    </div>
  );
}
