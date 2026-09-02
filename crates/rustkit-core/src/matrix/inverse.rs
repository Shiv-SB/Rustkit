pub fn inverse_f32(a: &[f32], out: &mut [f32], n: usize) -> bool {
    assert_eq!(a.len(), n * n);
    assert_eq!(out.len(), n * n);

    if n == 0 {
        return false;
    }

    let width = 2 * n;
    let mut m = vec![0.0f32; n * width];

    for i in 0..n {
        for j in 0..n {
            m[i * width + j] = a[i * n + j];
        }
        m[i * width + n + i] = 1.0;
    }

    for col in 0..n {
        let mut pivot = col;
        for r in col + 1..n {
            if m[r * width + col].abs() > m[pivot * width + col].abs() {
                pivot = r;
            }
        }

        if m[pivot * width + col] == 0.0 {
            return false;
        }

        if pivot != col {
            for c in 0..width {
                m.swap(col * width + c, pivot * width + c);
            }
        }

        let pv = m[col * width + col];
        for c in 0..width {
            m[col * width + c] /= pv;
        }

        for r in 0..n {
            if r == col {
                continue;
            }
            let factor = m[r * width + col];
            if factor == 0.0 {
                continue;
            }
            for c in 0..width {
                m[r * width + c] -= factor * m[col * width + c];
            }
        }
    }

    for i in 0..n {
        for j in 0..n {
            out[i * n + j] = m[i * width + n + j];
        }
    }

    true
}
