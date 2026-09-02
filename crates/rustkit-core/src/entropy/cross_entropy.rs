pub fn cross_entropy_f32(a: &[f32], b: &[f32]) -> f32 {
    assert_eq!(a.len(), b.len());

    a.iter()
        .copied()
        .zip(b.iter().copied())
        .filter(|(p, q)| *p > 0.0 && *q > 0.0)
        .map(|(p, q)| -p * q.log2())
        .sum()
}
