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
pub unsafe extern "C" fn rk_crypto_aead_encrypt(
    key: *const u8,
    nonce: *const u8,
    aad: *const u8,
    aad_len: usize,
    plaintext: *const u8,
    plaintext_len: usize,
    out: *mut u8,
) -> usize {
    if key.is_null() || nonce.is_null() || plaintext.is_null() || out.is_null() {
        return 0;
    }

    let key_arr = unsafe { &*(key as *const [u8; 32]) };
    let nonce_arr = unsafe { &*(nonce as *const [u8; 12]) };
    let aad_slice = if aad.is_null() {
        &[]
    } else {
        unsafe { std::slice::from_raw_parts(aad, aad_len) }
    };
    let plaintext_slice = unsafe { std::slice::from_raw_parts(plaintext, plaintext_len) };
    let out_slice = unsafe { std::slice::from_raw_parts_mut(out, plaintext_len + 16) };

    rustkit_core::crypto::aead_encrypt(key_arr, nonce_arr, aad_slice, plaintext_slice, out_slice)
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_crypto_aead_decrypt(
    key: *const u8,
    nonce: *const u8,
    aad: *const u8,
    aad_len: usize,
    ciphertext: *const u8,
    ciphertext_len: usize,
    out: *mut u8,
) -> bool {
    if key.is_null() || nonce.is_null() || ciphertext.is_null() || out.is_null() {
        return false;
    }

    let key_arr = unsafe { &*(key as *const [u8; 32]) };
    let nonce_arr = unsafe { &*(nonce as *const [u8; 12]) };
    let aad_slice = if aad.is_null() {
        &[]
    } else {
        unsafe { std::slice::from_raw_parts(aad, aad_len) }
    };
    let ciphertext_slice = unsafe { std::slice::from_raw_parts(ciphertext, ciphertext_len) };
    let out_slice = unsafe { std::slice::from_raw_parts_mut(out, ciphertext_len - 16) };

    rustkit_core::crypto::aead_decrypt(key_arr, nonce_arr, aad_slice, ciphertext_slice, out_slice)
        .is_ok()
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_crypto_chacha20(
    key: *const u8,
    nonce: *const u8,
    counter: u32,
    input: *const u8,
    input_len: usize,
    out: *mut u8,
) {
    if key.is_null() || nonce.is_null() || input.is_null() || out.is_null() {
        return;
    }

    let key_arr = unsafe { &*(key as *const [u8; 32]) };
    let nonce_arr = unsafe { &*(nonce as *const [u8; 12]) };
    let input_slice = unsafe { std::slice::from_raw_parts(input, input_len) };
    let out_slice = unsafe { std::slice::from_raw_parts_mut(out, input_len) };

    rustkit_core::crypto::chacha20(key_arr, nonce_arr, counter, input_slice, out_slice);
}
