#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_fft_fft_f32(
    real: *mut f32,
    imag: *mut f32,
    len: usize,
) {
    if real.is_null() || imag.is_null() {
        return;
    }

    let real_slice = unsafe { std::slice::from_raw_parts_mut(real, len) };
    let imag_slice = unsafe { std::slice::from_raw_parts_mut(imag, len) };

    rustkit_core::fft::fft_f32(real_slice, imag_slice);
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_fft_ifft_f32(
    real: *mut f32,
    imag: *mut f32,
    len: usize,
) {
    if real.is_null() || imag.is_null() {
        return;
    }

    let real_slice = unsafe { std::slice::from_raw_parts_mut(real, len) };
    let imag_slice = unsafe { std::slice::from_raw_parts_mut(imag, len) };

    rustkit_core::fft::ifft_f32(real_slice, imag_slice);
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_fft_rfft_f32(
    real_in: *const f32,
    real_out: *mut f32,
    imag_out: *mut f32,
    n: usize,
) {
    if real_in.is_null() || real_out.is_null() || imag_out.is_null() {
        return;
    }

    let in_slice = unsafe { std::slice::from_raw_parts(real_in, n) };
    let out_len = n / 2 + 1;
    let real_out_slice = unsafe { std::slice::from_raw_parts_mut(real_out, out_len) };
    let imag_out_slice = unsafe { std::slice::from_raw_parts_mut(imag_out, out_len) };

    rustkit_core::fft::rfft_f32(in_slice, real_out_slice, imag_out_slice);
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_fft_irfft_f32(
    real_in: *const f32,
    imag_in: *const f32,
    real_out: *mut f32,
    spec_len: usize,
) {
    if real_in.is_null() || imag_in.is_null() || real_out.is_null() {
        return;
    }

    let real_in_slice = unsafe { std::slice::from_raw_parts(real_in, spec_len) };
    let imag_in_slice = unsafe { std::slice::from_raw_parts(imag_in, spec_len) };
    let out_len = spec_len.saturating_sub(1) * 2;
    let out_slice = unsafe { std::slice::from_raw_parts_mut(real_out, out_len) };

    rustkit_core::fft::irfft_f32(real_in_slice, imag_in_slice, out_slice);
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_fft_convolve_f32(
    a: *const f32,
    a_len: usize,
    b: *const f32,
    b_len: usize,
    out: *mut f32,
) {
    if a.is_null() || b.is_null() || out.is_null() {
        return;
    }

    let a_slice = unsafe { std::slice::from_raw_parts(a, a_len) };
    let b_slice = unsafe { std::slice::from_raw_parts(b, b_len) };
    let out_len = if a_len == 0 || b_len == 0 {
        0
    } else {
        a_len + b_len - 1
    };
    let out_slice = unsafe { std::slice::from_raw_parts_mut(out, out_len) };

    rustkit_core::fft::convolve_f32(a_slice, b_slice, out_slice);
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_fft_power_spectrum_f32(
    real: *const f32,
    out: *mut f32,
    len: usize,
) {
    if real.is_null() || out.is_null() {
        return;
    }

    let real_slice = unsafe { std::slice::from_raw_parts(real, len) };
    let out_len = len / 2 + 1;
    let out_slice = unsafe { std::slice::from_raw_parts_mut(out, out_len) };

    rustkit_core::fft::power_spectrum_f32(real_slice, out_slice);
}
