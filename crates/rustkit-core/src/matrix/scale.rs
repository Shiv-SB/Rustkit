pub fn scale_f32(a: &[f32], scalar: f32, out: &mut [f32], rows: usize, cols: usize) {
    assert_eq!(a.len(), rows * cols);
    assert_eq!(out.len(), rows * cols);

    for (o, &x) in out.iter_mut().zip(a) {
        *o = x * scalar;
    }
}
