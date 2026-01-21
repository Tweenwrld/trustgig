use aiken/crypto.{Blake2b_224, Hash, VerificationKey}

/// Represents a job milestone
pub type Milestone {
  description: ByteArray,
  amount: Int,
  completed: Bool,
  approved: Bool,
}

/// Job status enumeration
pub type JobStatus {
  Active
  InProgress
  Disputed
  Completed
  Cancelled
}

/// Escrow datum structure
pub type EscrowDatum {
  client: Hash<Blake2b_224, VerificationKey>,
  worker: Hash<Blake2b_224, VerificationKey>,
  amount: Int,
  job_id: ByteArray,
  milestones: List<Milestone>,
  status: JobStatus,
  deadline: Int,
}

/// Escrow redeemer actions
pub type EscrowRedeemer {
  Release
  Refund
  CompleteMilestone { milestone_index: Int }
  Dispute
}

/// Reputation datum
pub type ReputationDatum {
  worker: Hash<Blake2b_224, VerificationKey>,
  score: Int,
  completed_jobs: Int,
  total_earned: Int,
  last_updated: Int,
}

/// Reputation redeemer
pub type ReputationRedeemer {
  UpdateScore { job_id: ByteArray, new_score: Int }
}

/// Multisig datum
pub type MultisigDatum {
  required_signatures: Int,
  signatories: List<Hash<Blake2b_224, VerificationKey>>,
  proposal_id: ByteArray,
}

/// Multisig redeemer
pub type MultisigRedeemer {
  Approve
  Execute
}

/// Dispute datum
pub type DisputeDatum {
  job_id: ByteArray,
  client: Hash<Blake2b_224, VerificationKey>,
  worker: Hash<Blake2b_224, VerificationKey>,
  mediator: Hash<Blake2b_224, VerificationKey>,
  evidence_hash: ByteArray,
  resolution: Option<DisputeResolution>,
}

/// Dispute resolution
pub type DisputeResolution {
  FavorClient { refund_percentage: Int }
  FavorWorker { payment_percentage: Int }
}

/// Dispute redeemer
pub type DisputeRedeemer {
  SubmitEvidence { evidence_hash: ByteArray }
  Resolve { resolution: DisputeResolution }
}

/// Credential datum
pub type CredentialDatum {
  holder: Hash<Blake2b_224, VerificationKey>,
  credential_type: ByteArray,
  issuer: Hash<Blake2b_224, VerificationKey>,
  issued_at: Int,
  expires_at: Option<Int>,
  verified: Bool,
}

/// Credential redeemer
pub type CredentialRedeemer {
  Verify
  Revoke
}
