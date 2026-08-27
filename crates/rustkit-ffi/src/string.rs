#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_string_levenshtein(
    a: *const u8,
    a_len: usize,
    b: *const u8,
    b_len: usize,
) -> usize {
    if a.is_null() || b.is_null() {
        return 0;
    }

    let a_slice = unsafe { std::slice::from_raw_parts(a, a_len) };
    let b_slice = unsafe { std::slice::from_raw_parts(b, b_len) };

    rustkit_core::string::levenshtein(a_slice, b_slice)
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_string_hamming(
    a: *const u8,
    a_len: usize,
    b: *const u8,
    b_len: usize,
) -> usize {
    if a.is_null() || b.is_null() {
        return 0;
    }

    let a_slice = unsafe { std::slice::from_raw_parts(a, a_len) };
    let b_slice = unsafe { std::slice::from_raw_parts(b, b_len) };

    rustkit_core::string::hamming(a_slice, b_slice)
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_string_fuzzy_match(
    pattern: *const u8,
    pattern_len: usize,
    text: *const u8,
    text_len: usize,
    out: *mut usize,
) -> bool {
    if pattern.is_null() || text.is_null() || out.is_null() {
        return false;
    }

    let pattern_slice = unsafe { std::slice::from_raw_parts(pattern, pattern_len) };
    let text_slice = unsafe { std::slice::from_raw_parts(text, text_len) };

    match rustkit_core::string::fuzzy_match(pattern_slice, text_slice) {
        Some(idx) => {
            unsafe { *out = idx; }
            true
        }
        None => false,
    }
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_string_longest_common_subseq(
    a: *const u8,
    a_len: usize,
    b: *const u8,
    b_len: usize,
) -> usize {
    if a.is_null() || b.is_null() {
        return 0;
    }

    let a_slice = unsafe { std::slice::from_raw_parts(a, a_len) };
    let b_slice = unsafe { std::slice::from_raw_parts(b, b_len) };

    rustkit_core::string::longest_common_subseq(a_slice, b_slice)
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn rk_string_longest_common_substr(
    a: *const u8,
    a_len: usize,
    b: *const u8,
    b_len: usize,
) -> usize {
    if a.is_null() || b.is_null() {
        return 0;
    }

    let a_slice = unsafe { std::slice::from_raw_parts(a, a_len) };
    let b_slice = unsafe { std::slice::from_raw_parts(b, b_len) };

    rustkit_core::string::longest_common_substr(a_slice, b_slice)
}
