#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_config_version(out: *mut u8, out_len: usize) {
    if out.is_null() {
        return;
    }

    let bytes = rustkit_core::config::version().as_bytes();
    let n = bytes.len().min(out_len);
    unsafe { std::ptr::copy_nonoverlapping(bytes.as_ptr(), out, n) };
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_config_simd() -> u32 {
    match rustkit_core::config::simd_backend() {
        "neon" => 1,
        "avx2" => 2,
        "sse2" => 3,
        _ => 0,
    }
}