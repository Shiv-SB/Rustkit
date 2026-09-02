use crate::simd;

pub fn euclidean_f32(a: &[f32], b: &[f32]) -> f32 {
    assert_eq!(a.len(), b.len());
    simd::squared_diff_sum_f32(a, b).sqrt()
}