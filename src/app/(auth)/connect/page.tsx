'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CardanoWallet } from '@/components/cardano/CardanoWallet';
import { useWallet } from '@/hooks/useWallet';

export default function ConnectPage() {
    const router = useRouter();
    const { connected, wallet } = useWallet();

    useEffect(() => {
        if (connected && wallet) {
            // Redirect to dashboard after successful connection
            router.push('/dashboard');
        }
    }, [connected, wallet, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
            <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        Welcome to TrustGig
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Connect your Cardano wallet to get started
                    </p>
                </div>

                <div className="mt-8">
                    <CardanoWallet />
                </div>

                <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                    <p>
                        Don't have a wallet?{' '}
                        <a
                            href="https://namiwallet.io"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-500 dark:text-blue-400"
                        >
                            Get Nami
                        </a>
                        {' or '}
                        <a
                            href="https://eternl.io"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-500 dark:text-blue-400"
                        >
                            Get Eternl
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
