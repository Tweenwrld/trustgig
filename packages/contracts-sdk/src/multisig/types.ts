import { type Data } from '@meshsdk/common';

/**
 * Multisig datum structure
 */
export interface MultisigDatum {
    committee: string[]; // List of committee member PKHs
    threshold: bigint; // Minimum signatures required
    proposalId: string; // Unique proposal identifier
    proposalHash: string; // Hash of the proposal data
    signatures: string[]; // List of PKHs who have signed
    executed: boolean;
}

/**
 * Multisig redeemer types
 */
export type MultisigRedeemer =
    | { type: 'Sign' }
    | { type: 'Execute' }
    | { type: 'Cancel' };

/**
 * Serialize multisig datum to Data
 */
export function serializeMultisigDatum(datum: MultisigDatum): Data {
    return {
        alternative: 0,
        fields: [
            datum.committee,
            datum.threshold,
            datum.proposalId,
            datum.proposalHash,
            datum.signatures,
            datum.executed ? 1 : 0,
        ],
    };
}

/**
 * Deserialize multisig datum from Data
 */
export function deserializeMultisigDatum(plutusData: Data): MultisigDatum {
    if (typeof plutusData === 'object' && 'fields' in plutusData && Array.isArray(plutusData.fields)) {
        return {
            committee: plutusData.fields[0] as string[],
            threshold: BigInt(plutusData.fields[1] as number | bigint),
            proposalId: plutusData.fields[2] as string,
            proposalHash: plutusData.fields[3] as string,
            signatures: plutusData.fields[4] as string[],
            executed: (plutusData.fields[5] as number) === 1,
        };
    }
    throw new Error('Invalid MultisigDatum format');
}

/**
 * Serialize multisig redeemer to Data
 */
export function serializeMultisigRedeemer(redeemer: MultisigRedeemer): Data {
    if (redeemer.type === 'Sign') {
        return { alternative: 0, fields: [] };
    } else if (redeemer.type === 'Execute') {
        return { alternative: 1, fields: [] };
    } else {
        return { alternative: 2, fields: [] };
    }
}
