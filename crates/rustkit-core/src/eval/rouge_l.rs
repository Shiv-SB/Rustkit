/// ROUGE-L F-measure between `hypothesis` and `reference` based on the
/// longest common subsequence of whitespace-tokenized tokens:
/// `F = 2 * P * R / (P + R)` with `P = LCS / |hypothesis|` and
/// `R = LCS / |reference|`.
///
/// TODO(eval): implement. Stub currently returns `0.0`.
pub fn rouge_l(_reference: &[u8], _hypothesis: &[u8]) -> f32 {
    0.0
}