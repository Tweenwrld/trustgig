use aiken/collection/list
use aiken/crypto.{Blake2b_224, Hash, VerificationKey}
use cardano/transaction.{Output}
use cardano/address.{Address}
use cardano/assets

/// Check if a public key hash is in the list of signatories
pub fn has_signed(
  signatories: List<Hash<Blake2b_224, VerificationKey>>,
  pkh: Hash<Blake2b_224, VerificationKey>,
) -> Bool {
  list.has(signatories, pkh)
}

/// Count how many required signatures are present
pub fn count_signatures(
  required: List<Hash<Blake2b_224, VerificationKey>>,
  provided: List<Hash<Blake2b_224, VerificationKey>>,
) -> Int {
  list.foldl(
    required,
    0,
    fn(pkh, acc) {
      if has_signed(provided, pkh) {
        acc + 1
      } else {
        acc
      }
    },
  )
}

/// Verify minimum signatures threshold
pub fn verify_threshold(
  required: List<Hash<Blake2b_224, VerificationKey>>,
  provided: List<Hash<Blake2b_224, VerificationKey>>,
  threshold: Int,
) -> Bool {
  count_signatures(required, provided) >= threshold
}

/// Get ADA amount from a value
pub fn get_ada_amount(val: assets.Value) -> Int {
  assets.lovelace_of(val)
}

/// Check if output contains minimum ADA
pub fn has_minimum_ada(output: Output, minimum: Int) -> Bool {
  get_ada_amount(output.value) >= minimum
}

/// Validate deadline has not passed
pub fn before_deadline(current_time: Int, deadline: Int) -> Bool {
  current_time <= deadline
}

/// Validate deadline has passed
pub fn after_deadline(current_time: Int, deadline: Int) -> Bool {
  current_time > deadline
}

/// Find output by address
pub fn find_output_by_address(
  outputs: List<Output>,
  address: Address,
) -> Option<Output> {
  list.find(outputs, fn(output) { output.address == address })
}

/// Calculate percentage of amount
pub fn percentage(amount: Int, percent: Int) -> Int {
  amount * percent / 100
}

/// Validate percentage is between 0 and 100
pub fn valid_percentage(percent: Int) -> Bool {
  percent >= 0 && percent <= 100
}
