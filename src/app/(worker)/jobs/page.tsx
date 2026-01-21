import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Browse Jobs - TrustGig',
  description: 'Find and apply for gig opportunities',
};

export default function JobsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Available Jobs</h1>
      <div className="grid gap-4">
        {/* Job listings will be implemented here */}
        <p className="text-muted-foreground">Job listings coming soon...</p>
      </div>
    </div>
  );
}
