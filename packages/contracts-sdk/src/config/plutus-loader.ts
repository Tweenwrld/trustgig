import plutusBlueprint from './plutus.json';

export type NetworkId = 'preprod' | 'preview' | 'mainnet';

export interface ValidatorInfo {
  title: string;
  compiledCode: string;
  hash: string;
}

export interface PlutusBlueprint {
  preamble: {
    title: string;
    description: string;
    version: string;
    plutusVersion: string;
    compiler: {
      name: string;
      version: string;
    };
    license: string;
  };
  validators: ValidatorInfo[];
}

/**
 * Contract names as they appear in plutus.json
 */
export const CONTRACT_TITLES = {
  escrow: 'escrow.escrow.spend',
  dispute: 'dispute.dispute.spend',
  reputation: 'reputation.reputation.spend',
  multisig: 'multisig.multisig.spend',
  credentials: 'credentials.credentials.spend',
} as const;

export type ContractName = keyof typeof CONTRACT_TITLES;

/**
 * Get the compiled validator info for a specific contract
 */
export function getValidator(contractName: ContractName): ValidatorInfo {
  const title = CONTRACT_TITLES[contractName];
  const validator = (plutusBlueprint as PlutusBlueprint).validators.find(
    (v) => v.title === title
  );

  if (!validator) {
    throw new Error(`Validator not found: ${title}`);
  }

  return {
    title: validator.title,
    compiledCode: validator.compiledCode,
    hash: validator.hash,
  };
}

/**
 * Get compiled CBOR code for a specific contract
 */
export function getCompiledCode(contractName: ContractName): string {
  return getValidator(contractName).compiledCode;
}

/**
 * Get script hash for a specific contract
 */
export function getScriptHash(contractName: ContractName): string {
  return getValidator(contractName).hash;
}

/**
 * Get all validators from the blueprint
 */
export function getAllValidators(): ValidatorInfo[] {
  return (plutusBlueprint as PlutusBlueprint).validators
    .filter((v) => v.title.endsWith('.spend'))
    .map((v) => ({
      title: v.title,
      compiledCode: v.compiledCode,
      hash: v.hash,
    }));
}

/**
 * Get the Plutus version from the blueprint
 */
export function getPlutusVersion(): string {
  return (plutusBlueprint as PlutusBlueprint).preamble.plutusVersion;
}

/**
 * Get blueprint metadata
 */
export function getBlueprintInfo() {
  const { preamble } = plutusBlueprint as PlutusBlueprint;
  return {
    title: preamble.title,
    description: preamble.description,
    version: preamble.version,
    plutusVersion: preamble.plutusVersion,
    compiler: preamble.compiler,
  };
}
