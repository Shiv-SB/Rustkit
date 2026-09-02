pub fn clear_bit(bits: &mut [u64], index: usize) {
    assert!(index < bits.len() * 64);
    bits[index / 64] &= !(1 << (index % 64));
}
