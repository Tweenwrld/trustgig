/**
 * Builder Factory
 * Creates pre-configured contract builders with loaded CBOR and addresses
 */

import { MeshTxBuilder, BlockfrostProvider } from '@meshsdk/core';
import { getCompiledCode, type NetworkId } from './plutus-loader';
import { getScriptAddress } from './addresses';
import { EscrowBuilder } from '../escrow/builder';
import { DisputeBuilder } from '../dispute/builder';
import { ReputationBuilder } from '../reputation/builder';
import { MultisigBuilder } from '../multisig/builder';
import { CredentialsBuilder } from '../credentials/builder';

export interface BuilderFactoryConfig {
  network?: NetworkId;
  blockfrostApiKey?: string;
}

/**
 * Create a configured MeshTxBuilder with Blockfrost provider
 */
export function createTxBuilder(config: BuilderFactoryConfig = {}): MeshTxBuilder {
  const apiKey = config.blockfrostApiKey || process.env.NEXT_PUBLIC_BLOCKFROST_PROJECT_ID;
  
  if (!apiKey) {
    throw new Error('Blockfrost API key not configured. Set NEXT_PUBLIC_BLOCKFROST_PROJECT_ID or pass blockfrostApiKey in config.');
  }

  const fetcher = new BlockfrostProvider(apiKey);
  return new MeshTxBuilder({
    fetcher,
    evaluator: fetcher,
  });
}

/**
 * Create an EscrowBuilder with loaded contract data
 */
export function createEscrowBuilder(
  txBuilder?: MeshTxBuilder,
  config: BuilderFactoryConfig = {}
): EscrowBuilder {
  const network = config.network || (process.env.NEXT_PUBLIC_CARDANO_NETWORK as NetworkId) || 'preprod';
  const builder = txBuilder || createTxBuilder(config);
  
  return new EscrowBuilder(
    builder,
    getScriptAddress('escrow', network),
    getCompiledCode('escrow')
  );
}

/**
 * Create a DisputeBuilder with loaded contract data
 */
export function createDisputeBuilder(
  txBuilder?: MeshTxBuilder,
  config: BuilderFactoryConfig = {}
): DisputeBuilder {
  const network = config.network || (process.env.NEXT_PUBLIC_CARDANO_NETWORK as NetworkId) || 'preprod';
  const builder = txBuilder || createTxBuilder(config);
  
  return new DisputeBuilder(
    builder,
    getScriptAddress('dispute', network),
    getCompiledCode('dispute')
  );
}

/**
 * Create a ReputationBuilder with loaded contract data
 */
export function createReputationBuilder(
  txBuilder?: MeshTxBuilder,
  config: BuilderFactoryConfig = {}
): ReputationBuilder {
  const network = config.network || (process.env.NEXT_PUBLIC_CARDANO_NETWORK as NetworkId) || 'preprod';
  const builder = txBuilder || createTxBuilder(config);
  
  return new ReputationBuilder(
    builder,
    getScriptAddress('reputation', network),
    getCompiledCode('reputation')
  );
}

/**
 * Create a MultisigBuilder with loaded contract data
 */
export function createMultisigBuilder(
  txBuilder?: MeshTxBuilder,
  config: BuilderFactoryConfig = {}
): MultisigBuilder {
  const network = config.network || (process.env.NEXT_PUBLIC_CARDANO_NETWORK as NetworkId) || 'preprod';
  const builder = txBuilder || createTxBuilder(config);
  
  return new MultisigBuilder(
    builder,
    getScriptAddress('multisig', network),
    getCompiledCode('multisig')
  );
}

/**
 * Create a CredentialsBuilder with loaded contract data
 */
export function createCredentialsBuilder(
  txBuilder?: MeshTxBuilder,
  config: BuilderFactoryConfig = {}
): CredentialsBuilder {
  const network = config.network || (process.env.NEXT_PUBLIC_CARDANO_NETWORK as NetworkId) || 'preprod';
  const builder = txBuilder || createTxBuilder(config);
  
  return new CredentialsBuilder(
    builder,
    getScriptAddress('credentials', network),
    getCompiledCode('credentials')
  );
}

/**
 * Contract builder type union
 */
export type ContractBuilder = 
  | EscrowBuilder 
  | DisputeBuilder 
  | ReputationBuilder 
  | MultisigBuilder 
  | CredentialsBuilder;

/**
 * Create any contract builder by name
 */
export function createBuilder<T extends ContractBuilder>(
  contractType: 'escrow' | 'dispute' | 'reputation' | 'multisig' | 'credentials',
  txBuilder?: MeshTxBuilder,
  config: BuilderFactoryConfig = {}
): T {
  switch (contractType) {
    case 'escrow':
      return createEscrowBuilder(txBuilder, config) as T;
    case 'dispute':
      return createDisputeBuilder(txBuilder, config) as T;
    case 'reputation':
      return createReputationBuilder(txBuilder, config) as T;
    case 'multisig':
      return createMultisigBuilder(txBuilder, config) as T;
    case 'credentials':
      return createCredentialsBuilder(txBuilder, config) as T;
    default:
      throw new Error(`Unknown contract type: ${contractType}`);
  }
}

/**
 * Get all contract addresses and info for the current network
 */
export function getContractsInfo(config: BuilderFactoryConfig = {}) {
  const network = config.network || (process.env.NEXT_PUBLIC_CARDANO_NETWORK as NetworkId) || 'preprod';
  
  return {
    network,
    contracts: {
      escrow: {
        address: getScriptAddress('escrow', network),
        cborLength: getCompiledCode('escrow').length,
      },
      dispute: {
        address: getScriptAddress('dispute', network),
        cborLength: getCompiledCode('dispute').length,
      },
      reputation: {
        address: getScriptAddress('reputation', network),
        cborLength: getCompiledCode('reputation').length,
      },
      multisig: {
        address: getScriptAddress('multisig', network),
        cborLength: getCompiledCode('multisig').length,
      },
      credentials: {
        address: getScriptAddress('credentials', network),
        cborLength: getCompiledCode('credentials').length,
      },
    },
  };
}
