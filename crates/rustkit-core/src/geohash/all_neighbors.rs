use crate::geohash::neighbor::neighbor;

// Writes 8 neighbor hashes, each same length as input, into out buffer
pub fn all_neighbors(hash: &[u8], out: &mut [u8]) {
    assert_eq!(out.len(), hash.len() * 8);

    let len = hash.len();
    for direction in 0..8i32 {
        let start = direction as usize * len;
        neighbor(hash, direction, &mut out[start..start + len]);
    }
}
