const BASE32: &[u8; 32] = b"0123456789bcdefghjkmnpqrstuvwxyz";

pub fn is_valid(hash: &[u8]) -> bool {
    !hash.is_empty() && hash.iter().all(|c| BASE32.contains(c))
}
