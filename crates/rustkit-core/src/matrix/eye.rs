pub fn eye_f32(out: &mut [f32], n: usize) {
    assert_eq!(out.len(), n * n);

    out.fill(0.0);
    for i in 0..n {
        out[i * n + i] = 1.0;
    }
}
