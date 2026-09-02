const TWO_PI: f32 = std::f32::consts::TAU;

pub fn fft_f32(real: &mut [f32], imag: &mut [f32]) {
    assert_eq!(real.len(), imag.len());
    fft_in_place(real, imag, false);
}

/// In-place complex FFT. `inverse` applies the conjugate exponent and
/// the 1/n normalization. Uses radix-2 Cooley-Tukey for power-of-two
/// sizes and a direct DFT otherwise.
pub(crate) fn fft_in_place(real: &mut [f32], imag: &mut [f32], inverse: bool) {
    let n = real.len();
    if n <= 1 {
        return;
    }

    if n.is_power_of_two() {
        fft_radix2(real, imag, inverse);
    } else {
        dft(real, imag, inverse);
    }
}

fn fft_radix2(real: &mut [f32], imag: &mut [f32], inverse: bool) {
    let n = real.len();

    let mut j = 0usize;
    for i in 1..n {
        let mut bit = n >> 1;
        while j & bit != 0 {
            j ^= bit;
            bit >>= 1;
        }
        j ^= bit;
        if i < j {
            real.swap(i, j);
            imag.swap(i, j);
        }
    }

    let sign = if inverse { 1.0 } else { -1.0 };
    let mut len = 2;
    while len <= n {
        let angle = sign * TWO_PI / len as f32;
        let (wlen_r, wlen_i) = angle.sin_cos();
        let half = len / 2;

        let mut i = 0;
        while i < n {
            let mut wr = 1.0f32;
            let mut wi = 0.0f32;
            for k in 0..half {
                let ar = real[i + k];
                let ai = imag[i + k];
                let br = real[i + k + half] * wr - imag[i + k + half] * wi;
                let bi = real[i + k + half] * wi + imag[i + k + half] * wr;
                real[i + k] = ar + br;
                imag[i + k] = ai + bi;
                real[i + k + half] = ar - br;
                imag[i + k + half] = ai - bi;
                let nwr = wr * wlen_r - wi * wlen_i;
                wi = wr * wlen_i + wi * wlen_r;
                wr = nwr;
            }
            i += len;
        }
        len <<= 1;
    }

    if inverse {
        let inv = 1.0 / n as f32;
        for (r, i) in real.iter_mut().zip(imag.iter_mut()) {
            *r *= inv;
            *i *= inv;
        }
    }
}

fn dft(real: &mut [f32], imag: &mut [f32], inverse: bool) {
    let n = real.len();
    let sign = if inverse { 1.0 } else { -1.0 };
    let mut out_r = vec![0.0f32; n];
    let mut out_i = vec![0.0f32; n];

    for k in 0..n {
        let mut sr = 0.0f32;
        let mut si = 0.0f32;
        for t in 0..n {
            let angle = sign * TWO_PI * (k * t) as f32 / n as f32;
            let (c, s) = angle.sin_cos();
            sr += real[t] * c - imag[t] * s;
            si += real[t] * s + imag[t] * c;
        }
        out_r[k] = sr;
        out_i[k] = si;
    }

    if inverse {
        let inv = 1.0 / n as f32;
        for v in out_r.iter_mut() {
            *v *= inv;
        }
        for v in out_i.iter_mut() {
            *v *= inv;
        }
    }

    real.copy_from_slice(&out_r);
    imag.copy_from_slice(&out_i);
}
