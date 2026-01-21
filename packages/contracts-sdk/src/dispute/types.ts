import { type Data } from '@meshsdk/common';

/**
 * Dispute status enum
 */
export enum DisputeStatus {
    Open = 0,
    UnderReview = 1,
    Resolved = 2,
    Rejected = 3,
}

/**
 * Dispute datum structure
 */
export interface DisputeDatum {
    jobId: string;
    clientPkh: string;
    workerPkh: string;
    mediatorPkh: string;
    disputeReason: string; // IPFS hash of dispute details
    status: DisputeStatus;
    clientPercentage: bigint; // 0-100
    workerPercentage: bigint; // 0-100
    totalAmount: bigint;
    createdAt: bigint;
    resolvedAt: bigint;
}

/**
 * Dispute redeemer types
 */
export type DisputeRedeemer =
    | { type: 'Open' }
    | { type: 'Resolve'; clientPercentage: bigint; workerPercentage: bigint }
    | { type: 'Reject' };

/**
 * Serialize dispute datum to Data
 */
export function serializeDisputeDatum(datum: DisputeDatum): Data {
    return {
        alternative: 0,
        fields: [
            datum.jobId,
            datum.clientPkh,
            datum.workerPkh,
            datum.mediatorPkh,
            datum.disputeReason,
            datum.status,
            datum.clientPercentage,
            datum.workerPercentage,
            datum.totalAmount,
            datum.createdAt,
            datum.resolvedAt,
        ],
    };
}

/**
 * Deserialize dispute datum from Data
 */
export function deserializeDisputeDatum(plutusData: Data): DisputeDatum {
    if (typeof plutusData === 'object' && 'fields' in plutusData && Array.isArray(plutusData.fields)) {
        return {
            jobId: plutusData.fields[0] as string,
            clientPkh: plutusData.fields[1] as string,
            workerPkh: plutusData.fields[2] as string,
            mediatorPkh: plutusData.fields[3] as string,
            disputeReason: plutusData.fields[4] as string,
            status: plutusData.fields[5] as DisputeStatus,
            clientPercentage: BigInt(plutusData.fields[6] as number | bigint),
            workerPercentage: BigInt(plutusData.fields[7] as number | bigint),
            totalAmount: BigInt(plutusData.fields[8] as number | bigint),
            createdAt: BigInt(plutusData.fields[9] as number | bigint),
            resolvedAt: BigInt(plutusData.fields[10] as number | bigint),
        };
    }
    throw new Error('Invalid DisputeDatum format');
}

/**
 * Serialize dispute redeemer to Data
 */
export function serializeDisputeRedeemer(redeemer: DisputeRedeemer): Data {
    if (redeemer.type === 'Open') {
        return { alternative: 0, fields: [] };
    } else if (redeemer.type === 'Resolve') {
        return { alternative: 1, fields: [redeemer.clientPercentage, redeemer.workerPercentage] };
    } else {
        return { alternative: 2, fields: [] };
    }
}
