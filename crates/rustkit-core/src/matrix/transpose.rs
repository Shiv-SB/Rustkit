pub fn transpose_f32(a: &[f32], out: &mut [f32], rows: usize, cols: usize) {
    assert_eq!(a.len(), rows * cols);
    assert_eq!(out.len(), rows * cols);

    for i in 0..rows {
        for j in 0..cols {
            out[j * rows + i] = a[i * cols + j];
        }
    }
}
