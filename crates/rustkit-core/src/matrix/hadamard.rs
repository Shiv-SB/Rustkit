pub fn hadamard_f32(a: &[f32], b: &[f32], out: &mut [f32], rows: usize, cols: usize) {
    assert_eq!(a.len(), rows * cols);
    assert_eq!(b.len(), rows * cols);
    assert_eq!(out.len(), rows * cols);

    for ((o, &x), &y) in out.iter_mut().zip(a).zip(b) {
        *o = x * y;
    }
}
