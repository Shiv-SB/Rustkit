// Returns signature of num_hashes u32 values, all initialized to u32::MAX.
pub fn minhash_create(num_hashes: usize) -> Vec<u32> {
    vec![u32::MAX; num_hashes]
}
