pub fn lu_decompose_f32(a: &[f32], out_l: &mut [f32], out_u: &mut [f32], n: usize) -> bool {
    assert_eq!(a.len(), n * n);
    assert_eq!(out_l.len(), n * n);
    assert_eq!(out_u.len(), n * n);

    if n == 0 {
        return false;
    }

    let mut u = a.to_vec();
    let mut l = vec![0.0f32; n * n];

    for i in 0..n {
        l[i * n + i] = 1.0;
    }

    for k in 0..n {
        if u[k * n + k] == 0.0 {
            return false;
        }
        for i in k + 1..n {
            let factor = u[i * n + k] / u[k * n + k];
            l[i * n + k] = factor;
            if factor == 0.0 {
                continue;
            }
            for j in k..n {
                u[i * n + j] -= factor * u[k * n + j];
            }
        }
    }

    out_l.copy_from_slice(&l);
    out_u.copy_from_slice(&u);

    true
}
