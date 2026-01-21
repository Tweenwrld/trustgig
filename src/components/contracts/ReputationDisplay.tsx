'use client';

interface ReputationDisplayProps {
  score: number | null;
  completedJobs: number;
  totalEarned: number;
}

export default function ReputationDisplay({
  score,
  completedJobs,
  totalEarned,
}: ReputationDisplayProps) {
  const getReputationLevel = (score: number | null) => {
    if (!score) return 'New';
    if (score >= 90) return 'Elite';
    if (score >= 70) return 'Excellent';
    if (score >= 50) return 'Good';
    return 'Fair';
  };

  return (
    <div className="p-4 border rounded-lg space-y-3">
      <h3 className="text-lg font-semibold">Reputation</h3>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Score</p>
          <p className="text-2xl font-bold">{score ?? 'N/A'}</p>
          <p className="text-xs text-muted-foreground">
            {getReputationLevel(score)}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Jobs</p>
          <p className="text-2xl font-bold">{completedJobs}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Earned</p>
          <p className="text-2xl font-bold">{totalEarned.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground">ADA</p>
        </div>
      </div>
    </div>
  );
}
