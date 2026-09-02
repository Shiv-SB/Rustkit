const C1: u32 = 0xCC9E_2D51;
const C2: u32 = 0x1B87_3593;

#[inline]
fn read_u32_le(data: &[u8], offset: usize) -> u32 {
    u32::from_le_bytes(data[offset..offset + 4].try_into().unwrap())
}

#[inline]
fn fmix32(h: u32) -> u32 {
    let mut h = h;
    h ^= h >> 16;
    h = h.wrapping_mul(0x85EB_CA6B);
    h ^= h >> 13;
    h = h.wrapping_mul(0xC2B2_AE35);
    h ^= h >> 16;
    h
}

pub fn murmur3(data: &[u8], seed: u32) -> u32 {
    let mut h1 = seed;
    let mut i = 0usize;

    while i + 4 <= data.len() {
        let mut k1 = read_u32_le(data, i);
        k1 = k1.wrapping_mul(C1);
        k1 = k1.rotate_left(15);
        k1 = k1.wrapping_mul(C2);

        h1 ^= k1;
        h1 = h1.rotate_left(13);
        h1 = h1.wrapping_mul(5).wrapping_add(0xE654_6B64);
        i += 4;
    }

    let mut k1 = 0u32;
    match data.len() - i {
        3 => {
            k1 ^= (data[i + 2] as u32) << 16;
            k1 ^= (data[i + 1] as u32) << 8;
            k1 ^= data[i] as u32;
            k1 = k1.wrapping_mul(C1);
            k1 = k1.rotate_left(15);
            k1 = k1.wrapping_mul(C2);
            h1 ^= k1;
        }
        2 => {
            k1 ^= (data[i + 1] as u32) << 8;
            k1 ^= data[i] as u32;
            k1 = k1.wrapping_mul(C1);
            k1 = k1.rotate_left(15);
            k1 = k1.wrapping_mul(C2);
            h1 ^= k1;
        }
        1 => {
            k1 ^= data[i] as u32;
            k1 = k1.wrapping_mul(C1);
            k1 = k1.rotate_left(15);
            k1 = k1.wrapping_mul(C2);
            h1 ^= k1;
        }
        _ => {}
    }

    h1 ^= data.len() as u32;
    fmix32(h1)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn matches_known_vectors() {
        assert_eq!(murmur3(b"", 0), 0);
        assert_eq!(murmur3(b"", 1), 0x514E_28B7);
        assert_eq!(murmur3(b"hello", 0), 0x248B_FA47);
    }
}
