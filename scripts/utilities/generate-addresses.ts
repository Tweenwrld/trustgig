import { Wallet, BlockfrostProvider } from '@meshsdk/core';

/**
 * Generate Cardano addresses for testing
 */
async function generateAddresses() {
    console.log('🔑 Generating Cardano test addresses...\n');

    const mnemonic = Wallet.generateMnemonic();
    console.log('📝 Mnemonic (save this securely):');
    console.log(mnemonic);
    console.log('');

    const wallet = new Wallet({
        networkId: 0, // 0 for testnet, 1 for mainnet
        fetcher: new BlockfrostProvider(process.env.BLOCKFROST_PROJECT_ID || ''),
        submitter: new BlockfrostProvider(process.env.BLOCKFROST_PROJECT_ID || ''),
        key: {
            type: 'mnemonic',
            words: mnemonic.split(' '),
        },
    });

    const address = await wallet.getChangeAddress();
    const rewardAddress = await wallet.getRewardAddress();

    console.log('📬 Payment Address:');
    console.log(address);
    console.log('');
    console.log('🎁 Reward Address:');
    console.log(rewardAddress);
    console.log('');
    console.log('💰 Fund this address at: https://docs.cardano.org/cardano-testnet/tools/faucet');
}

generateAddresses().catch((error) => {
    console.error('❌ Failed to generate addresses:', error);
    process.exit(1);
});
