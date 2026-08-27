pub fn lerp_f32(a: &[f32], b: &[f32], t: f32, out: &mut [f32]) {
    assert_eq!(a.len(), b.len());
    assert_eq!(a.len(), out.len());

    for i in 0..a.len() {
        out[i] = a[i] + t * (b[i] - a[i]);
    }
}
