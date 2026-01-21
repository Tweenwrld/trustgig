'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamic import with SSR disabled to avoid libsodium issues
const CardanoWallet = dynamic(
    () => import('@/components/cardano/CardanoWallet').then(mod => mod.CardanoWallet),
    { ssr: false, loading: () => <div className="px-4 py-2 bg-white/10 rounded-lg text-white">Loading wallet...</div> }
);

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Header */}
            <header className="border-b border-white/10 backdrop-blur-sm">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">T</span>
                        </div>
                        <span className="text-white font-bold text-2xl">TrustGig</span>
                    </div>
                    <CardanoWallet />
                </div>
            </header>

            {/* Hero Section */}
            <main className="container mx-auto px-4 py-20">
                <div className="text-center max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                        Decentralized
                        <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                            {' '}Freelancing
                        </span>
                    </h1>
                    <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                        Secure escrow payments, verified credentials, and trustless dispute resolution 
                        powered by Cardano smart contracts.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/post-job"
                            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-500 hover:to-blue-500 transition-all transform hover:scale-105"
                        >
                            Post a Job
                        </Link>
                        <Link
                            href="/dashboard"
                            className="px-8 py-4 bg-white/10 backdrop-blur text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all"
                        >
                            Find Work
                        </Link>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="mt-32 grid md:grid-cols-3 gap-8">
                    <FeatureCard
                        icon="🔒"
                        title="Secure Escrow"
                        description="Funds are locked in smart contracts until work is verified and approved by both parties."
                    />
                    <FeatureCard
                        icon="✓"
                        title="Verified Credentials"
                        description="On-chain credential verification ensures freelancers' skills are authenticated."
                    />
                    <FeatureCard
                        icon="⚖️"
                        title="Fair Disputes"
                        description="Decentralized arbitration with transparent multisig resolution for conflicts."
                    />
                </div>

                {/* Stats Section */}
                <div className="mt-32 grid grid-cols-2 md:grid-cols-4 gap-8">
                    <StatCard value="$0" label="Total Volume" />
                    <StatCard value="0" label="Active Jobs" />
                    <StatCard value="0" label="Freelancers" />
                    <StatCard value="0%" label="Dispute Rate" />
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-white/10 mt-20">
                <div className="container mx-auto px-4 py-8 text-center text-gray-400">
                    <p>Built on Cardano • Powered by Smart Contracts</p>
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
    return (
        <div className="p-6 rounded-2xl bg-white/5 backdrop-blur border border-white/10 hover:bg-white/10 transition-all">
            <div className="text-4xl mb-4">{icon}</div>
            <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
            <p className="text-gray-400">{description}</p>
        </div>
    );
}

function StatCard({ value, label }: { value: string; label: string }) {
    return (
        <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-white mb-2">{value}</div>
            <div className="text-gray-400">{label}</div>
        </div>
    );
}
