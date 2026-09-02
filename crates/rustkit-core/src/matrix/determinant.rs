pub fn determinant_f32(a: &[f32], n: usize) -> f32 {
    assert_eq!(a.len(), n * n);

    match n {
        0 => return 0.0,
        1 => return a[0],
        2 => return a[0] * a[3] - a[1] * a[2],
        3 => {
            return a[0] * (a[4] * a[8] - a[5] * a[7])
                - a[1] * (a[3] * a[8] - a[5] * a[6])
                + a[2] * (a[3] * a[7] - a[4] * a[6]);
        }
        _ => {}
    }

    let mut m = a.to_vec();
    let mut det = 1.0f32;
    let mut sign = 1.0f32;

    for i in 0..n {
        let mut pivot = i;
        for r in i + 1..n {
            if m[r * n + i].abs() > m[pivot * n + i].abs() {
                pivot = r;
            }
        }

        if m[pivot * n + i] == 0.0 {
            return 0.0;
        }

        if pivot != i {
            for c in 0..n {
                m.swap(i * n + c, pivot * n + c);
            }
            sign = -sign;
        }

        det *= m[i * n + i];

        for r in i + 1..n {
            let factor = m[r * n + i] / m[i * n + i];
            if factor == 0.0 {
                continue;
            }
            for c in i + 1..n {
                m[r * n + c] -= factor * m[i * n + c];
            }
        }
    }

    det * sign
}
