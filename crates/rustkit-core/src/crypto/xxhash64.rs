const PRIME64_1: u64 = 0x9E37_79B1_85EB_CA87;
const PRIME64_2: u64 = 0xC2B2_AE3D_27D4_EB4F;
const PRIME64_3: u64 = 0x1656_67B1_9E37_79F9;
const PRIME64_4: u64 = 0x85EB_CA77_C2B2_AE63;
const PRIME64_5: u64 = 0x27D4_EB2F_1656_67C5;

#[inline]
fn round(acc: u64, input: u64) -> u64 {
    let acc = acc.wrapping_add(input.wrapping_mul(PRIME64_2));
    let acc = acc.rotate_left(31);
    acc.wrapping_mul(PRIME64_1)
}

#[inline]
fn merge_round(acc: u64, val: u64) -> u64 {
    let merged = acc ^ round(0, val);
    merged.wrapping_mul(PRIME64_1).wrapping_add(PRIME64_4)
}

#[inline]
fn read_u64(data: &[u8], offset: usize) -> u64 {
    u64::from_le_bytes(data[offset..offset + 8].try_into().unwrap())
}

#[inline]
fn read_u32(data: &[u8], offset: usize) -> u32 {
    u32::from_le_bytes(data[offset..offset + 4].try_into().unwrap())
}

pub fn xxhash64(data: &[u8], seed: u64) -> u64 {
    let len = data.len() as u64;
    let mut i = 0usize;

    let mut h64 = if len >= 32 {
        let mut v1 = seed.wrapping_add(PRIME64_1).wrapping_add(PRIME64_2);
        let mut v2 = seed.wrapping_add(PRIME64_2);
        let mut v3 = seed;
        let mut v4 = seed.wrapping_sub(PRIME64_1);

        while i + 32 <= data.len() {
            v1 = round(v1, read_u64(data, i));
            v2 = round(v2, read_u64(data, i + 8));
            v3 = round(v3, read_u64(data, i + 16));
            v4 = round(v4, read_u64(data, i + 24));
            i += 32;
        }

        let mut h = v1
            .rotate_left(1)
            .wrapping_add(v2.rotate_left(7))
            .wrapping_add(v3.rotate_left(12))
            .wrapping_add(v4.rotate_left(18));
        h = merge_round(h, v1);
        h = merge_round(h, v2);
        h = merge_round(h, v3);
        h = merge_round(h, v4);
        h
    } else {
        seed.wrapping_add(PRIME64_5)
    };

    h64 = h64.wrapping_add(len);

    while i + 8 <= data.len() {
        h64 ^= round(0, read_u64(data, i));
        h64 = h64.rotate_left(27).wrapping_mul(PRIME64_1).wrapping_add(PRIME64_4);
        i += 8;
    }

    if i + 4 <= data.len() {
        h64 ^= (read_u32(data, i) as u64).wrapping_mul(PRIME64_1);
        h64 = h64.rotate_left(23).wrapping_mul(PRIME64_2).wrapping_add(PRIME64_3);
        i += 4;
    }

    while i < data.len() {
        h64 ^= (data[i] as u64).wrapping_mul(PRIME64_5);
        h64 = h64.rotate_left(11).wrapping_mul(PRIME64_1);
        i += 1;
    }

    h64 ^= h64 >> 33;
    h64 = h64.wrapping_mul(PRIME64_2);
    h64 ^= h64 >> 29;
    h64 = h64.wrapping_mul(PRIME64_3);
    h64 ^= h64 >> 32;

    h64
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn matches_known_vectors() {
        assert_eq!(xxhash64(b"", 0), 0xEF46_DB37_51D8_E999);
        assert_eq!(xxhash64(b"a", 0), 0xD24E_C4F1_A98C_6E5B);
        assert_eq!(xxhash64(b"as", 0), 0x1C33_0FB2_D66B_E179);
        assert_eq!(xxhash64(b"asd", 0), 0x631C_37CE_72A9_7393);
        assert_eq!(xxhash64(b"asdf", 0), 0x4158_72F5_99CE_A71E);
    }
}
