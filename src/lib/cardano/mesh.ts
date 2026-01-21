import { MeshTxBuilder } from '@meshsdk/core';

let meshInstance: MeshTxBuilder | null = null;

/**
 * Get or create MeshTxBuilder instance
 */
export function getMeshInstance(): MeshTxBuilder {
    if (!meshInstance) {
        meshInstance = new MeshTxBuilder({
            fetcher: {
                fetchAccountInfo: async () => ({ poolId: '', active: true, balance: '0' }),
                fetchAddressUTxOs: async () => [],
                fetchAssetAddresses: async () => [],
                fetchAssetMetadata: async () => ({}),
                fetchBlockInfo: async () => ({ hash: '', epoch: 0, slot: 0, time: 0 }),
                fetchCollectionAssets: async () => [],
                fetchHandleAddress: async () => '',
                fetchProtocolParameters: async () => ({
                    minFeeA: 44,
                    minFeeB: 155381,
                    maxTxSize: 16384,
                    maxBlockHeaderSize: 1100,
                    keyDeposit: '2000000',
                    poolDeposit: '500000000',
                    priceMem: 0.0577,
                    priceStep: 0.0000721,
                    maxTxExecutionUnits: { mem: 14000000, steps: 10000000000 },
                    maxBlockExecutionUnits: { mem: 62000000, steps: 20000000000 },
                    maxValueSize: 5000,
                    collateralPercentage: 150,
                    maxCollateralInputs: 3,
                    coinsPerUTxOSize: '4310',
                }),
                fetchTxInfo: async () => ({ hash: '' }),
                fetchUTxOs: async () => [],
                submitTx: async () => '',
            },
            submitter: {
                submitTx: async () => '',
            },
            evaluator: {
                evaluateTx: async () => [],
            },
        });
    }
    return meshInstance;
}

/**
 * Network configuration
 */
export const NETWORK = {
    id: process.env.NEXT_PUBLIC_CARDANO_NETWORK === 'mainnet' ? 1 : 0,
    name: process.env.NEXT_PUBLIC_CARDANO_NETWORK || 'preprod',
};

/**
 * Blockfrost configuration
 */
export const BLOCKFROST_CONFIG = {
    projectId: process.env.NEXT_PUBLIC_BLOCKFROST_PROJECT_ID || '',
    network: NETWORK.name,
};
