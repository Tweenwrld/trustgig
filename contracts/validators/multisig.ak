use aiken/collection/list
use cardano/address.{Address, Script}
use cardano/script_context.{ScriptContext}
use cardano/transaction.{InlineDatum, Transaction}
use types.{Approve, Execute, MultisigDatum, MultisigRedeemer}
use utils.{verify_threshold}

/// Multisig validator for committee approvals
/// Requires multiple signatures for proposal execution
validator multisig {
  spend(
    datum_opt: Option<MultisigDatum>,
    redeemer: MultisigRedeemer,
    _output_reference,
    ctx: ScriptContext,
  ) {
    expect Some(datum) = datum_opt
    let ScriptContext { transaction, redeemer: _script_redeemer, info: _info } = ctx
    let signatories = transaction.extra_signatories

    when redeemer is {
      // Approve a proposal (partial signatures)
      Approve -> {
        // At least one signatory must sign
        let has_valid_signer =
          list.any(
            datum.signatories,
            fn(required_signer) {
              list.has(signatories, required_signer)
            },
          )

        // Output must preserve the datum with updated state
        let datum_preserved =
          list.any(
            transaction.outputs,
            fn(output) {
              when output.address.payment_credential is {
                Script(_) -> {
                  expect InlineDatum(output_datum) = output.datum
                  expect preserved_datum: MultisigDatum = output_datum
                  preserved_datum.proposal_id == datum.proposal_id
                }
                _ -> False
              }
            },
          )

        has_valid_signer && datum_preserved
      }

      // Execute proposal with required signatures
      Execute -> {
        // Verify threshold of signatures is met
        let threshold_met =
          verify_threshold(
            datum.signatories,
            signatories,
            datum.required_signatures,
          )

        // Validate all signatories are from the approved list
        let all_signers_valid =
          list.all(
            signatories,
            fn(signer) { list.has(datum.signatories, signer) },
          )

        threshold_met && all_signers_valid
      }
    }
  }
}
