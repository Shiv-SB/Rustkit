pub fn cross_f32(a: &[f32], b: &[f32], out: &mut [f32]) {
    assert_eq!(a.len(), 3);
    assert_eq!(b.len(), 3);
    assert_eq!(out.len(), 3);

    out[0] = a[1] * b[2] - a[2] * b[1];
    out[1] = a[2] * b[0] - a[0] * b[2];
    out[2] = a[0] * b[1] - a[1] * b[0];
}
