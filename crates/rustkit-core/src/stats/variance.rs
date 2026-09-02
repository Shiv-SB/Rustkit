pub fn variance_f32(a: &[f32]) -> f32 {
    assert!(!a.is_empty());

    let mean = a.iter().sum::<f32>() / a.len() as f32;
    a.iter().map(|x| (x - mean) * (x - mean)).sum::<f32>() / a.len() as f32
}
