use crate::crypto::{fnv1a, murmur3};

pub fn bloom_filter_contains(bits: &[u64], num_bits: usize, item: &[u8], num_hashes: usize) -> bool {
    assert_eq!(bits.len(), num_bits.div_ceil(64));

    let h1 = fnv1a(item) as usize;
    let h2 = murmur3(item, 0x9747_B28C) as usize;

    (0..num_hashes).all(|i| {
        let bit = (h1.wrapping_add(i.wrapping_mul(h2))) % num_bits;
        bits[bit / 64] & (1 << (bit % 64)) != 0
    })
}
