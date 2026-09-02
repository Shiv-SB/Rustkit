const MAX_SWEEPS: usize = 50;
const OFF_DIAG_TOL: f32 = 1e-6;

pub fn eigenvalues_f32(a: &[f32], out: &mut [f32], n: usize) -> bool {
    assert_eq!(a.len(), n * n);
    assert_eq!(out.len(), n);

    if n == 0 {
        return false;
    }
    if n == 1 {
        out[0] = a[0];
        return true;
    }

    let mut m = a.to_vec();

    for _ in 0..MAX_SWEEPS {
        let (mut p, mut q) = (0usize, 0usize);
        let mut max_off = 0.0f32;
        for i in 0..n {
            for j in i + 1..n {
                let v = m[i * n + j].abs();
                if v > max_off {
                    max_off = v;
                    p = i;
                    q = j;
                }
            }
        }

        if max_off < OFF_DIAG_TOL {
            break;
        }

        let theta = (m[q * n + q] - m[p * n + p]) / (2.0 * m[p * n + q]);
        let t = if theta >= 0.0 {
            1.0 / (theta + (1.0 + theta * theta).sqrt())
        } else {
            -1.0 / (-theta + (1.0 + theta * theta).sqrt())
        };
        let c = 1.0 / (1.0 + t * t).sqrt();
        let s = t * c;

        for k in 0..n {
            if k == p || k == q {
                continue;
            }
            let a_kp = m[k * n + p];
            let a_kq = m[k * n + q];
            m[k * n + p] = c * a_kp - s * a_kq;
            m[k * n + q] = s * a_kp + c * a_kq;
            let a_pk = m[p * n + k];
            let a_qk = m[q * n + k];
            m[p * n + k] = c * a_pk - s * a_qk;
            m[q * n + k] = s * a_pk + c * a_qk;
        }

        let app = m[p * n + p];
        let aqq = m[q * n + q];
        let apq = m[p * n + q];
        m[p * n + p] = c * c * app - 2.0 * s * c * apq + s * s * aqq;
        m[q * n + q] = s * s * app + 2.0 * s * c * apq + c * c * aqq;
        m[p * n + q] = 0.0;
        m[q * n + p] = 0.0;
    }

    for i in 0..n {
        out[i] = m[i * n + i];
    }

    true
}
