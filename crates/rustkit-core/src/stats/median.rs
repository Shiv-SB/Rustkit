pub fn median_f32(a: &[f32]) -> f32 {
    assert!(!a.is_empty());

    let mut sorted = a.to_vec();
    sorted.sort_by(|x, y| x.partial_cmp(y).unwrap());

    let n = sorted.len();
    if n % 2 == 1 {
        sorted[n / 2]
    } else {
        (sorted[n / 2 - 1] + sorted[n / 2]) / 2.0
    }
}
