pub fn stddev_f32(a: &[f32]) -> f32 {
    crate::stats::variance_f32(a).sqrt()
}
