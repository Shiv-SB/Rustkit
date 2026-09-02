pub fn outer_f32(a: &[f32], b: &[f32], out: &mut [f32], rows: usize, cols: usize) {
    assert_eq!(a.len(), rows);
    assert_eq!(b.len(), cols);
    assert_eq!(out.len(), rows * cols);

    for i in 0..rows {
        let ai = a[i];
        for (j, o) in out[i * cols..(i + 1) * cols].iter_mut().enumerate() {
            *o = ai * b[j];
        }
    }
}
