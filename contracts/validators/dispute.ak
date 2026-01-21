use aiken/collection/list
use cardano/address.{Address, Script, VerificationKey}
use cardano/script_context.{ScriptContext}
use cardano/transaction.{InlineDatum, Transaction}
use types.{
  DisputeDatum, DisputeRedeemer, FavorClient, FavorWorker,
  Resolve, SubmitEvidence,
}
use utils.{has_signed, valid_percentage}

/// Dispute validator for mediator resolution
/// Handles evidence submission and mediator decisions
validator dispute {
  spend(
    datum_opt: Option<DisputeDatum>,
    redeemer: DisputeRedeemer,
    _output_reference,
    ctx: ScriptContext,
  ) {
    expect Some(datum) = datum_opt
    let ScriptContext { transaction, redeemer: _script_redeemer, info: _info } = ctx
    let signatories = transaction.extra_signatories

    when redeemer is {
      // Submit evidence to dispute
      SubmitEvidence { evidence_hash } -> {
        let client_signed = has_signed(signatories, datum.client)
        let worker_signed = has_signed(signatories, datum.worker)

        // Either party can submit evidence
        let valid_submitter = client_signed || worker_signed

        // Evidence hash must be non-empty
        let valid_evidence = evidence_hash != ""

        // Dispute must not be resolved yet
        let not_resolved =
          when datum.resolution is {
            None -> True
            Some(_) -> False
          }

        // Output must update datum with evidence
        let evidence_recorded =
          list.any(
            transaction.outputs,
            fn(output) {
              when output.address.payment_credential is {
                Script(_) -> {
                  expect InlineDatum(output_datum) = output.datum
                  expect updated_datum: DisputeDatum = output_datum
                  updated_datum.evidence_hash == evidence_hash && updated_datum.job_id == datum.job_id
                }
                _ -> False
              }
            },
          )

        valid_submitter && valid_evidence && not_resolved && evidence_recorded
      }

      // Mediator resolves dispute
      Resolve { resolution } -> {
        // Must be signed by mediator
        let mediator_signed = has_signed(signatories, datum.mediator)

        // Validate resolution percentages
        let valid_resolution =
          when resolution is {
            FavorClient { refund_percentage } -> valid_percentage(refund_percentage)
            FavorWorker { payment_percentage } ->
              valid_percentage(payment_percentage)
          }

        // Ensure funds are distributed according to resolution
        let funds_distributed =
          when resolution is {
            FavorClient { refund_percentage: _refund_percentage } -> {
              // Calculate refund amount from escrow
              list.any(
                transaction.outputs,
                fn(output) {
                  output.address.payment_credential == VerificationKey(
                    datum.client,
                  )
                },
              )
            }
            FavorWorker { payment_percentage: _payment_percentage } -> {
              // Calculate payment amount from escrow
              list.any(
                transaction.outputs,
                fn(output) {
                  output.address.payment_credential == VerificationKey(
                    datum.worker,
                  )
                },
              )
            }
          }

        mediator_signed && valid_resolution && funds_distributed
      }
    }
  }
}
