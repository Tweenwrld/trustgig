import { type Data } from '@meshsdk/common';

/**
 * Reputation datum structure
 */
export interface ReputationDatum {
    userPkh: string;
    score: bigint;
    totalJobs: bigint;
    completedJobs: bigint;
}

/**
 * Reputation redeemer types
 */
export type ReputationRedeemer =
    | { type: 'UpdateScore'; delta: bigint }
    | { type: 'IncrementJobs' };

/**
 * Serialize reputation datum to Data
 */
export function serializeReputationDatum(datum: ReputationDatum): Data {
    return {
        alternative: 0,
        fields: [
            datum.userPkh,
            datum.score,
            datum.totalJobs,
            datum.completedJobs,
        ],
    };
}

/**
 * Deserialize reputation datum from Data
 */
export function deserializeReputationDatum(plutusData: Data): ReputationDatum {
    if (typeof plutusData === 'object' && 'fields' in plutusData && Array.isArray(plutusData.fields)) {
        return {
            userPkh: plutusData.fields[0] as string,
            score: BigInt(plutusData.fields[1] as number | bigint),
            totalJobs: BigInt(plutusData.fields[2] as number | bigint),
            completedJobs: BigInt(plutusData.fields[3] as number | bigint),
        };
    }
    throw new Error('Invalid ReputationDatum format');
}

/**
 * Serialize reputation redeemer to Data
 */
export function serializeReputationRedeemer(redeemer: ReputationRedeemer): Data {
    if (redeemer.type === 'UpdateScore') {
        return { alternative: 0, fields: [redeemer.delta] };
    } else {
        return { alternative: 1, fields: [] };
    }
}
