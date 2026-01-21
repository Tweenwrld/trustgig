'use client';

import dynamic from 'next/dynamic';
import { ReactNode } from 'react';

// Dynamic import with SSR disabled to avoid libsodium issues
const WalletProvider = dynamic(
    () => import('@/components/cardano/WalletProvider').then(mod => mod.WalletProvider),
    { 
        ssr: false,
        loading: () => (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        ),
    }
);

interface ClientProvidersProps {
    children: ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
    return (
        <WalletProvider>
            {children}
        </WalletProvider>
    );
}
