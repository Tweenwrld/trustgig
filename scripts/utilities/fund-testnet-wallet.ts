#!/usr/bin/env tsx

/**
 * Fund testnet wallet with test ADA from Cardano faucet
 */

import { execSync } from 'child_process';

const TESTNET_FAUCET_API = 'https://faucet.preprod.world.dev.cardano.org';

async function fundWallet(address: string) {
  console.log('💰 Requesting testnet ADA...');
  console.log(`Address: ${address}\n`);

  try {
    const response = await fetch(`${TESTNET_FAUCET_API}/send-money/${address}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Funds sent!');
      console.log('Transaction hash:', data.txHash);
      console.log('\nNote: It may take a few minutes for funds to appear in your wallet.');
    } else {
      console.error('❌ Failed to request funds');
      console.error('Status:', response.status);
    }
  } catch (error) {
    console.error('❌ Error requesting funds:', error);
  }
}

const address = process.argv[2];

if (!address) {
  console.error('Usage: npm run utils:fund-wallet <cardano-address>');
  process.exit(1);
}

fundWallet(address);
