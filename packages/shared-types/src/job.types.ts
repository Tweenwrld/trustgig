/**
 * Job category enumeration
 */
export enum JobCategory {
    CONSTRUCTION = 'construction',
    PLUMBING = 'plumbing',
    ELECTRICAL = 'electrical',
    CARPENTRY = 'carpentry',
    PAINTING = 'painting',
    CLEANING = 'cleaning',
    LANDSCAPING = 'landscaping',
    MOVING = 'moving',
    DELIVERY = 'delivery',
    OTHER = 'other',
}

/**
 * Job status (mirrors blockchain status)
 */
export enum JobStatus {
    DRAFT = 'draft',
    ACTIVE = 'active',
    IN_PROGRESS = 'in_progress',
    DISPUTED = 'disputed',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
}

/**
 * Job milestone
 */
export interface JobMilestone {
    id: string;
    description: string;
    amount: number; // In ADA
    completed: boolean;
    approved: boolean;
    completedAt?: Date;
    approvedAt?: Date;
}

/**
 * Job location
 */
export interface JobLocation {
    address: string;
    city: string;
    region: string;
    country: string;
    coordinates?: {
        lat: number;
        lng: number;
    };
}

/**
 * Job entity
 */
export interface Job {
    id: string;
    title: string;
    description: string;
    category: JobCategory;
    status: JobStatus;

    // Parties
    clientId: string;
    workerId?: string;

    // Financial
    budget: number; // In ADA
    milestones: JobMilestone[];

    // Location & timing
    location: JobLocation;
    deadline: Date;
    estimatedDuration?: number; // In hours

    // Blockchain
    escrowTxHash?: string;
    escrowUtxo?: string;

    // Metadata
    createdAt: Date;
    updatedAt: Date;
    startedAt?: Date;
    completedAt?: Date;
}

/**
 * Job creation input
 */
export interface CreateJobInput {
    title: string;
    description: string;
    category: JobCategory;
    budget: number;
    milestones: Omit<JobMilestone, 'id' | 'completed' | 'approved'>[];
    location: JobLocation;
    deadline: Date;
    estimatedDuration?: number;
}

/**
 * Job update input
 */
export interface UpdateJobInput {
    title?: string;
    description?: string;
    category?: JobCategory;
    budget?: number;
    location?: JobLocation;
    deadline?: Date;
    estimatedDuration?: number;
}

/**
 * Job filter options
 */
export interface JobFilterOptions {
    category?: JobCategory;
    status?: JobStatus;
    clientId?: string;
    workerId?: string;
    minBudget?: number;
    maxBudget?: number;
    city?: string;
    region?: string;
    country?: string;
}
