use crate::stats::quantile_f32;

pub fn percentile_f32(a: &[f32], p: f32) -> f32 {
    quantile_f32(a, p / 100.0)
}
