use std::collections::HashMap;

/// SQuAD-style token F1 between two token-id sequences:
/// `F1 = 2 * precision * recall / (precision + recall)` where precision and
/// recall are computed from the count of shared tokens (counting duplicates).
pub fn token_f1_i32(reference: &[i32], hypothesis: &[i32]) -> f32 {
    if reference.is_empty() || hypothesis.is_empty() {
        return 0.0;
    }

    let mut ref_counts: HashMap<i32, u32> = HashMap::new();
    for &t in reference {
        *ref_counts.entry(t).or_insert(0) += 1;
    }
    let mut hyp_counts: HashMap<i32, u32> = HashMap::new();
    for &t in hypothesis {
        *hyp_counts.entry(t).or_insert(0) += 1;
    }

    let common: u32 = ref_counts
        .iter()
        .map(|(t, &c)| c.min(*hyp_counts.get(t).unwrap_or(&0)))
        .sum();
    if common == 0 {
        return 0.0;
    }

    let precision = common as f32 / hypothesis.len() as f32;
    let recall = common as f32 / reference.len() as f32;
    2.0 * precision * recall / (precision + recall)
}