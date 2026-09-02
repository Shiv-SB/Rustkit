use crate::simd;

pub fn l1_norm_f32(a: &[f32]) -> f32 {
    simd::l1_f32(a)
}
