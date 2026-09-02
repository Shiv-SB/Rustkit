pub fn cardinality(bits: &[u64]) -> u64 {
    bits.iter().map(|w| w.count_ones() as u64).sum()
}
