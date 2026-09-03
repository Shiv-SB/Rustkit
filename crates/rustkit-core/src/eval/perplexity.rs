use crate::simd;

/// Perplexity of a sequence of log-probabilities:
/// `exp(-sum(log_prob) / len)`. A uniform 2-way distribution therefore
/// scores `2`, a perfectly confident model scores `1`.
pub fn perplexity_f32(log_probs: &[f32]) -> f32 {
    if log_probs.is_empty() {
        return 0.0;
    }

    let mean = simd::sum_f32(log_probs) / log_probs.len() as f32;
    (-mean).exp()
}