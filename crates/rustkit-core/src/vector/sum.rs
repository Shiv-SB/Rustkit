use crate::simd;

pub fn sum_f32(a: &[f32]) -> f32 {
    simd::sum_f32(a)
}
