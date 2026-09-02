// Returns initial sketch state
pub fn hyperloglog_create(precision: usize) -> Vec<u8> {
    vec![0u8; 1 << precision]
}
