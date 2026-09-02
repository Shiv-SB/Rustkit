pub fn popcount(bits: &[u64]) -> u32 {
    bits.iter().map(|w| w.count_ones()).sum()
}
