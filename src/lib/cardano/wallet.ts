import { MeshWallet } from '@meshsdk/core';

/**
 * Wallet utility functions for Cardano integration
 */

export const getConnectedWallet = async (): Promise<MeshWallet | null> => {
  if (typeof window === 'undefined') return null;

  try {
    const walletName = localStorage.getItem('connected-wallet');
    if (!walletName) return null;

    // @ts-ignore
    const walletApi = await window.cardano?.[walletName]?.enable();
    if (!walletApi) return null;

    return new MeshWallet({ walletApi });
  } catch (error) {
    console.error('Error getting connected wallet:', error);
    return null;
  }
};

export const disconnectWallet = () => {
  localStorage.removeItem('connected-wallet');
};

export const getWalletBalance = async (wallet: MeshWallet): Promise<string> => {
  try {
    const balance = await wallet.getBalance();
    return balance;
  } catch (error) {
    console.error('Error getting wallet balance:', error);
    return '0';
  }
};

export const formatLovelace = (lovelace: string | number): string => {
  const ada = Number(lovelace) / 1_000_000;
  return ada.toFixed(2);
};
