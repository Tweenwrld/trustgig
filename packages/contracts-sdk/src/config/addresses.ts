/**
 * Address Derivation Utilities
 * Generates script addresses for different Cardano networks
 */

import { 
  serializePlutusScript,
  resolveScriptHash,
} from '@meshsdk/core';
import { getCompiledCode, getScriptHash, type ContractName, type NetworkId } from './plutus-loader';

/**
 * Network parameters for address generation
 */
const NETWORK_IDS: Record<NetworkId, number> = {
  mainnet: 1,
  preprod: 0,
  preview: 0,
};

/**
 * Bech32 prefixes for script addresses
 */
const SCRIPT_ADDRESS_PREFIXES: Record<NetworkId, string> = {
  mainnet: 'addr',
  preprod: 'addr_test',
  preview: 'addr_test',
};

/**
 * Script address cache to avoid recomputation
 */
const addressCache: Map<string, string> = new Map();

/**
 * Generate a script address from compiled code for a specific network
 */
export function getScriptAddress(
  contractName: ContractName,
  network: NetworkId = 'preprod'
): string {
  const cacheKey = `${contractName}-${network}`;
  
  if (addressCache.has(cacheKey)) {
    return addressCache.get(cacheKey)!;
  }

  const compiledCode = getCompiledCode(contractName);
  
  // Serialize the Plutus script with network info
  const scriptAddress = serializePlutusScript(
    { code: compiledCode, version: 'V3' },
    undefined, // No staking credential
    NETWORK_IDS[network]
  ).address;

  addressCache.set(cacheKey, scriptAddress);
  return scriptAddress;
}

/**
 * Get all contract addresses for a specific network
 */
export function getAllContractAddresses(network: NetworkId = 'preprod'): Record<ContractName, string> {
  return {
    escrow: getScriptAddress('escrow', network),
    dispute: getScriptAddress('dispute', network),
    reputation: getScriptAddress('reputation', network),
    multisig: getScriptAddress('multisig', network),
    credentials: getScriptAddress('credentials', network),
  };
}

/**
 * Verify a script hash matches the expected hash from plutus.json
 */
export function verifyScriptHash(contractName: ContractName): boolean {
  const expectedHash = getScriptHash(contractName);
  const compiledCode = getCompiledCode(contractName);
  
  const computedHash = resolveScriptHash(compiledCode, 'V3');
  
  return expectedHash === computedHash;
}

/**
 * Verify all contract hashes
 */
export function verifyAllScriptHashes(): Record<ContractName, boolean> {
  return {
    escrow: verifyScriptHash('escrow'),
    dispute: verifyScriptHash('dispute'),
    reputation: verifyScriptHash('reputation'),
    multisig: verifyScriptHash('multisig'),
    credentials: verifyScriptHash('credentials'),
  };
}

/**
 * Get contract info summary for a network
 */
export function getContractInfo(contractName: ContractName, network: NetworkId = 'preprod') {
  return {
    name: contractName,
    network,
    address: getScriptAddress(contractName, network),
    scriptHash: getScriptHash(contractName),
    plutusVersion: 'V3',
  };
}

/**
 * Clear the address cache (useful for testing)
 */
export function clearAddressCache(): void {
  addressCache.clear();
}
