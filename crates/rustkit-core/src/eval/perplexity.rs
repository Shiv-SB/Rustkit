/// Perplexity of a sequence of log-probabilities:
/// `exp(-sum(log_prob) / len)`. A uniform 2-way distribution therefore
/// scores `2`, a perfectly confident model scores `1`.
///
/// TODO(eval): implement. Stub currently returns `0.0`.
pub fn perplexity_f32(_log_probs: &[f32]) -> f32 {
    0.0
}