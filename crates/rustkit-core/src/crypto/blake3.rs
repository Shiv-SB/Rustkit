const IV: [u32; 8] = [
    0x6A09_E667, 0xBB67_AE85, 0x3C6E_F372, 0xA54F_F53A, 0x510E_527F, 0x9B05_688C, 0x1F83_D9AB,
    0x5BE0_CD19,
];

const MSG_PERMUTATION: [usize; 16] = [2, 6, 3, 10, 7, 0, 4, 13, 1, 11, 12, 5, 9, 14, 15, 8];

const CHUNK_START: u32 = 1;
const CHUNK_END: u32 = 2;
const PARENT: u32 = 4;
const ROOT: u32 = 8;

const CHUNK_LEN: usize = 1024;
const BLOCK_LEN: usize = 64;

#[inline]
fn g(state: &mut [u32; 16], a: usize, b: usize, c: usize, d: usize, mx: u32, my: u32) {
    state[a] = state[a].wrapping_add(state[b]).wrapping_add(mx);
    state[d] = (state[d] ^ state[a]).rotate_right(16);
    state[c] = state[c].wrapping_add(state[d]);
    state[b] = (state[b] ^ state[c]).rotate_right(12);
    state[a] = state[a].wrapping_add(state[b]).wrapping_add(my);
    state[d] = (state[d] ^ state[a]).rotate_right(8);
    state[c] = state[c].wrapping_add(state[d]);
    state[b] = (state[b] ^ state[c]).rotate_right(7);
}

fn compress(cv: &[u32; 8], block: &[u8; BLOCK_LEN], counter: u64, block_len: u32, flags: u32) -> [u32; 8] {
    let mut m = [0u32; 16];
    for (i, word) in m.iter_mut().enumerate() {
        *word = u32::from_le_bytes(block[i * 4..i * 4 + 4].try_into().unwrap());
    }

    let mut v = [0u32; 16];
    v[..8].copy_from_slice(cv);
    v[8..12].copy_from_slice(&IV[..4]);
    v[12] = counter as u32;
    v[13] = (counter >> 32) as u32;
    v[14] = block_len;
    v[15] = flags;

    let mut msg = m;
    for _ in 0..7 {
        g(&mut v, 0, 4, 8, 12, msg[0], msg[1]);
        g(&mut v, 1, 5, 9, 13, msg[2], msg[3]);
        g(&mut v, 2, 6, 10, 14, msg[4], msg[5]);
        g(&mut v, 3, 7, 11, 15, msg[6], msg[7]);
        g(&mut v, 0, 5, 10, 15, msg[8], msg[9]);
        g(&mut v, 1, 6, 11, 12, msg[10], msg[11]);
        g(&mut v, 2, 7, 8, 13, msg[12], msg[13]);
        g(&mut v, 3, 4, 9, 14, msg[14], msg[15]);

        let mut next = [0u32; 16];
        for i in 0..16 {
            next[i] = msg[MSG_PERMUTATION[i]];
        }
        msg = next;
    }

    let mut out = [0u32; 8];
    for i in 0..8 {
        out[i] = v[i] ^ v[i + 8];
    }
    out
}

fn words_to_bytes(words: &[u32; 8]) -> [u8; 32] {
    let mut out = [0u8; 32];
    for (i, w) in words.iter().enumerate() {
        out[i * 4..i * 4 + 4].copy_from_slice(&w.to_le_bytes());
    }
    out
}

fn chunk_cv(chunk: &[u8], chunk_counter: u64, is_root: bool) -> [u8; 32] {
    let mut cv = IV;
    let n_blocks = chunk.len().div_ceil(BLOCK_LEN).max(1);

    for i in 0..n_blocks {
        let start = i * BLOCK_LEN;
        let end = (start + BLOCK_LEN).min(chunk.len());
        let mut block = [0u8; BLOCK_LEN];
        block[..end - start].copy_from_slice(&chunk[start..end]);

        let mut flags = 0u32;
        if i == 0 {
            flags |= CHUNK_START;
        }
        if i == n_blocks - 1 {
            flags |= CHUNK_END;
            if is_root {
                flags |= ROOT;
            }
        }

        cv = compress(&cv, &block, chunk_counter, (end - start) as u32, flags);
    }

    words_to_bytes(&cv)
}

fn parent_cv(left: &[u8; 32], right: &[u8; 32], flags: u32) -> [u8; 32] {
    let mut block = [0u8; BLOCK_LEN];
    block[..32].copy_from_slice(left);
    block[32..].copy_from_slice(right);
    words_to_bytes(&compress(&IV, &block, 0, BLOCK_LEN as u32, flags))
}

pub fn blake3(data: &[u8], out: &mut [u8; 32]) {
    if data.len() <= CHUNK_LEN {
        *out = chunk_cv(data, 0, true);
        return;
    }

    let mut stack: Vec<[u8; 32]> = Vec::new();
    let mut sizes: Vec<usize> = Vec::new();

    for (idx, chunk) in data.chunks(CHUNK_LEN).enumerate() {
        let cv = chunk_cv(chunk, idx as u64, false);
        stack.push(cv);
        sizes.push(1);

        while sizes.len() >= 2 && sizes[sizes.len() - 1] == sizes[sizes.len() - 2] {
            let right = stack.pop().unwrap();
            let right_size = sizes.pop().unwrap();
            let left = stack.pop().unwrap();
            let left_size = sizes.pop().unwrap();
            stack.push(parent_cv(&left, &right, PARENT));
            sizes.push(left_size + right_size);
        }
    }

    while stack.len() > 1 {
        let right = stack.pop().unwrap();
        let left = stack.pop().unwrap();
        let flags = if stack.is_empty() { PARENT | ROOT } else { PARENT };
        stack.push(parent_cv(&left, &right, flags));
    }

    *out = stack.pop().unwrap();
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn matches_known_vectors() {
        let mut out = [0u8; 32];
        blake3(b"", &mut out);
        assert_eq!(
            out,
            hex_literal(&[
                0xAF, 0x13, 0x49, 0xB9, 0xF5, 0xF9, 0xA1, 0xA6, 0xA0, 0x40, 0x4D, 0xEA, 0x36, 0xDC,
                0xC9, 0x49, 0x9B, 0xCB, 0x25, 0xC9, 0xAD, 0xC1, 0x12, 0xB7, 0xCC, 0x9A, 0x93, 0xCA,
                0xE4, 0x1F, 0x32, 0x62,
            ])
        );

        blake3(b"abc", &mut out);
        assert_eq!(
            out,
            hex_literal(&[
                0x64, 0x37, 0xB3, 0xAC, 0x38, 0x46, 0x51, 0x33, 0xFF, 0xB6, 0x3B, 0x75, 0x27, 0x3A,
                0x8D, 0xB5, 0x48, 0xC5, 0x58, 0x46, 0x5D, 0x79, 0xDB, 0x03, 0xFD, 0x35, 0x9C, 0x6C,
                0xD5, 0xBD, 0x9D, 0x85,
            ])
        );
    }

    fn hex_literal(bytes: &[u8]) -> [u8; 32] {
        let mut out = [0u8; 32];
        out.copy_from_slice(bytes);
        out
    }
}
