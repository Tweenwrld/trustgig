import { useWalletContext } from '@/components/cardano/WalletProvider';

export function useWallet() {
    return useWalletContext();
}
