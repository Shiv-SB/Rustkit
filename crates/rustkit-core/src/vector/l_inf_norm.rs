use crate::simd;

pub fn l_inf_norm_f32(a: &[f32]) -> f32 {
    simd::max_abs_f32(a)
}
