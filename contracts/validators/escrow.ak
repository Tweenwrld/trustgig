use aiken/collection/list
use aiken/interval.{Finite}
use cardano/address.{Address, VerificationKey}
use cardano/script_context.{ScriptContext}
use cardano/transaction.{Output, Transaction}
use types.{
  Active, Cancelled, Completed, CompleteMilestone, Dispute, EscrowDatum,
  EscrowRedeemer, InProgress, Milestone, Refund, Release,
}
use utils.{after_deadline, before_deadline, get_ada_amount, has_signed}

/// Escrow validator for job payments
/// Implements deposit lock → release/refund logic with milestone support
validator escrow {
  spend(datum_opt: Option<EscrowDatum>, redeemer: EscrowRedeemer, _output_reference, ctx: ScriptContext) {
    expect Some(datum) = datum_opt
    let ScriptContext { transaction, redeemer: _script_redeemer, info: _info } = ctx
    let signatories = transaction.extra_signatories

    when redeemer is {
      // Release funds to worker upon job completion
      Release -> {
        // Must be signed by client
        let client_signed = has_signed(signatories, datum.client)

        // Job must be completed or in progress
        let valid_status =
          datum.status == Completed || datum.status == InProgress

        // All milestones must be completed and approved
        let all_milestones_done =
          list.all(
            datum.milestones,
            fn(m: Milestone) { m.completed && m.approved },
          )

        // Find worker output
        let worker_gets_paid =
          list.any(
            transaction.outputs,
            fn(output) {
              let address_matches =
                output.address.payment_credential == VerificationKey(
                  datum.worker,
                )
              let amount_correct = get_ada_amount(output.value) >= datum.amount
              address_matches && amount_correct
            },
          )

        client_signed && valid_status && all_milestones_done && worker_gets_paid
      }

      // Refund to client if job cancelled or deadline passed
      Refund -> {
        let client_signed = has_signed(signatories, datum.client)
        let worker_signed = has_signed(signatories, datum.worker)
        
        expect Finite(current_time) = transaction.validity_range.upper_bound.bound_type

        let valid_refund =
          when datum.status is {
            Cancelled -> client_signed || worker_signed
            Active -> after_deadline(current_time, datum.deadline) && client_signed
            _ -> False
          }

        // Client must receive refund
        let client_gets_refund =
          list.any(
            transaction.outputs,
            fn(output) {
              let address_matches =
                output.address.payment_credential == VerificationKey(
                  datum.client,
                )
              let amount_correct = get_ada_amount(output.value) >= datum.amount
              address_matches && amount_correct
            },
          )

        valid_refund && client_gets_refund
      }

      // Complete a milestone
      CompleteMilestone { milestone_index } -> {
        let worker_signed = has_signed(signatories, datum.worker)
        let client_signed = has_signed(signatories, datum.client)

        // Milestone must exist
        expect Some(milestone) = list.at(datum.milestones, milestone_index)

        // Worker marks as completed, client approves
        let valid_completion =
          if !milestone.completed {
            // Worker completing milestone
            worker_signed
          } else {
            // Client approving milestone
            client_signed && milestone.completed
          }

        valid_completion
      }

      // Initiate dispute
      Dispute -> {
        let client_signed = has_signed(signatories, datum.client)
        let worker_signed = has_signed(signatories, datum.worker)
        
        expect Finite(current_time_d) = transaction.validity_range.upper_bound.bound_type

        // Either party can initiate dispute
        let valid_dispute = client_signed || worker_signed

        // Must be before deadline
        let within_deadline =
          before_deadline(current_time_d, datum.deadline)

        valid_dispute && within_deadline
      }
    }
  }
}
