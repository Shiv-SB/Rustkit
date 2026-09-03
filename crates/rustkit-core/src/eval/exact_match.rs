/// Byte-for-byte exact-match comparison of two sequences. Returns `true` only
/// if they are identical.
pub fn exact_match(reference: &[u8], hypothesis: &[u8]) -> bool {
    reference == hypothesis
}