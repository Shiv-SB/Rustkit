use crate::fft::fft::fft_in_place;

pub fn power_spectrum_f32(real: &[f32], out: &mut [f32]) {
    let n = real.len();
    let out_len = n / 2 + 1;
    assert_eq!(out.len(), out_len);

    let mut re = real.to_vec();
    let mut im = vec![0.0f32; n];

    fft_in_place(&mut re, &mut im, false);

    for k in 0..out_len {
        out[k] = re[k] * re[k] + im[k] * im[k];
    }
}
