pub fn min_f32(a: &[f32], b: &[f32], out: &mut [f32]) {
    assert_eq!(a.len(), b.len());
    assert_eq!(a.len(), out.len());
    for ((o, &x), &y) in out.iter_mut().zip(a).zip(b) {
        *o = x.min(y);
    }
}