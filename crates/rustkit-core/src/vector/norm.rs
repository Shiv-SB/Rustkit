use crate::simd;

pub fn norm_f32(a: &[f32]) -> f32 {
    simd::dot_f32(a, a).sqrt()
}
