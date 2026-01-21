/**
 * Transaction type enumeration
 */
export enum TransactionType {
    ESCROW_CREATE = 'escrow_create',
    ESCROW_RELEASE = 'escrow_release',
    ESCROW_REFUND = 'escrow_refund',
    MILESTONE_COMPLETE = 'milestone_complete',
    DISPUTE_INITIATE = 'dispute_initiate',
    DISPUTE_RESOLVE = 'dispute_resolve',
    REPUTATION_UPDATE = 'reputation_update',
    CREDENTIAL_VERIFY = 'credential_verify',
}

/**
 * Transaction status
 */
export enum TransactionStatus {
    PENDING = 'pending',
    SUBMITTED = 'submitted',
    CONFIRMED = 'confirmed',
    FAILED = 'failed',
}

/**
 * Transaction entity
 */
export interface Transaction {
    id: string;

    // Transaction details
    txHash?: string;
    type: TransactionType;
    status: TransactionStatus;

    // Parties
    initiatorId: string;
    recipientId?: string;

    // Amount
    amount?: number; // In ADA

    // Related entities
    jobId?: string;
    milestoneId?: string;
    disputeId?: string;

    // Metadata
    metadata?: Record<string, any>;
    errorMessage?: string;

    // Timestamps
    createdAt: Date;
    submittedAt?: Date;
    confirmedAt?: Date;
}

/**
 * Transaction creation input
 */
export interface CreateTransactionInput {
    type: TransactionType;
    initiatorId: string;
    recipientId?: string;
    amount?: number;
    jobId?: string;
    milestoneId?: string;
    metadata?: Record<string, any>;
}

/**
 * Transaction filter options
 */
export interface TransactionFilterOptions {
    type?: TransactionType;
    status?: TransactionStatus;
    initiatorId?: string;
    recipientId?: string;
    jobId?: string;
    fromDate?: Date;
    toDate?: Date;
}
