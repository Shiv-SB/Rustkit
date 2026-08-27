pub fn mean_f32(a: &[f32]) -> f32 {
    assert!(!a.is_empty());
    let mut sum = 0.0;
    for v in a {
        sum += v;
    }
    sum / a.len() as f32
}
