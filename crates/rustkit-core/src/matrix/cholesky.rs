pub fn cholesky_f32(a: &[f32], out: &mut [f32], n: usize) -> bool {
    assert_eq!(a.len(), n * n);
    assert_eq!(out.len(), n * n);

    if n == 0 {
        return false;
    }

    let mut l = vec![0.0f32; n * n];

    for i in 0..n {
        for j in 0..=i {
            let mut sum = a[i * n + j];
            for k in 0..j {
                sum -= l[i * n + k] * l[j * n + k];
            }

            if i == j {
                if sum <= 0.0 {
                    return false;
                }
                l[i * n + i] = sum.sqrt();
            } else {
                l[i * n + j] = sum / l[j * n + j];
            }
        }
    }

    out.copy_from_slice(&l);

    true
}
