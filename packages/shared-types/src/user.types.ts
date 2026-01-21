/**
 * User role enumeration
 */
export enum UserRole {
    CLIENT = 'client',
    WORKER = 'worker',
    BOTH = 'both',
}

/**
 * User verification status
 */
export enum VerificationStatus {
    UNVERIFIED = 'unverified',
    PENDING = 'pending',
    VERIFIED = 'verified',
    REJECTED = 'rejected',
}

/**
 * User profile
 */
export interface User {
    id: string;

    // Wallet
    walletAddress: string;
    stakingAddress?: string;

    // Profile
    name: string;
    email?: string;
    phone?: string;
    avatar?: string;
    bio?: string;

    // Role
    role: UserRole;

    // Worker-specific
    skills?: string[];
    hourlyRate?: number; // In ADA
    availability?: boolean;

    // Verification
    verificationStatus: VerificationStatus;
    verifiedAt?: Date;

    // Reputation (from blockchain)
    reputationScore?: number;
    completedJobs?: number;
    totalEarned?: number; // In ADA

    // Metadata
    createdAt: Date;
    updatedAt: Date;
    lastActiveAt?: Date;
}

/**
 * User credential
 */
export interface UserCredential {
    id: string;
    userId: string;
    type: string; // e.g., 'plumbing_license', 'id_verification'
    issuer: string;
    issuedAt: Date;
    expiresAt?: Date;
    verified: boolean;
    verifiedAt?: Date;
    credentialHash?: string; // IPFS hash or blockchain reference
}

/**
 * User registration input
 */
export interface RegisterUserInput {
    walletAddress: string;
    name: string;
    email?: string;
    phone?: string;
    role: UserRole;
    skills?: string[];
    hourlyRate?: number;
    bio?: string;
}

/**
 * User profile update input
 */
export interface UpdateUserInput {
    name?: string;
    email?: string;
    phone?: string;
    avatar?: string;
    bio?: string;
    skills?: string[];
    hourlyRate?: number;
    availability?: boolean;
}
