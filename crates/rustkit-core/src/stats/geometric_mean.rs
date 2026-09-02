pub fn geometric_mean_f32(a: &[f32]) -> f32 {
    assert!(!a.is_empty());

    let sum_ln = a.iter().map(|x| x.ln()).sum::<f32>();
    (sum_ln / a.len() as f32).exp()
}
