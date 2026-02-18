/**
 * TypeScript declarations for TrustGig Contracts SDK
 */

// Allow importing JSON files
declare module '*.json' {
  const value: any;
  export default value;
}

// Plutus Blueprint types
declare module '../contracts/plutus.json' {
  interface Validator {
    title: string;
    compiledCode: string;
    hash: string;
    datum?: {
      title: string;
      schema: { $ref: string };
    };
    redeemer?: {
      title: string;
      schema: { $ref: string } | Record<string, never>;
    };
  }

  interface PlutusBlueprint {
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
    validators: Validator[];
    definitions: Record<string, unknown>;
  }

  const blueprint: PlutusBlueprint;
  export default blueprint;
}
