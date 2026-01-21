use aiken/collection/list
use cardano/address.{Address, Script}
use cardano/script_context.{ScriptContext}
use cardano/transaction.{InlineDatum, Transaction}
use types.{ReputationDatum, ReputationRedeemer, UpdateScore}
use utils.{has_signed}

/// Reputation validator for artisan scoring
/// Updates worker reputation after successful job completion
validator reputation {
  spend(
    datum_opt: Option<ReputationDatum>,
    redeemer: ReputationRedeemer,
    _output_reference,
    ctx: ScriptContext,
  ) {
    expect Some(datum) = datum_opt
    let ScriptContext { transaction, redeemer: _script_redeemer, info: _info } = ctx

    let UpdateScore { job_id: _job_id, new_score } = redeemer
    
    // Must be signed by the worker (self-update) or authorized oracle
    let worker_signed = has_signed(transaction.extra_signatories, datum.worker)

    // Validate score is within valid range (0-100)
    let valid_score = new_score >= 0 && new_score <= 100

    // Check that output contains updated reputation
    let reputation_updated =
      list.any(
        transaction.outputs,
        fn(output) {
          // Output must go back to reputation script
          when output.address.payment_credential is {
            Script(_) -> {
              // Decode output datum
              expect InlineDatum(output_datum) = output.datum
              expect updated_datum: ReputationDatum = output_datum

              // Verify updates
              let worker_matches = updated_datum.worker == datum.worker
              let jobs_incremented =
                updated_datum.completed_jobs == datum.completed_jobs + 1
              let score_updated =
                updated_datum.score == calculate_new_score(
                  datum.score,
                  datum.completed_jobs,
                  new_score,
                )
              let timestamp_updated =
                updated_datum.last_updated > datum.last_updated

              worker_matches && jobs_incremented && score_updated && timestamp_updated
            }
            _ -> False
          }
        },
      )

    worker_signed && valid_score && reputation_updated
  }
}

/// Calculate weighted average score
fn calculate_new_score(
  current_score: Int,
  completed_jobs: Int,
  new_score: Int,
) -> Int {
  if completed_jobs == 0 {
    new_score
  } else {
    // Weighted average: (current_score * completed_jobs + new_score) / (completed_jobs + 1)
    ( current_score * completed_jobs + new_score ) / ( completed_jobs + 1 )
  }
}
