use crate::fft::fft::fft_in_place;

pub fn irfft_f32(real_in: &[f32], imag_in: &[f32], real_out: &mut [f32]) {
    assert_eq!(real_in.len(), imag_in.len());
    assert_eq!(real_out.len(), 2 * real_in.len().saturating_sub(1));

    let spec_len = real_in.len();
    let n = real_out.len();
    if n == 0 {
        return;
    }

    let mut re = vec![0.0f32; n];
    let mut im = vec![0.0f32; n];

    re[..spec_len].copy_from_slice(real_in);
    im[..spec_len].copy_from_slice(imag_in);

    for k in spec_len..n {
        re[k] = real_in[n - k];
        im[k] = -imag_in[n - k];
    }

    fft_in_place(&mut re, &mut im, true);

    real_out.copy_from_slice(&re);
}
