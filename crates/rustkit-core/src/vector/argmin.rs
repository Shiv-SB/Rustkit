pub fn argmin_f32(a: &[f32]) -> usize {
    assert!(!a.is_empty());

    let mut min_idx = 0;
    let mut min_val = a[0];
    for i in 1..a.len() {
        if a[i] < min_val {
            min_val = a[i];
            min_idx = i;
        }
    }
    min_idx
}
