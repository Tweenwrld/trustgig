'use client';

import { useState, useEffect } from 'react';
import { BrowserWallet } from '@meshsdk/core';
import { useWalletContext } from './WalletProvider';

export function CardanoWallet() {
    const { connected, connecting, address, connect, disconnect } = useWalletContext();
    const [availableWallets, setAvailableWallets] = useState<string[]>([]);

    useEffect(() => {
        // Get available wallets
        const wallets = BrowserWallet.getInstalledWallets();
        setAvailableWallets(wallets.map((w) => w.name));
    }, []);

    if (connected && address) {
        return (
            <div className="space-y-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
                        Connected Wallet
                    </p>
                    <p className="text-xs font-mono text-green-600 dark:text-green-400 break-all">
                        {address}
                    </p>
                </div>
                <button
                    onClick={disconnect}
                    className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                    Disconnect
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {availableWallets.length === 0 ? (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        No Cardano wallets detected. Please install a wallet extension.
                    </p>
                </div>
            ) : (
                availableWallets.map((walletName) => (
                    <button
                        key={walletName}
                        onClick={() => connect(walletName)}
                        disabled={connecting}
                        className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                    >
                        {connecting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                <span>Connecting...</span>
                            </>
                        ) : (
                            <span>Connect {walletName}</span>
                        )}
                    </button>
                ))
            )}
        </div>
    );
}
