pub fn normalize_f32(a: &[f32], out: &mut [f32]) {
    assert_eq!(a.len(), out.len());

    let mut sum = 0.0;
    for v in a {
        sum += v * v;
    }
    let n = sum.sqrt();

    for i in 0..a.len() {
        out[i] = a[i] / n;
    }
}
