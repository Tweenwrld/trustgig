'use client';

import { useState, useCallback } from 'react';

export interface Transaction {
  id: string;
  status: 'pending' | 'submitted' | 'confirmed' | 'failed';
  txHash?: string;
  error?: string;
}

export function useTransaction() {
  const [transactions, setTransactions] = useState<Map<string, Transaction>>(new Map());

  const submitTransaction = useCallback(async (
    txBuilder: any,
    walletApi: any
  ): Promise<string | null> => {
    const txId = Date.now().toString();
    
    setTransactions((prev) => new Map(prev).set(txId, {
      id: txId,
      status: 'pending',
    }));

    try {
      // Build unsigned transaction
      const unsignedTx = await txBuilder.complete();
      
      setTransactions((prev) => new Map(prev).set(txId, {
        id: txId,
        status: 'submitted',
      }));

      // Sign with wallet
      const signedTx = await walletApi.signTx(unsignedTx);

      // Submit transaction
      const txHash = await walletApi.submitTx(signedTx);

      setTransactions((prev) => new Map(prev).set(txId, {
        id: txId,
        status: 'confirmed',
        txHash,
      }));

      return txHash;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Transaction failed';
      
      setTransactions((prev) => new Map(prev).set(txId, {
        id: txId,
        status: 'failed',
        error: errorMessage,
      }));

      return null;
    }
  }, []);

  const getTransaction = useCallback((txId: string): Transaction | undefined => {
    return transactions.get(txId);
  }, [transactions]);

  return {
    transactions: Array.from(transactions.values()),
    submitTransaction,
    getTransaction,
  };
}
