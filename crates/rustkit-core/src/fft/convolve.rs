use crate::fft::fft::fft_in_place;

pub fn convolve_f32(a: &[f32], b: &[f32], out: &mut [f32]) {
    if a.is_empty() || b.is_empty() {
        return;
    }

    let out_len = a.len() + b.len() - 1;
    assert_eq!(out.len(), out_len);

    let n = out_len.next_power_of_two();

    let mut fa_re = vec![0.0f32; n];
    let mut fa_im = vec![0.0f32; n];
    let mut fb_re = vec![0.0f32; n];
    let mut fb_im = vec![0.0f32; n];

    fa_re[..a.len()].copy_from_slice(a);
    fb_re[..b.len()].copy_from_slice(b);

    fft_in_place(&mut fa_re, &mut fa_im, false);
    fft_in_place(&mut fb_re, &mut fb_im, false);

    for i in 0..n {
        let (ar, ai, br, bi) = (fa_re[i], fa_im[i], fb_re[i], fb_im[i]);
        fa_re[i] = ar * br - ai * bi;
        fa_im[i] = ar * bi + ai * br;
    }

    fft_in_place(&mut fa_re, &mut fa_im, true);

    out.copy_from_slice(&fa_re[..out_len]);
}
