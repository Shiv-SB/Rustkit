#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_crypto_crc32(
    data: *const u8,
    len: usize,
) -> u32 {
    if data.is_null() {
        return 0;
    }

    let data_slice = unsafe { std::slice::from_raw_parts(data, len) };

    rustkit_core::crypto::crc32(data_slice)
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_crypto_xxhash64(
    data: *const u8,
    len: usize,
    seed: u64,
) -> u64 {
    if data.is_null() {
        return 0;
    }

    let data_slice = unsafe { std::slice::from_raw_parts(data, len) };

    rustkit_core::crypto::xxhash64(data_slice, seed)
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_crypto_fnv1a(
    data: *const u8,
    len: usize,
) -> u64 {
    if data.is_null() {
        return 0;
    }

    let data_slice = unsafe { std::slice::from_raw_parts(data, len) };

    rustkit_core::crypto::fnv1a(data_slice)
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_crypto_blake3(
    data: *const u8,
    len: usize,
    out: *mut u8,
) {
    if data.is_null() || out.is_null() {
        return;
    }

    let data_slice = unsafe { std::slice::from_raw_parts(data, len) };
    let out_arr = unsafe { &mut *(out as *mut [u8; 32]) };

    rustkit_core::crypto::blake3(data_slice, out_arr);
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_crypto_murmur3(
    data: *const u8,
    len: usize,
    seed: u32,
) -> u32 {
    if data.is_null() {
        return 0;
    }

    let data_slice = unsafe { std::slice::from_raw_parts(data, len) };

    rustkit_core::crypto::murmur3(data_slice, seed)
}
