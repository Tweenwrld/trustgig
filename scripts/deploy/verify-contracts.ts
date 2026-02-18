import { getAllContractAddresses, getContractInfo, verifyAllScriptHashes } from '../../packages/contracts-sdk/src/config/addresses';
import { getBlueprintInfo, getScriptHash, getCompiledCode } from '../../packages/contracts-sdk/src/config/plutus-loader';
import { resolveScriptHash } from '@meshsdk/core';

async function main() {
    console.log('🔍 Verifying TrustGig Smart Contracts...\n');

    try {
        // 1. Check Blueprint
        console.log('1️⃣  Loading Blueprint...');
        const info = getBlueprintInfo();
        console.log(`   ✅ Loaded: ${info.title} v${info.version}`);
        console.log(`   📝 Description: ${info.description}`);
        console.log(`   🔧 Compiler: ${info.compiler.name} ${info.compiler.version}`);
        console.log(`   ⚡ Plutus Version: ${info.plutusVersion}\n`);

        // 2. Check Addresses
        console.log('2️⃣  Generating Script Addresses (Preprod)...');
        const addresses = getAllContractAddresses('preprod');

        console.log('   --------------------------------------------------------------------------------');
        console.log(`   Escrow:      ${addresses.escrow}`);
        console.log(`   Dispute:     ${addresses.dispute}`);
        console.log(`   Reputation:  ${addresses.reputation}`);
        console.log(`   Multisig:    ${addresses.multisig}`);
        console.log(`   Credentials: ${addresses.credentials}`);
        console.log('   --------------------------------------------------------------------------------\n');

        // 3. Verify Hashes
        console.log('3️⃣  Verifying Script Hashes...');
        const results = verifyAllScriptHashes();
        let allValid = true;

        for (const [name, valid] of Object.entries(results)) {
            if (valid) {
                console.log(`   ✅ ${name}: Verified`);
            } else {
                console.log(`   ❌ ${name}: Hash Mismatch!`);
                allValid = false;
            }
        }

        if (allValid) {
            console.log('\n✨ All contracts verified and ready for deployment!');
        } else {
            console.error('\n⚠️  Some contracts failed verification. Please rebuild.');
            process.exit(1);
        }

    } catch (error) {
        console.error('\n❌ Error verifying contracts:', error);
        process.exit(1);
    }
}

main();
