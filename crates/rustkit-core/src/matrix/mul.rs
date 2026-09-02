pub fn mul_f32(a: &[f32], b: &[f32], out: &mut [f32], rows_a: usize, cols_a: usize, cols_b: usize) {
    assert_eq!(a.len(), rows_a * cols_a);
    assert_eq!(b.len(), cols_a * cols_b);
    assert_eq!(out.len(), rows_a * cols_b);

    out.fill(0.0);

    for i in 0..rows_a {
        for k in 0..cols_a {
            let a_ik = a[i * cols_a + k];
            if a_ik == 0.0 {
                continue;
            }
            let b_row = &b[k * cols_b..(k + 1) * cols_b];
            let out_row = &mut out[i * cols_b..(i + 1) * cols_b];
            for (o, &b_kj) in out_row.iter_mut().zip(b_row) {
                *o += a_ik * b_kj;
            }
        }
    }
}
