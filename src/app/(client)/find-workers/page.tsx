import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Find Workers - TrustGig',
  description: 'Search for skilled artisans and workers',
};

export default function FindWorkersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Find Workers</h1>
      <div className="grid gap-4">
        {/* Worker search and filtering will be implemented here */}
        <p className="text-muted-foreground">Worker search coming soon...</p>
      </div>
    </div>
  );
}
