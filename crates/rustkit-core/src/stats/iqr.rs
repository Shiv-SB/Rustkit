use crate::stats::quantile_f32;

// Interquartile range (Q3 - Q1)
pub fn iqr_f32(a: &[f32]) -> f32 {
    quantile_f32(a, 0.75) - quantile_f32(a, 0.25)
}
