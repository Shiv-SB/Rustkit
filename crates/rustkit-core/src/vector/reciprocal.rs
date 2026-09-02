pub fn reciprocal_f32(a: &[f32], out: &mut [f32]) {
    assert_eq!(a.len(), out.len());
    for (o, &x) in out.iter_mut().zip(a) {
        *o = 1.0 / x;
    }
}
