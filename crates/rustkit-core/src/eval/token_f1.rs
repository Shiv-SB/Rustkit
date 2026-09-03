/// SQuAD-style token F1 between two token-id sequences:
/// `F1 = 2 * precision * recall / (precision + recall)` where precision and
/// recall are computed from the count of shared tokens (counting duplicates).
///
/// TODO(eval): implement. Stub currently returns `0.0`.
pub fn token_f1_i32(_reference: &[i32], _hypothesis: &[i32]) -> f32 {
    0.0
}