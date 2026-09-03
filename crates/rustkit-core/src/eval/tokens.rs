/// Splits a byte slice into whitespace-separated tokens (ASCII whitespace,
/// matching `TextEncoder` output for typical English text).
pub(crate) fn tokenize(bytes: &[u8]) -> Vec<&[u8]> {
    bytes
        .split(|b| b.is_ascii_whitespace())
        .filter(|t| !t.is_empty())
        .collect()
}