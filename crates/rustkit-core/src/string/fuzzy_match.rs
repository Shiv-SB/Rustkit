/// Greedy subsequence match. Returns the index of the first matched byte
/// in `text` when `pattern` occurs as a subsequence.
pub fn fuzzy_match(pattern: &[u8], text: &[u8]) -> Option<usize> {
    if pattern.is_empty() {
        return Some(0);
    }

    let mut pat_idx = 0;
    let mut start = None;

    for (i, &c) in text.iter().enumerate() {
        if c == pattern[pat_idx] {
            if start.is_none() {
                start = Some(i);
            }
            pat_idx += 1;
            if pat_idx == pattern.len() {
                return start;
            }
        }
    }

    None
}
