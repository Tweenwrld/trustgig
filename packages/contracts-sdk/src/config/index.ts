/**
 * Configuration module for TrustGig Contracts SDK
 * Exports all configuration utilities for loading and using compiled contracts
 */

export {
  getValidator,
  getCompiledCode,
  getScriptHash,
  getAllValidators,
  getPlutusVersion,
  getBlueprintInfo,
  CONTRACT_TITLES,
  type ContractName,
  type NetworkId,
  type ValidatorInfo,
  type PlutusBlueprint,
} from './plutus-loader';

export {
  getScriptAddress,
  getAllContractAddresses,
  verifyScriptHash,
  verifyAllScriptHashes,
  getContractInfo,
  clearAddressCache,
} from './addresses';

export {
  createTxBuilder,
  createEscrowBuilder,
  createDisputeBuilder,
  createReputationBuilder,
  createMultisigBuilder,
  createCredentialsBuilder,
  createBuilder,
  getContractsInfo,
  type BuilderFactoryConfig,
  type ContractBuilder,
} from './builder-factory';

/**
 * Default network configuration
 */
export const DEFAULT_NETWORK: import('./plutus-loader').NetworkId = 
  (process.env.NEXT_PUBLIC_CARDANO_NETWORK as import('./plutus-loader').NetworkId) || 'preprod';

/**
 * Initialize and verify all contracts
 * Call this once at application startup to ensure all contracts are valid
 */
export async function initializeContracts() {
  const { verifyAllScriptHashes, getAllContractAddresses, getBlueprintInfo } = await import('./addresses').then(
    (mod) => ({ verifyAllScriptHashes: mod.verifyAllScriptHashes, getAllContractAddresses: mod.getAllContractAddresses, getBlueprintInfo: require('./plutus-loader').getBlueprintInfo })
  );

  const blueprintInfo = getBlueprintInfo();
  const hashVerification = verifyAllScriptHashes();
  const addresses = getAllContractAddresses(DEFAULT_NETWORK);

  const allValid = Object.values(hashVerification).every(Boolean);

  return {
    valid: allValid,
    blueprintInfo,
    hashVerification,
    addresses,
    network: DEFAULT_NETWORK,
  };
}
