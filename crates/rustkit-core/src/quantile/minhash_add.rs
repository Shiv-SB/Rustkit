use crate::crypto::murmur3;

#[inline]
fn slot_seed(slot: usize) -> u32 {
    let mut x = (slot as u64).wrapping_add(0x9E37_79B9_7F4A_7C15);
    x = (x ^ (x >> 30)).wrapping_mul(0xBF58_476D_1CE4_E5B9);
    x = (x ^ (x >> 27)).wrapping_mul(0x94D0_49BB_1331_11EB);
    (x ^ (x >> 31)) as u32
}

pub fn minhash_add(signature: &mut [u32], item: &[u8]) {
    assert!(!signature.is_empty());

    for (i, slot) in signature.iter_mut().enumerate() {
        let h = murmur3(item, slot_seed(i));
        *slot = (*slot).min(h);
    }
}
