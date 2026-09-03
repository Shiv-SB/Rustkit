use std::collections::HashMap;

use super::tokens::tokenize;

/// BLEU score of `hypothesis` against `reference` using n-grams up to
/// `max_n`, with whitespace tokenization and the brevity penalty.
/// `max_n` must be at least 1; the TS wrapper validates this.
pub fn bleu(reference: &[u8], hypothesis: &[u8], max_n: usize) -> f32 {
    let ref_tokens = tokenize(reference);
    let hyp_tokens = tokenize(hypothesis);
    if ref_tokens.is_empty() || hyp_tokens.is_empty() {
        return 0.0;
    }

    let max_n = max_n.max(1);
    let mut log_precision_sum = 0.0f32;
    let mut n_with_precision = 0usize;

    for n in 1..=max_n {
        if hyp_tokens.len() < n || ref_tokens.len() < n {
            break;
        }

        let hyp_ngrams = ngrams(&hyp_tokens, n);
        let hyp_counts = count_ngrams(&hyp_ngrams);
        let ref_counts = count_ngrams(&ngrams(&ref_tokens, n));

        let clipped: u32 = hyp_counts
            .iter()
            .map(|(g, &c)| c.min(*ref_counts.get(g).unwrap_or(&0)))
            .sum();
        let precision = clipped as f32 / hyp_ngrams.len() as f32;

        if precision == 0.0 {
            return 0.0;
        }
        log_precision_sum += precision.ln();
        n_with_precision += 1;
    }

    if n_with_precision == 0 {
        return 0.0;
    }

    let brevity_penalty = if hyp_tokens.len() > ref_tokens.len() {
        1.0
    } else {
        (1.0 - ref_tokens.len() as f32 / hyp_tokens.len() as f32).exp()
    };

    brevity_penalty * (log_precision_sum / n_with_precision as f32).exp()
}

fn ngrams<'a>(tokens: &[&'a [u8]], n: usize) -> Vec<Vec<&'a [u8]>> {
    (0..=tokens.len() - n)
        .map(|i| tokens[i..i + n].to_vec())
        .collect()
}

fn count_ngrams<'a>(ngrams: &[Vec<&'a [u8]>]) -> HashMap<Vec<&'a [u8]>, u32> {
    let mut counts: HashMap<Vec<&'a [u8]>, u32> = HashMap::new();
    for g in ngrams {
        *counts.entry(g.clone()).or_insert(0) += 1;
    }
    counts
}