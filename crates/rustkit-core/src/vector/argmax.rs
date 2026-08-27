pub fn argmax_f32(a: &[f32]) -> usize {
    assert!(!a.is_empty());

    let mut max_idx = 0;
    let mut max_val = a[0];
    for i in 1..a.len() {
        if a[i] > max_val {
            max_val = a[i];
            max_idx = i;
        }
    }
    max_idx
}
