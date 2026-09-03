/// BLEU score of `hypothesis` against `reference` using n-grams up to
/// `max_n`, with whitespace tokenization and the brevity penalty.
/// `max_n` must be at least 1; the TS wrapper validates this.
///
/// TODO(eval): implement. Stub currently returns `0.0`.
pub fn bleu(_reference: &[u8], _hypothesis: &[u8], _max_n: usize) -> f32 {
    0.0
}