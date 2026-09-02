pub fn covariance_f32(a: &[f32], b: &[f32]) -> f32 {
    assert_eq!(a.len(), b.len());
    assert!(!a.is_empty());

    let mean_a = a.iter().sum::<f32>() / a.len() as f32;
    let mean_b = b.iter().sum::<f32>() / b.len() as f32;

    a.iter()
        .zip(b)
        .map(|(&x, &y)| (x - mean_a) * (y - mean_b))
        .sum::<f32>()
        / a.len() as f32
}
