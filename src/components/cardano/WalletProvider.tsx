'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BrowserWallet } from '@meshsdk/core';

interface WalletContextType {
    wallet: BrowserWallet | null;
    connected: boolean;
    connecting: boolean;
    address: string | null;
    balance: string | null;
    connect: (walletName: string) => Promise<void>;
    disconnect: () => void;
}

const WalletContext = createContext<WalletContextType>({
    wallet: null,
    connected: false,
    connecting: false,
    address: null,
    balance: null,
    connect: async () => { },
    disconnect: () => { },
});

export function WalletProvider({ children }: { children: ReactNode }) {
    const [wallet, setWallet] = useState<BrowserWallet | null>(null);
    const [connected, setConnected] = useState(false);
    const [connecting, setConnecting] = useState(false);
    const [address, setAddress] = useState<string | null>(null);
    const [balance, setBalance] = useState<string | null>(null);

    const connect = async (walletName: string) => {
        setConnecting(true);
        try {
            const browserWallet = await BrowserWallet.enable(walletName);
            setWallet(browserWallet);
            setConnected(true);

            // Get wallet address
            const addresses = await browserWallet.getUsedAddresses();
            if (addresses.length > 0) {
                setAddress(addresses[0]);
            }

            // Get balance
            const balanceValue = await browserWallet.getBalance();
            setBalance(balanceValue);

            // Store connection in localStorage
            localStorage.setItem('connectedWallet', walletName);
        } catch (error) {
            console.error('Failed to connect wallet:', error);
            throw error;
        } finally {
            setConnecting(false);
        }
    };

    const disconnect = () => {
        setWallet(null);
        setConnected(false);
        setAddress(null);
        setBalance(null);
        localStorage.removeItem('connectedWallet');
    };

    // Auto-reconnect on mount
    useEffect(() => {
        const connectedWallet = localStorage.getItem('connectedWallet');
        if (connectedWallet) {
            connect(connectedWallet).catch(() => {
                localStorage.removeItem('connectedWallet');
            });
        }
    }, []);

    return (
        <WalletContext.Provider
            value={{
                wallet,
                connected,
                connecting,
                address,
                balance,
                connect,
                disconnect,
            }}
        >
            {children}
        </WalletContext.Provider>
    );
}

export const useWalletContext = () => useContext(WalletContext);
