use crate::simd;

pub fn mean_f32(a: &[f32]) -> f32 {
    assert!(!a.is_empty());
    simd::sum_f32(a) / a.len() as f32
}
