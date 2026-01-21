import { type Data } from '@meshsdk/common';

/**
 * Job milestone structure
 */
export interface Milestone {
    description: string;
    amount: bigint;
    completed: boolean;
    approved: boolean;
}

/**
 * Job status enumeration
 */
export enum JobStatus {
    Active = 'Active',
    InProgress = 'InProgress',
    Disputed = 'Disputed',
    Completed = 'Completed',
    Cancelled = 'Cancelled',
}

/**
 * Escrow datum structure
 */
export interface EscrowDatum {
    client: string; // Public key hash
    worker: string; // Public key hash
    amount: bigint;
    jobId: string;
    milestones: Milestone[];
    status: JobStatus;
    deadline: bigint; // POSIX timestamp
}

/**
 * Escrow redeemer actions
 */
export type EscrowRedeemer =
    | { type: 'Release' }
    | { type: 'Refund' }
    | { type: 'CompleteMilestone'; milestoneIndex: number }
    | { type: 'Dispute' };

/**
 * Serialize Milestone to Plutus Data
 */
export const serializeMilestone = (milestone: Milestone): Data => {
    return {
        alternative: 0,
        fields: [
            milestone.description,
            milestone.amount,
            milestone.completed ? 1 : 0,
            milestone.approved ? 1 : 0,
        ],
    };
};

/**
 * Convert JobStatus to number for serialization
 */
const jobStatusToInt = (status: JobStatus): number => {
    switch (status) {
        case JobStatus.Active: return 0;
        case JobStatus.InProgress: return 1;
        case JobStatus.Disputed: return 2;
        case JobStatus.Completed: return 3;
        case JobStatus.Cancelled: return 4;
    }
};

/**
 * Serialize EscrowDatum to Plutus Data
 */
export const serializeEscrowDatum = (datum: EscrowDatum): Data => {
    return {
        alternative: 0,
        fields: [
            datum.client,
            datum.worker,
            datum.amount,
            datum.jobId,
            datum.milestones.map(serializeMilestone),
            jobStatusToInt(datum.status),
            datum.deadline,
        ],
    };
};

/**
 * Serialize EscrowRedeemer to Plutus Data
 */
export const serializeEscrowRedeemer = (redeemer: EscrowRedeemer): Data => {
    switch (redeemer.type) {
        case 'Release':
            return { alternative: 0, fields: [] };
        case 'Refund':
            return { alternative: 1, fields: [] };
        case 'CompleteMilestone':
            return { alternative: 2, fields: [redeemer.milestoneIndex] };
        case 'Dispute':
            return { alternative: 3, fields: [] };
    }
};

/**
 * Convert number to JobStatus
 */
const intToJobStatus = (n: number): JobStatus => {
    switch (n) {
        case 0: return JobStatus.Active;
        case 1: return JobStatus.InProgress;
        case 2: return JobStatus.Disputed;
        case 3: return JobStatus.Completed;
        case 4: return JobStatus.Cancelled;
        default: return JobStatus.Active;
    }
};

/**
 * Deserialize Plutus Data to EscrowDatum
 */
export const deserializeEscrowDatum = (plutusData: Data): EscrowDatum => {
    if (typeof plutusData === 'object' && 'fields' in plutusData && Array.isArray(plutusData.fields)) {
        return {
            client: plutusData.fields[0] as string,
            worker: plutusData.fields[1] as string,
            amount: BigInt(plutusData.fields[2] as number | bigint),
            jobId: plutusData.fields[3] as string,
            milestones: (plutusData.fields[4] as any[]).map((m: any) => ({
                description: m.fields[0] as string,
                amount: BigInt(m.fields[1] as number | bigint),
                completed: (m.fields[2] as number) === 1,
                approved: (m.fields[3] as number) === 1,
            })),
            status: intToJobStatus(plutusData.fields[5] as number),
            deadline: BigInt(plutusData.fields[6] as number | bigint),
        };
    }
    throw new Error('Invalid EscrowDatum format');
};
