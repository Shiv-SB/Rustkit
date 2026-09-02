pub fn weighted_mean_f32(a: &[f32], weights: &[f32]) -> f32 {
    assert_eq!(a.len(), weights.len());
    assert!(!a.is_empty());

    let total_weight: f32 = weights.iter().sum();
    assert!(total_weight > 0.0);

    a.iter()
        .zip(weights)
        .map(|(&x, &w)| x * w)
        .sum::<f32>()
        / total_weight
}
