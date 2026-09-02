pub fn next_set_bit(bits: &[u64], from: usize) -> Option<usize> {
    if from >= bits.len() * 64 {
        return None;
    }

    let word_idx = from / 64;
    let bit_offset = from % 64;

    let mut word = bits[word_idx] & (u64::MAX << bit_offset);
    let mut idx = word_idx;
    loop {
        if word != 0 {
            return Some(idx * 64 + word.trailing_zeros() as usize);
        }
        idx += 1;
        if idx >= bits.len() {
            return None;
        }
        word = bits[idx];
    }
}
