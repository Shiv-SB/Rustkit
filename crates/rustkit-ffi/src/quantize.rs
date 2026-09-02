#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_quantize_quantize_int8_f32(
    a: *const f32,
    out: *mut i8,
    len: usize,
) -> f32 {
    if a.is_null() || out.is_null() {
        return 0.0;
    }

    let a_slice = unsafe { std::slice::from_raw_parts(a, len) };
    let out_slice = unsafe { std::slice::from_raw_parts_mut(out, len) };

    rustkit_core::quantize::quantize_int8_f32(a_slice, out_slice)
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_quantize_dequantize_int8_f32(
    quantized: *const i8,
    scale: f32,
    out: *mut f32,
    len: usize,
) {
    if quantized.is_null() || out.is_null() {
        return;
    }

    let quantized_slice = unsafe { std::slice::from_raw_parts(quantized, len) };
    let out_slice = unsafe { std::slice::from_raw_parts_mut(out, len) };

    rustkit_core::quantize::dequantize_int8_f32(quantized_slice, scale, out_slice);
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_quantize_quantize_int4_f32(
    a: *const f32,
    out: *mut u8,
    len: usize,
) -> f32 {
    if a.is_null() || out.is_null() {
        return 0.0;
    }

    let a_slice = unsafe { std::slice::from_raw_parts(a, len) };
    let out_len = (len + 1) / 2;
    let out_slice = unsafe { std::slice::from_raw_parts_mut(out, out_len) };

    rustkit_core::quantize::quantize_int4_f32(a_slice, out_slice)
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_quantize_dequantize_int4_f32(
    quantized: *const u8,
    quantized_len: usize,
    scale: f32,
    out: *mut f32,
    out_len: usize,
) {
    if quantized.is_null() || out.is_null() {
        return;
    }

    let quantized_slice = unsafe { std::slice::from_raw_parts(quantized, quantized_len) };
    let out_slice = unsafe { std::slice::from_raw_parts_mut(out, out_len) };

    rustkit_core::quantize::dequantize_int4_f32(quantized_slice, scale, out_slice);
}
