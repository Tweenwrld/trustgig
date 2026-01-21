use aiken/collection/list
use aiken/interval.{Finite}
use cardano/address.{Address, Script}
use cardano/script_context.{ScriptContext}
use cardano/transaction.{InlineDatum, Transaction}
use types.{CredentialDatum, CredentialRedeemer, Revoke, Verify}
use utils.{after_deadline, has_signed}

/// Credential validator for artisan certifications and identity
/// Manages verification and revocation of credentials
validator credentials {
  spend(
    datum_opt: Option<CredentialDatum>,
    redeemer: CredentialRedeemer,
    _output_reference,
    ctx: ScriptContext,
  ) {
    expect Some(datum) = datum_opt
    let ScriptContext { transaction, redeemer: _script_redeemer, info: _info } = ctx

    let signatories = transaction.extra_signatories

    when redeemer is {
      // Verify a credential
      Verify -> {
        // Must be signed by issuer or holder
        let issuer_signed = has_signed(signatories, datum.issuer)
        let holder_signed = has_signed(signatories, datum.holder)

        let valid_signer = issuer_signed || holder_signed
        
        expect Finite(current_time) = transaction.validity_range.upper_bound.bound_type

        // Check if credential is not expired
        let not_expired =
          when datum.expires_at is {
            None -> True
            Some(expiry) ->
              !after_deadline(current_time, expiry)
          }

        // Credential must not already be verified (prevent double verification)
        let can_verify = !datum.verified

        // Output must update verification status
        let verification_recorded =
          list.any(
            transaction.outputs,
            fn(output) {
              when output.address.payment_credential is {
                Script(_) -> {
                  expect InlineDatum(output_datum) = output.datum
                  expect updated_datum: CredentialDatum = output_datum

                  let holder_matches = updated_datum.holder == datum.holder
                  let now_verified = updated_datum.verified == True
                  let credential_type_matches =
                    updated_datum.credential_type == datum.credential_type

                  holder_matches && now_verified && credential_type_matches
                }
                _ -> False
              }
            },
          )

        valid_signer && not_expired && can_verify && verification_recorded
      }

      // Revoke a credential
      Revoke -> {
        // Only issuer can revoke
        let issuer_signed = has_signed(signatories, datum.issuer)

        // Credential must be currently verified
        let is_verified = datum.verified

        // Output must update revocation status
        let revocation_recorded =
          list.any(
            transaction.outputs,
            fn(output) {
              when output.address.payment_credential is {
                Script(_) -> {
                  expect InlineDatum(output_datum) = output.datum
                  expect updated_datum: CredentialDatum = output_datum

                  let holder_matches = updated_datum.holder == datum.holder
                  let now_revoked = updated_datum.verified == False
                  let credential_type_matches =
                    updated_datum.credential_type == datum.credential_type

                  holder_matches && now_revoked && credential_type_matches
                }
                _ -> False
              }
            },
          )

        issuer_signed && is_verified && revocation_recorded
      }
    }
  }
}
