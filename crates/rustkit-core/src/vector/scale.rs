pub fn scale_f32(a: &[f32], scalar: f32, out: &mut [f32]) {
    assert_eq!(a.len(), out.len());

    for i in 0..a.len() {
        out[i] = a[i] * scalar;
    }
}
