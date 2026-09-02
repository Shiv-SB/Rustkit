use crate::fft::fft::fft_in_place;

pub fn ifft_f32(real: &mut [f32], imag: &mut [f32]) {
    assert_eq!(real.len(), imag.len());
    fft_in_place(real, imag, true);
}
