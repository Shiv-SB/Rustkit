use crate::crypto::xxhash64;

pub fn hyperloglog_add(sketch: &mut [u8], item: &[u8]) {
    assert!(!sketch.is_empty());
    assert!(sketch.len().is_power_of_two());

    let precision = sketch.len().trailing_zeros();
    let hash = xxhash64(item, 0);
    let idx = (hash & ((1 << precision) - 1)) as usize;
    let w = hash >> precision;
    let rho = w.leading_zeros() as u8 + 1;

    if rho > sketch[idx] {
        sketch[idx] = rho;
    }
}
