use super::tokens::tokenize;

/// ROUGE-L F-measure between `hypothesis` and `reference` based on the
/// longest common subsequence of whitespace-tokenized tokens:
/// `F = 2 * P * R / (P + R)` with `P = LCS / |hypothesis|` and
/// `R = LCS / |reference|`.
pub fn rouge_l(reference: &[u8], hypothesis: &[u8]) -> f32 {
    let ref_tokens = tokenize(reference);
    let hyp_tokens = tokenize(hypothesis);
    if ref_tokens.is_empty() || hyp_tokens.is_empty() {
        return 0.0;
    }

    let lcs = lcs_len(&ref_tokens, &hyp_tokens);

    let precision = lcs as f32 / hyp_tokens.len() as f32;
    let recall = lcs as f32 / ref_tokens.len() as f32;
    if precision + recall == 0.0 {
        return 0.0;
    }

    2.0 * precision * recall / (precision + recall)
}

/// Length of the longest common subsequence over token sequences, using the
/// classic two-row dynamic-programming scan (O(n * m) time, O(m) space).
fn lcs_len(a: &[&[u8]], b: &[&[u8]]) -> usize {
    let mut dp = vec![0usize; b.len() + 1];
    for x in a {
        let mut prev = 0usize;
        for (j, y) in b.iter().enumerate() {
            let old = dp[j + 1];
            dp[j + 1] = if x == y { prev + 1 } else { dp[j + 1].max(dp[j]) };
            prev = old;
        }
    }
    dp[b.len()]
}