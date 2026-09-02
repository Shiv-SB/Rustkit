pub fn quantile_f32(a: &[f32], q: f32) -> f32 {
    assert!(!a.is_empty());

    let mut sorted = a.to_vec();
    sorted.sort_by(|x, y| x.partial_cmp(y).unwrap());

    let n = sorted.len();
    if n == 1 {
        return sorted[0];
    }

    let rank = q.clamp(0.0, 1.0) * (n - 1) as f32;
    let lower = rank.floor() as usize;
    let upper = rank.ceil() as usize;
    let frac = rank - lower as f32;

    sorted[lower] + frac * (sorted[upper] - sorted[lower])
}
