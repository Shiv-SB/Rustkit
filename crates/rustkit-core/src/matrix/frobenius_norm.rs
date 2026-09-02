use crate::simd;

pub fn frobenius_norm_f32(a: &[f32], rows: usize, cols: usize) -> f32 {
    assert_eq!(a.len(), rows * cols);
    simd::dot_f32(a, a).sqrt()
}
