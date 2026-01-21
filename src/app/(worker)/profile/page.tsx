import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Worker Profile - TrustGig',
  description: 'Manage your worker profile and credentials',
};

export default function WorkerProfilePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Worker Profile</h1>
      <div className="space-y-6">
        {/* Profile management will be implemented here */}
        <p className="text-muted-foreground">Profile management coming soon...</p>
      </div>
    </div>
  );
}
