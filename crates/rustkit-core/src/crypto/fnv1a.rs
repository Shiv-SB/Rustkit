const OFFSET_BASIS: u64 = 0xCBF2_9CE4_8422_2325;
const PRIME: u64 = 0x0000_0100_0000_01B3;

pub fn fnv1a(data: &[u8]) -> u64 {
    let mut hash = OFFSET_BASIS;
    for &b in data {
        hash ^= b as u64;
        hash = hash.wrapping_mul(PRIME);
    }
    hash
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn matches_known_vectors() {
        assert_eq!(fnv1a(b""), OFFSET_BASIS);
        assert_eq!(fnv1a(b"a"), 0xAF63_DC4C_8601_EC8C);
        assert_eq!(fnv1a(b"hello"), 0xA430_D846_80AA_BD0B);
    }
}
