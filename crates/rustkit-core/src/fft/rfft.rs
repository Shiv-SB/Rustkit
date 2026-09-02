use crate::fft::fft::fft_in_place;

pub fn rfft_f32(real_in: &[f32], real_out: &mut [f32], imag_out: &mut [f32]) {
    let n = real_in.len();
    let out_len = n / 2 + 1;
    assert_eq!(real_out.len(), out_len);
    assert_eq!(imag_out.len(), out_len);

    let mut re = real_in.to_vec();
    let mut im = vec![0.0f32; n];

    fft_in_place(&mut re, &mut im, false);

    real_out.copy_from_slice(&re[..out_len]);
    imag_out.copy_from_slice(&im[..out_len]);
}
