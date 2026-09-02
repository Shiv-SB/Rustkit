pub fn trace_f32(a: &[f32], n: usize) -> f32 {
    assert_eq!(a.len(), n * n);

    (0..n).map(|i| a[i * n + i]).sum()
}
