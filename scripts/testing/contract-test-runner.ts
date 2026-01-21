#!/usr/bin/env tsx

/**
 * Contract testing runner
 * Runs Aiken contract tests and validates outputs
 */

import { execSync } from 'child_process';
import path from 'path';

const CONTRACTS_DIR = path.join(process.cwd(), 'contracts');

async function main() {
  console.log('🧪 Running Aiken contract tests...\n');

  try {
    // Run Aiken tests
    execSync('aiken check', {
      cwd: CONTRACTS_DIR,
      stdio: 'inherit',
    });

    console.log('\n✅ All contract tests passed!');
  } catch (error) {
    console.error('\n❌ Contract tests failed!');
    process.exit(1);
  }
}

main();
