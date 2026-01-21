'use client';

import { useState } from 'react';

interface Milestone {
  id: string;
  description: string;
  amount: number;
  completed: boolean;
  approved: boolean;
}

interface MilestoneManagerProps {
  milestones: Milestone[];
  onComplete: (id: string) => Promise<void>;
  onApprove: (id: string) => Promise<void>;
  isClient: boolean;
}

export default function MilestoneManager({
  milestones,
  onComplete,
  onApprove,
  isClient,
}: MilestoneManagerProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleAction = async (id: string, action: 'complete' | 'approve') => {
    setLoading(id);
    try {
      if (action === 'complete') {
        await onComplete(id);
      } else {
        await onApprove(id);
      }
    } catch (error) {
      console.error(`Error ${action}ing milestone:`, error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Milestones</h3>
      {milestones.map((milestone) => (
        <div key={milestone.id} className="p-4 border rounded-lg space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium">{milestone.description}</p>
              <p className="text-sm text-muted-foreground">
                {milestone.amount} ADA
              </p>
            </div>
            <div className="flex gap-2">
              {milestone.completed && (
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                  Completed
                </span>
              )}
              {milestone.approved && (
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                  Approved
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            {!milestone.completed && !isClient && (
              <button
                onClick={() => handleAction(milestone.id, 'complete')}
                disabled={loading === milestone.id}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded disabled:opacity-50"
              >
                {loading === milestone.id ? 'Processing...' : 'Mark Complete'}
              </button>
            )}
            {milestone.completed && !milestone.approved && isClient && (
              <button
                onClick={() => handleAction(milestone.id, 'approve')}
                disabled={loading === milestone.id}
                className="px-3 py-1 text-sm bg-green-600 text-white rounded disabled:opacity-50"
              >
                {loading === milestone.id ? 'Processing...' : 'Approve'}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
