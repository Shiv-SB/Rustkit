pub fn sort_f32(a: &mut [f32]) {
    a.sort_by(|x, y| x.partial_cmp(y).unwrap());
}
