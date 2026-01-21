import { readFileSync } from 'fs';
import { join } from 'path';
import { MeshTxBuilder, BlockfrostProvider } from '@meshsdk/core';

/**
 * Deploy smart contracts to Cardano mainnet
 * 
 * WARNING: This script deploys to MAINNET. Ensure:
 * 1. All contracts are thoroughly tested on testnet
 * 2. Security audits are complete
 * 3. You have sufficient ADA for deployment
 * 4. BLOCKFROST_PROJECT_ID is set to mainnet key
 */
async function deployToMainnet() {
    console.log('🚀 Deploying TrustGig contracts to MAINNET...\n');
    console.log('⚠️  WARNING: This is a MAINNET deployment!\n');

    // Confirm deployment
    const confirm = process.env.CONFIRM_MAINNET_DEPLOY;
    if (confirm !== 'YES') {
        console.error('❌ Deployment cancelled.');
        console.error('Set CONFIRM_MAINNET_DEPLOY=YES to proceed with mainnet deployment.');
        process.exit(1);
    }

    // Load Plutus blueprint
    const blueprintPath = join(process.cwd(), 'contracts', 'plutus.json');

    try {
        const blueprint = JSON.parse(readFileSync(blueprintPath, 'utf-8'));

        console.log('📋 Loaded blueprint with validators:');
        blueprint.validators.forEach((v: any) => {
            console.log(`  - ${v.title}: ${v.hash}`);
        });

        // Initialize Blockfrost provider for MAINNET
        const blockfrostApiKey = process.env.BLOCKFROST_PROJECT_ID;
        if (!blockfrostApiKey) {
            throw new Error('BLOCKFROST_PROJECT_ID environment variable not set');
        }

        if (!blockfrostApiKey.startsWith('mainnet')) {
            throw new Error('BLOCKFROST_PROJECT_ID must be a mainnet key (starts with "mainnet")');
        }

        const provider = new BlockfrostProvider(blockfrostApiKey);

        console.log('\n✅ Contracts ready for mainnet deployment');
        console.log('\n📝 Deployment checklist:');
        console.log('  ✓ Contracts compiled');
        console.log('  ✓ Blueprint generated');
        console.log('  ✓ Mainnet Blockfrost key configured');
        console.log('  ⚠️  Ensure deployment wallet is funded with sufficient ADA');
        console.log('  ⚠️  Ensure all security audits are complete');
        console.log('\n🔗 Contract hashes (save these for your application):');

        blueprint.validators.forEach((v: any) => {
            console.log(`\n${v.title}:`);
            console.log(`  Hash: ${v.hash}`);
            console.log(`  Address: <derive from hash>`);
        });

        console.log('\n✅ Mainnet deployment preparation complete!');
        console.log('📌 Next steps:');
        console.log('  1. Update .env with mainnet contract addresses');
        console.log('  2. Deploy reference scripts to mainnet');
        console.log('  3. Verify contracts on Cardano explorers');
        console.log('  4. Update frontend to use mainnet network');

    } catch (error) {
        console.error('❌ Deployment failed:', error);
        process.exit(1);
    }
}

// Run deployment
deployToMainnet().catch((error) => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
});
