pub fn shannon_entropy_f32(a: &[f32]) -> f32 {
    a.iter()
        .filter(|&&p| p > 0.0)
        .map(|&p| -p * p.log2())
        .sum()
}
