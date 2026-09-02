pub fn sqrt_f32(a: &[f32], out: &mut [f32]) {
    assert_eq!(a.len(), out.len());
    for (o, &x) in out.iter_mut().zip(a) {
        *o = x.sqrt();
    }
}
